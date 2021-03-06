package com.edeqa.edequate.rest.system;

import com.edeqa.edequate.abstracts.AbstractAction;
import com.edeqa.edequate.helpers.WebPath;
import com.edeqa.eventbus.EventBus;
import com.edeqa.helpers.Misc;
import com.edeqa.helpers.interfaces.Consumer;

import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.concurrent.Callable;

@SuppressWarnings("WeakerAccess")
public class OneTime extends AbstractAction<Void> {

    public static final String TYPE = "/rest/onetime";

    private static final String FINISHED = "finished";
    public static final String LINK = "link";
    public static final String NONCE = "nonce";
    private static final String ORIGIN = "origin";
    private static final String PAYLOAD = "payload";
    private static final String STRONG = "strong";
    public static final String TIMEOUT = "timeout";
    public static final String TIMESTAMP = "timestamp";
    public static final String TOKEN = "token";
    public static final String MAX_TRIES = "max_tries";
    public static final String TRIED = "tried";

    private static final long EXPIRATION_TIMEOUT = 1000 * 60 * 15L;
    private static final int MAX_TRIES_DEFAULT = 1;

//    private static WebPath tokensFile;

    @Override
    public String getType() {
        return TYPE;
    }

    @Override
    public void call(JSONObject event, Void object) {
    }

    public Action create() {
        return new Action();
    }

    /**
     * One-time guaranteed browser interacted accept.<p>
     * Sequence, shortly:<p>
     * - {@code start} generates public token and stores payload<p>
     * - {@code process} checks public token, generates and then verifies private token<p>
     */
    @SuppressWarnings("WeakerAccess")
    public static class Action {
        private final Arguments arguments;
        private Callable<String> onFetchToken;
        private Runnable onWelcome;
        private Consumer<String> onStart;
        private Consumer<String> onCheck;
        private Consumer<JSONObject> onSuccess;
        private Consumer<Throwable> onError;
        private HashMap<String, Serializable> payload;
        private JSONObject requestOptions;
        private Long expirationTimeout;
        private boolean strong;
        private int maxTries;

        public Action() {
            //noinspection unchecked
            arguments = (Arguments) ((EventBus<AbstractAction>) EventBus.getOrCreate(SYSTEMBUS)).getHolder(Arguments.TYPE);
            setExpirationTimeout(EXPIRATION_TIMEOUT);
            setMaxTries(MAX_TRIES_DEFAULT);
        }

        /**
         * Generates and stores the token using the payload was set with {@code setPayload}. After all calls {@code onStart} with token. Thus, {@code setPayload} and {@code setOnStart} must be called before {@code start}.
         */
        public void start() throws Exception {

            JSONObject json = new JSONObject();
            json.put(TIMESTAMP, System.currentTimeMillis());
            json.put(PAYLOAD, getPayload());
            json.put(TIMEOUT, getExpirationTimeout());
            json.put(MAX_TRIES, getMaxTries());
            if (isStrong()) json.put(STRONG, true);

            String nonce = onFetchToken.call();
            addAction(nonce, json);
            getOnStart().accept(nonce);

            new Thread(this::removeExpiredActions).start();
        }

        protected void addAction(String token, JSONObject json) throws IOException {
            WebPath tokenFile = new WebPath(arguments.getWebRootDirectory(), "data/one-time/." + token + ".json");
            tokenFile.save(json.toString(2));
        }

        public void process() throws Exception {
            if (getRequestOptions().has(TOKEN)) {
                String token = getRequestOptions().getString(TOKEN);
                JSONObject requested = getAction(token);
                if (requested == null) {
                    getOnError().accept(new Throwable("Token not found"));
                    return;
                }
                if(requested.has(FINISHED)) {
                    getOnError().accept(new Throwable("Token is already used"));
                    return;
                }
                if (System.currentTimeMillis() - requested.getLong(TIMESTAMP) > requested.getLong(TIMEOUT)) {
                    getOnError().accept(new Throwable("Token expired"));
                    return;
                }
                if(requested.has(STRONG) && requested.getBoolean(STRONG)) {
                    finishAction(token);
                }
                if(getOnCheck() != null) {
                    requested.put(ORIGIN, token);
                }
                if(getOnCheck() == null) {
                    getOnSuccess().accept(requested.getJSONObject(PAYLOAD));
                } else {
                    requested.put(TIMESTAMP, System.currentTimeMillis());
                    token = onFetchToken.call();
                    addAction(token, requested);
                    getOnCheck().accept(token);
                }
            } else if (getRequestOptions().has(NONCE)) {
                String nonce = getRequestOptions().getString(NONCE);
                JSONObject requested = getAction(nonce);
                if (requested == null) {
                    getOnError().accept(new Throwable("Intent not registered"));
                    return;
                }
                if(requested.has(FINISHED)) {
                    getOnError().accept(new Throwable("Intent is already used"));
                    return;
                }
                if (requested.has(ORIGIN)) {
                    increaseTries(requested.getString(ORIGIN));
                }
                finishAction(nonce);
                if (System.currentTimeMillis() - requested.getLong(TIMESTAMP) > requested.getLong(TIMEOUT)) {
                    getOnError().accept(new Throwable("Intent expired"));
                    return;
                }
                getOnSuccess().accept(requested.getJSONObject(PAYLOAD));
            } else {
                getOnWelcome().run();
            }
        }

        protected JSONObject getAction(String token) throws IOException {
            WebPath tokenFile = new WebPath(arguments.getWebRootDirectory(), "data/one-time/." + token + ".json");
            if(tokenFile.path().exists()) {
                return new JSONObject(tokenFile.content());
            } else {
                return null;
            }
        }

        protected void increaseTries(String token) throws IOException {
            JSONObject action = getAction(token);
            if(action != null) {
                int currentTryNumber = 0;
                int maxTries = MAX_TRIES_DEFAULT;
                if(action.has(TRIED)) currentTryNumber = action.getInt(TRIED);
                if(action.has(MAX_TRIES)) maxTries = action.getInt(MAX_TRIES);
                currentTryNumber ++;
                action.put(TRIED, currentTryNumber);
                WebPath tokenFile = new WebPath(arguments.getWebRootDirectory(), "data/one-time/." + token + ".json");
                tokenFile.save(action.toString(2));
                if(currentTryNumber >= maxTries) finishAction(token);
            }
        }

        protected void finishAction(String token) throws IOException {
            JSONObject action = getAction(token);
            if(action != null) {
                action.put(FINISHED, System.currentTimeMillis());
                WebPath tokenFile = new WebPath(arguments.getWebRootDirectory(), "data/one-time/." + token + ".json");
                tokenFile.save(action.toString(2));
            }
        }

        @SuppressWarnings("ResultOfMethodCallIgnored")
        protected void removeExpiredActions() {
            WebPath tokensDir = new WebPath(arguments.getWebRootDirectory(), "data/one-time");
            File[] list = tokensDir.path().listFiles((dir, name) -> name.startsWith(".") && name.endsWith(".json"));
            if (list != null) {
                for(File file: list) {
                    if(!file.isFile()) continue;
                    WebPath webPath = new WebPath(file);
                    try {
                        JSONObject json = new JSONObject(webPath.content());
                        if (System.currentTimeMillis() - json.getLong(TIMESTAMP) > json.getLong(TIMEOUT)) {
                            Misc.log("OneTime", "has removed the token expired", "[" + file.getName() + "]");
                            file.delete();
                        }
                    } catch(Exception e) {
                        Misc.err("OneTime", "has renamed the token failed", "[" + file.getName() + "]", e.getMessage());
                        File badFile = new File(file.getAbsolutePath() + ".bad");
                        file.renameTo(badFile);
                    }
                }
            }
        }

        public void setOnFetchToken(Callable<String> onFetchToken) {
            this.onFetchToken = onFetchToken;
        }

        public void setRequestOptions(JSONObject requestOptions) {
            this.requestOptions = requestOptions;
        }

        private JSONObject getRequestOptions() {
            return requestOptions;
        }

        public Consumer<JSONObject> getOnSuccess() {
            return onSuccess;
        }

        public void setOnSuccess(Consumer<JSONObject> onSuccess) {
            this.onSuccess = onSuccess;
        }

        public Consumer<Throwable> getOnError() {
            return onError;
        }

        public void setOnError(Consumer<Throwable> onError) {
            this.onError = onError;
        }

        public void setPayload(HashMap<String, Serializable> payload) {
            this.payload = payload;
        }

        private HashMap<String, Serializable> getPayload() {
            return payload;
        }

        public void setOnCheck(Consumer<String> onCheck) {
            this.onCheck = onCheck;
        }

        private Consumer<String> getOnCheck() {
            return onCheck;
        }

        public void setOnWelcome(Runnable onWelcome) {
            this.onWelcome = onWelcome;
        }

        private Runnable getOnWelcome() {
            return onWelcome;
        }

        public void setOnStart(Consumer<String> onStart) {
            this.onStart = onStart;
        }

        private Consumer<String> getOnStart() {
            return onStart;
        }

        public Long getExpirationTimeout() {
            return expirationTimeout;
        }

        private void setExpirationTimeout(Long expirationTimeout) {
            this.expirationTimeout = expirationTimeout;
        }

        private boolean isStrong() {
            return strong;
        }

        @SuppressWarnings("unused")
        public void setStrong(boolean strong) {
            this.strong = strong;
        }

        public int getMaxTries() {
            return maxTries;
        }

        public void setMaxTries(int maxTries) {
            this.maxTries = maxTries;
        }
    }
}
