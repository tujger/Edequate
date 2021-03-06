package com.edeqa.edequate;


import com.edeqa.edequate.abstracts.AbstractAction;
import com.edeqa.edequate.abstracts.AbstractServletHandler;
import com.edeqa.edequate.helpers.Replacements;
import com.edeqa.edequate.helpers.RequestWrapper;
import com.edeqa.edequate.helpers.WebPath;
import com.edeqa.edequate.rest.Content;
import com.edeqa.edequate.rest.system.Arguments;
import com.edeqa.eventbus.EventBus;
import com.edeqa.helpers.HtmlGenerator;
import com.edeqa.helpers.Mime;
import com.edeqa.helpers.MimeType;
import com.edeqa.helpers.MimeTypes;
import com.edeqa.helpers.Misc;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;

import javax.servlet.ServletException;

import static com.edeqa.edequate.abstracts.AbstractAction.SYSTEMBUS;
import static com.edeqa.helpers.HtmlGenerator.A;
import static com.edeqa.helpers.HtmlGenerator.CLASS;
import static com.edeqa.helpers.HtmlGenerator.DIV;
import static com.edeqa.helpers.HtmlGenerator.HEIGHT;
import static com.edeqa.helpers.HtmlGenerator.HREF;
import static com.edeqa.helpers.HtmlGenerator.IMG;
import static com.edeqa.helpers.HtmlGenerator.LINK;
import static com.edeqa.helpers.HtmlGenerator.NOSCRIPT;
import static com.edeqa.helpers.HtmlGenerator.REL;
import static com.edeqa.helpers.HtmlGenerator.SPAN;
import static com.edeqa.helpers.HtmlGenerator.SRC;
import static com.edeqa.helpers.HtmlGenerator.STYLESHEET;
import static com.edeqa.helpers.HtmlGenerator.TYPE;
import static com.edeqa.helpers.HtmlGenerator.WIDTH;

public class MainServletHandler extends AbstractServletHandler {

    private EventBus<AbstractAction> systemBus;
    private MimeTypes mimeTypes;
    private Replacements replacements;

    public MainServletHandler() {
        EventBus.setMainRunner(EventBus.RUNNER_SINGLE_THREAD);
        //noinspection unchecked
        systemBus = (EventBus<AbstractAction>) EventBus.getOrCreate(SYSTEMBUS);
        setMimeTypes(new MimeTypes().useDefault());
        setReplacements(new Replacements());
    }

    @Override
    public void init() throws ServletException {
        super.init();
        //noinspection unchecked
        systemBus = (EventBus<AbstractAction>) EventBus.getOrCreate(SYSTEMBUS);
    }

    @Override
    public void perform(RequestWrapper requestWrapper) throws IOException {

        Arguments arguments = (Arguments) getSystemBus().getHolder(Arguments.TYPE);
        URI uri = requestWrapper.getRequestURI();

        /*if ("/_ah/start".equals(uri.getPath())) {
            requestWrapper.sendResponseHeaders(200,0);
            requestWrapper.getOutputStream().close();
            return;
        } else if("/_ah/stop".equals(uri.getPath())) {
            requestWrapper.sendResponseHeaders(200,0);
            requestWrapper.getOutputStream().close();
            return;
        }*/

        String referer = requestWrapper.getReferer();
        String ipRemote = requestWrapper.getRemoteAddress().getAddress().getHostAddress();
        WebPath webPath = new WebPath(getWebDirectory(), uri.getPath());
        File root = new File(getWebDirectory());

        int resultCode = 200;
        if (!webPath.path().getCanonicalPath().startsWith(root.getCanonicalPath())) {
            // Suspected path traversal attack: reject with 403 error.
            Misc.err("Main", "[" + ipRemote + "]", uri.getPath(), "[403 - suspected path traversal attack]", (referer != null ? "referer: " + referer : ""));
            resultCode = 403;
            webPath = new WebPath(getWebDirectory(), "403.html");
//                Utils.sendResult.onEvent(exchange, 403, Constants.MIME.TEXT_PLAIN, "403 Forbidden\n".getBytes());
        } else if(webPath.path().getName().startsWith("\\.")) {
            Misc.err("Main", "[" + ipRemote + "]", uri.getPath(), "[404 - not found, forbidden request]", (referer != null ? "referer: " + referer : ""));
            requestWrapper.sendError(404, "File not found");
            return;
        } else if(!webPath.path().exists()) {
            String beginWeb = webPath.web(1);

            WebPath dataPath = new WebPath(getWebDirectory(), "data");
            File[] files = dataPath.path().listFiles(pathname -> pathname.isFile() && pathname.getName().contains("pages-"));
            ArrayList<String> types = new ArrayList<>();
            for(File file: files) {
                types.add(file.getName().replaceAll("pages-(.*?)\\.json", "$1"));
            }

            if(types.contains(beginWeb)) {
                webPath = new WebPath(getWebDirectory(), "index-" + beginWeb + ".html");
            }
            if(!webPath.path().exists()) {
                webPath = new WebPath(getWebDirectory(), "index.html");
            }
            if(!webPath.path().exists()) {
                if ("main".startsWith(beginWeb)) {
                    new Content()
                            .setReplacements(getReplacements())
                            .setMimeType(new MimeType().setMime(Mime.TEXT_HTML).setText(true).setGzip(true))
                            .setContent(fetchDefaultIndex().build())
                            .setResultCode(200)
                            .call(null, requestWrapper);
                    return;
                } else {

//                String[] parts = webPath.web().split("/");
//                System.out.println(parts[0] + ":"+ parts[1]);
//                if(parts.length > 1 ) {
//                    WebPath subWebPath = new WebPath(getWebDirectory(), "index-" + parts[1] + ".html");
//                    if (subWebPath.path().exists()) {
//                        MimeType mimeType = getMimeTypes().fetchMimeFor(subWebPath.path().getName());
//                        new Content()
//                                .setReplacements(getReplacements())
//                                .setMimeType(mimeType)
//                                .setWebPath(subWebPath)
//                                .setResultCode(resultCode)
//                                .accept(null, requestWrapper);
//                        return;
//                    }
//                }

                    Misc.err("Main", "[" + ipRemote + "]", uri.getPath(), "[404 - not found]", (referer != null ? "referer: " + referer : ""));
                    requestWrapper.sendError(404, "File not found");
                    return;
                }
            }
        } else if (webPath.path().isDirectory()) {
            webPath = webPath.webPath("index.html");
            Misc.log("Main", "[" + ipRemote + "]", "->", webPath.web(), "[" + (webPath.path().exists() ? webPath.path().length() + " byte(s)" : "not found") + "]", (referer != null ? "referer: " + referer : ""));
        } else if (!webPath.path().isFile() || uri.getPath().startsWith("/WEB-INF") || uri.getPath().startsWith("/META-INF") || uri.getPath().startsWith("/.")) {
            // Object does not exist or is not a file: reject with 404 error.

            boolean found = false;

//            String[] parts = path.split("/");
//            if(parts.length > 1) {
//                for (int i = 0; i < OPTIONS.getPages().length(); i++) {
//                    if(parts[1].equals(OPTIONS.getPages().get(i))) {
//                        resultCode = 200;
//                        Misc.log("Main", uri.getPath(), "[200 - page found]" + (referer != null ? ", referer: " + referer : ""));
//                        file = new File(OPTIONS.getWebRootDirectory() + "/index.html");
//                        found = true;
//                        break;
//                    }
//                }
//            }
            if(!found) {
                resultCode = 404;
                Misc.log("Main", "[" + ipRemote + "]", uri.getPath(), "[404 - not found]", (referer != null ? "referer: " + referer : ""));
                webPath = new WebPath(getWebDirectory(),"404.html");
            }
        } else {
            if(arguments.isDebugMode()) {
                Misc.log("Main", "[" + ipRemote + "]", uri.getPath(), "[" + webPath.path().length() + " byte(s)]",(referer != null ? "referer: " + referer : ""));
            }
        }
        {
            // Object exists and it is a file: accept with response code 200.
            MimeType mimeType = getMimeTypes().fetchMimeFor(webPath.path().getName());
            new Content()
                    .setReplacements(getReplacements())
                    .setMimeType(mimeType)
                    .setWebPath(webPath)
                    .setResultCode(resultCode)
                    .call(null, requestWrapper);
        }
    }

    private HtmlGenerator fetchDefaultIndex() {
        HtmlGenerator html = new HtmlGenerator();

        html.getHead().add(HtmlGenerator.TITLE).with("Edeqa");
        html.getHead().add(HtmlGenerator.LINK).with(HtmlGenerator.REL, "icon").with(HtmlGenerator.HREF, "/icons/favicon.ico");
        html.getHead().add(HtmlGenerator.STYLE).with("@import url('/css/edequate.css');@import url('/css/edequate-horizontal.css');@import url('/css/edeqa-colors.css');");
        html.getHead().add(HtmlGenerator.META).with(HtmlGenerator.NAME, "viewport").with(HtmlGenerator.CONTENT, "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=no");
        html.getHead().add(HtmlGenerator.SCRIPT).with(HtmlGenerator.ASYNC, true).with(HtmlGenerator.SRC, "/js/Edequate.js").with("data-variable", "u").with("data-callback", "u.require('/js/Main.js', u, function(main){main.start()})").with("data-export-constants","true");

        HtmlGenerator.Tag a = html.getBody().add(HtmlGenerator.DIV).with(HtmlGenerator.ID, "loading-dialog").with(HtmlGenerator.CLASS, "modal shadow progress-dialog").with(HtmlGenerator.TABINDEX, -1)
                .add(HtmlGenerator.DIV).with(HtmlGenerator.CLASS, "dialog-items");
        a.add(HtmlGenerator.DIV).with(HtmlGenerator.CLASS, "dialog-item progress-dialog-circle");
        a.add(HtmlGenerator.DIV).with(HtmlGenerator.CLASS, "dialog-item progress-dialog-title").with("Loading...");
        a.add(HtmlGenerator.DIV).with(HtmlGenerator.ID, "loading-dialog-progress").with(HtmlGenerator.CLASS, "dialog-item progress-dialog-title");

        HtmlGenerator.Tag noscript = html.getBody().add(NOSCRIPT);
        noscript.add(LINK).with(TYPE, Mime.TEXT_CSS).with(REL, STYLESHEET).with(HREF, "/css/noscript.css");

        HtmlGenerator.Tag header = noscript.add(DIV).with(CLASS, "header");
        header.add(IMG).with(SRC, "/images/edeqa-logo.svg").with(WIDTH, 24).with(HEIGHT, 24);
        header.with("Edequate");

        noscript.add(DIV).with(CLASS, "text").with("This site requires to allow Javascript. Please enable Javascript in your browser and try again or use other browser that supports Javascript.");

        HtmlGenerator.Tag copyright = noscript.add(DIV).with(CLASS, "copyright");
        copyright.add(A).with("Edequate").with(CLASS, "link").with(HREF, "http://www.edeqa.com/edequate");
        copyright.add(SPAN).with(" &copy;2017-18 ");
        copyright.add(A).with("Edeqa").with(CLASS, "link").with(HREF, "http://www.edeqa.com");

        return html;
    }

    public MimeTypes getMimeTypes() {
        return mimeTypes;
    }

    public void setMimeTypes(MimeTypes mimeTypes) {
        this.mimeTypes = mimeTypes;
    }

    public Replacements getReplacements() {
        return replacements;
    }

    public void setReplacements(Replacements replacements) {
        this.replacements = replacements;
    }

    protected EventBus<AbstractAction> getSystemBus() {
        return systemBus;
    }
}