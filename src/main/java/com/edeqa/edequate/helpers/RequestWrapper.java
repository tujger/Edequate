package com.edeqa.edequate.helpers;

import com.edeqa.helpers.Mime;
import com.edeqa.helpers.Misc;
import com.edeqa.helpers.interfaces.Consumer;
import com.google.common.net.HttpHeaders;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static com.edeqa.edequate.abstracts.AbstractAction.CODE;
import static com.edeqa.edequate.abstracts.AbstractAction.ERROR_BAD_REQUEST;
import static com.edeqa.edequate.abstracts.AbstractAction.STATUS;
import static com.edeqa.edequate.abstracts.AbstractAction.STATUS_ERROR;

/**
 * Created 6/9/2017.
 */

@SuppressWarnings("unused")
public class RequestWrapper {

    protected final static int MODE_SERVLET = 0;
    protected final static int MODE_EXCHANGE = 1;

    protected final static long MAX_BODY_LENGTH = 1024 * 1024;

    private HttpServletRequest httpServletRequest;
    private HttpServletResponse httpServletResponse;
    private String charset;
    private String callback;
    private String fallback;

    private HttpExchange httpExchange;

    private int mode;
    private boolean gzip;

    @Override
    public String toString() {
        return "RequestWrapper{}";
    }

    public RequestWrapper() {
        this.gzip = false;
    }

    public void setHttpServletRequest(HttpServletRequest httpServletRequest) {
        this.httpServletRequest = httpServletRequest;
        setMode(MODE_SERVLET);
    }

    public HttpServletRequest getHttpServletRequest() {
        return httpServletRequest;
    }

    public void setHttpServletResponse(HttpServletResponse httpServletResponse) {
        this.httpServletResponse = httpServletResponse;
        setMode(MODE_SERVLET);
    }

    public HttpServletResponse getHttpServletResponse() {
        return httpServletResponse;
    }

    public RequestWrapper setHttpExchange(HttpExchange httpExchange) {
        this.httpExchange = httpExchange;
        setMode(MODE_EXCHANGE);
        return this;
    }

    public HttpExchange getHttpExchange() {
        return httpExchange;
    }

    public URI getRequestURI() {
        try {
            if(mode == MODE_SERVLET) {
                return new URI(httpServletRequest.getRequestURI());
            } else if(mode == MODE_EXCHANGE) {
                return httpExchange.getRequestURI();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void setHeader(String name, String value) {
        try {
            if(mode == MODE_SERVLET) {
                httpServletResponse.setHeader(name, value);
            } else if(mode == MODE_EXCHANGE) {
                httpExchange.getResponseHeaders().set(name, value);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void addHeader(String name, String value) {
        try {
            if(mode == MODE_SERVLET) {
                httpServletResponse.addHeader(name, value);
            } else if(mode == MODE_EXCHANGE) {
                httpExchange.getResponseHeaders().add(name, value);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendResponseHeaders(int code, int arg1) {
        try {
            if(mode == MODE_SERVLET) {
                if(charset != null) {
                    String contentType = httpServletResponse.getHeader(HttpHeaders.CONTENT_TYPE);
                    if (!contentType.toLowerCase().contains("; charset=")) {
                        contentType = contentType + "; charset=" + charset;
                        setHeader(HttpHeaders.CONTENT_TYPE, contentType);
                    }
                }
                httpServletResponse.setStatus(code);
            } else if(mode == MODE_EXCHANGE) {
                if(isGzip()) {
                    setHeader(HttpHeaders.CONTENT_ENCODING, "gzip");
                }

                if(charset != null) {
                    List<String> contentTypes = httpExchange.getResponseHeaders().get(HttpHeaders.CONTENT_TYPE);
                    for (String contentType : contentTypes) {
                        if (!contentType.toLowerCase().contains("; charset=")) {
                            contentType = contentType + "; charset=" + charset;
                            setHeader(HttpHeaders.CONTENT_TYPE, contentType);
                        }
                    }
                }

                try {
                    httpExchange.sendResponseHeaders(code, arg1);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public OutputStream getOutputStream() {
        try {
            if(mode == MODE_SERVLET) {
                return httpServletResponse.getOutputStream();
            } else if(mode == MODE_EXCHANGE) {
                if(isGzip()) {
                    return new BufferedOutputStream(new GZIPOutputStream(httpExchange.getResponseBody()));
                } else {
                    return httpExchange.getResponseBody();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public OutputStream getResponseBody() {
        return getOutputStream();
    }

    public InputStream getInputStream() {
        try {
            if(mode == MODE_SERVLET) {
                return httpServletRequest.getInputStream();
            } else if(mode == MODE_EXCHANGE) {
                return httpExchange.getRequestBody();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public InputStream getRequestBody() {
        return getInputStream();
    }

    public void setCharacterEncoding(String charset) {
        try {
            if(mode == MODE_SERVLET) {
                httpServletResponse.setCharacterEncoding(charset);
            } else if(mode == MODE_EXCHANGE) {
                this.charset = charset;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public PrintWriter getPrintWriter() {
        try {
            if(mode == MODE_SERVLET) {
                return httpServletResponse.getWriter();
            } else if(mode == MODE_EXCHANGE) {
                return new PrintWriter(httpExchange.getResponseBody());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public InetSocketAddress getRemoteAddress() {
        try {
            if (mode == MODE_SERVLET) {
                return new InetSocketAddress(httpServletRequest.getRemoteAddr(), httpServletRequest.getRemotePort());
            } else if (mode == MODE_EXCHANGE) {
                return httpExchange.getRemoteAddress();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Map<String, List<String>> getRequestHeaders() {
        try {
            if (mode == MODE_SERVLET) {
//            Headers implements Map<String, List<String>> {
                Map<String, List<String>> headers = new HashMap<>();
                String x;
                Enumeration<String> names = httpServletRequest.getHeaderNames();
                while (names.hasMoreElements()) {
                    x = names.nextElement();
                    Enumeration<String> h = httpServletRequest.getHeaders(x);
                    headers.put(x, Collections.list(h));
                }
                return headers;
            } else if (mode == MODE_EXCHANGE) {
                Map<String, List<String>> headers = new HashMap<>();
                Map.Entry<String, List<String>> entry;

                for (Map.Entry<String, List<String>> stringListEntry : httpExchange.getRequestHeaders().entrySet()) {
                    entry = stringListEntry;
                    headers.put(entry.getKey(), entry.getValue());
                }
                return headers;
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<String> getRequestHeader(String name) {
        try {
            if (mode == MODE_SERVLET) {
                return Collections.list(httpServletRequest.getHeaders(name));
            } else if (mode == MODE_EXCHANGE) {
                Headers headers = httpExchange.getRequestHeaders();
                if (headers.containsKey(name)) {
                    return httpExchange.getRequestHeaders().get(name);
                } else {
                    return Collections.emptyList();
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getRequestedHost() {
        String host = null;
        try {
            if (mode == MODE_SERVLET) {
                System.out.println("REQUESTEDHOST:" + httpServletRequest.getLocalAddr() + ":" + httpServletRequest.getRemoteHost());
                host = httpServletRequest.getLocalAddr();
            } else if (mode == MODE_EXCHANGE) {
                host = httpExchange.getRequestHeaders().getFirst(HttpHeaders.HOST);
                if (host == null) {
                    host = httpExchange.getLocalAddress().getHostName();
                }
                if (host == null) {
                    host = InetAddress.getLocalHost().getHostAddress();
                }
                if (host != null) {
                    host = host.split(":")[0];
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return host;
    }

    public int getRequestedPort() {
        int host = 0;
        try {
            if (mode == MODE_SERVLET) {
                System.out.println("REQUESTEDPORT:" + httpServletRequest.getLocalAddr() + ":" + httpServletRequest.getRemoteHost());
                host = httpServletRequest.getLocalPort();
            } else if (mode == MODE_EXCHANGE) {
                host = httpExchange.getLocalAddress().getPort();
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return host;
    }

    public String getReferer() {
        String referer = null;
        try {
            if (mode == MODE_SERVLET) {
                System.out.println("REQUESTEDREFERRE:" + httpServletRequest.getHeader(HttpHeaders.REFERER));
                referer = null;
//            return httpServletRequest.getLocalAddr();
            } else if (mode == MODE_EXCHANGE) {
                List<String> referers = getRequestHeader(HttpHeaders.REFERER);
                if (referers != null && referers.size() > 0) {
                    referer = referers.get(0);
                }
            }
            if (referer != null && referer.contains(getRequestedHost())) referer = null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return referer;
    }

    public String getRequestMethod() {
        try {
            if(mode == MODE_SERVLET) {
                return httpServletRequest.getMethod();
            } else if(mode == MODE_EXCHANGE) {
                return httpExchange.getRequestMethod();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void sendResult(JSONObject json) {
        if(json != null && json.has(STATUS) && json.getString(STATUS).equals(STATUS_ERROR)) {
            int code = ERROR_BAD_REQUEST;
            try {
                code = json.getInt(CODE);
            } catch (Exception ignored) {}
            sendError(code, json);
            return;
        }
        String result = json.toString();
        if(getCallback() != null) {
            result = getCallback() + "(" + result + ");";
            setCallback(null);
            setFallback(null);
        }
        sendResult(200, Mime.APPLICATION_JSON, result.getBytes());
    }

    public void sendResult(String string) {
        sendResult(200, Mime.TEXT_PLAIN, string.getBytes());
    }

    public void sendError(Integer code, JSONObject json) {
        String result = json.toString();
        if(getFallback() != null || getCallback() != null) {
            if(getFallback() != null) {
                result = getFallback() + "(" + result + ");";
            } else if(getCallback() != null) {
                result = getCallback() + "(" + result + ");";
            }
            setCallback(null);
            setFallback(null);
        }
        sendResult(code, Mime.APPLICATION_JSON, result.getBytes());
    }

    public void sendError(Integer code, String string) {
        sendResult(code, Mime.TEXT_PLAIN, string.getBytes());
    }

    public void sendRedirect(String redirectLink) {
        try {
            if(mode == MODE_SERVLET) {
                setHeader(HttpHeaders.SERVER, "Edequate/" + Version.getVersion());
                httpServletResponse.sendRedirect(redirectLink);
            } else if(mode == MODE_EXCHANGE) {
                setHeader(HttpHeaders.CONTENT_TYPE, "text/plain");
                setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
                setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, PATCH, PUT, DELETE, OPTIONS");
                setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "Origin, Content-Type, X-Auth-Token");

                setHeader(HttpHeaders.DATE, new Date().toString());
                setHeader(HttpHeaders.LOCATION, redirectLink);
                setHeader(HttpHeaders.SERVER, "Edequate/" + Version.getVersion());
                httpExchange.sendResponseHeaders(302, 0);
                httpExchange.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendResult(Integer code, String contentType, byte[] bytes) {
        try {
            setHeader(HttpHeaders.ACCEPT_RANGES, "bytes");

            // FIXME - need to check by https://observatory.mozilla.org/analyze.html?host=waytous.net
            setHeader(HttpHeaders.X_CONTENT_TYPE_OPTIONS, "nosniff");
            setHeader(HttpHeaders.CONTENT_SECURITY_POLICY, "frame-ancestors 'self'");
            setHeader(HttpHeaders.X_FRAME_OPTIONS, "SAMEORIGIN");
            setHeader(HttpHeaders.X_XSS_PROTECTION, "1; mode=block");
            setHeader(HttpHeaders.STRICT_TRANSPORT_SECURITY, "max-age=63072000; includeSubDomains; preload");
            setHeader(HttpHeaders.VARY, "Accept-Encoding");

            addHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
            if(contentType != null) setHeader(HttpHeaders.CONTENT_TYPE, contentType);
            setHeader(HttpHeaders.SERVER, "Edequate/" + Version.getVersion());
            setHeader(HttpHeaders.DATE, new Date().toString());

            sendResponseHeaders(code, bytes.length);

            try (OutputStream os = getResponseBody()) {
                os.write(bytes);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    public String getMethod() {
        return getRequestMethod();
    }

    public int getMode() {
        return mode;
    }

    public void setMode(int mode) {
        this.mode = mode;
    }

    public boolean isGzip() {
        return gzip;
    }

    public void setGzip(boolean gzip) {
        this.gzip = gzip;
    }

    public String getBody() {
        StringBuilder buffer = new StringBuilder();
        try (InputStreamReader isr = new InputStreamReader(getRequestBody(), "utf-8")) {
            try (BufferedReader br = new BufferedReader(isr)) {
                String line;
                while ((line = br.readLine()) != null) {
                    if(buffer.length() > 0) buffer.append("\n");
                    buffer.append(line);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return buffer.toString();
    }

    public String getUserName() {
        try {
            if(mode == MODE_SERVLET) {
                return null;
            } else if(mode == MODE_EXCHANGE) {
                if(httpExchange.getPrincipal() != null) {
                    return httpExchange.getPrincipal().getUsername();// TODO
                } else {
                    return null;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void processBody(Consumer<StringBuilder> callback, Consumer<Exception> fallback) {
        try {
            StringBuilder buf = new StringBuilder();
            try (InputStream is = this.getRequestBody()) {
                int b;
                long count = 0;
                while ((b = is.read()) != -1) {
                    if (count++ > MAX_BODY_LENGTH) {
                        fallback.accept(new IllegalArgumentException("Body size is bigger than " + MAX_BODY_LENGTH + " byte(s)."));
                        return;
                    }
                    buf.append((char) b);
                }
            }
            if(buf.length() > 0) {
                callback.accept(buf);
            } else {
                fallback.accept(new IllegalArgumentException("Empty body"));
            }
        } catch(Exception e) {
            e.printStackTrace();
            if(fallback != null) fallback.accept(e);
        }
    }

    public Map<String,List<String>> getParameterMap() {
        try {
            if (mode == MODE_SERVLET) {
                HashMap<String, List<String>> map = new HashMap<>();
                for (Map.Entry<String, String[]> x : httpServletRequest.getParameterMap().entrySet()) {
                    map.put(x.getKey(), Arrays.asList(x.getValue()));
                }
                return map;
            } else if (mode == MODE_EXCHANGE) {
                HashMap<String, List<String>> map = new HashMap<>();

                List<String> list;
                String query = httpExchange.getRequestURI().getQuery();
                if (!Misc.isEmpty(query)) {
                    String[] queryParts = httpExchange.getRequestURI().getQuery().split("&");
                    for (String x : queryParts) {
                        String[] arguments = x.split("=");
                        if (map.containsKey(arguments[0])) {
                            list = map.get(arguments[0]);
                        } else {
                            list = new ArrayList<>();
                            map.put(arguments[0], list);
                        }
                        if (arguments.length > 1) list.add(arguments[1]);
                    }
                }
                return map;
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return Collections.emptyMap();
    }


    public JSONObject fetchOptions() {
        JSONObject json = new JSONObject();

        String query = getRequestURI().getQuery();
        if(query != null && query.length() > 0) {
            json = parse(json, query);
        }
        query = getBody();
        if(query != null && query.length() > 0) {
            json = parse(json, query);
        }
        return json;
    }

    private static JSONObject parse(JSONObject json, String text) {
        try {
            JSONObject newJson = new JSONObject(text);
            Iterator<String> keys = newJson.keys();
            while(keys.hasNext()) {
                String key = keys.next();
                putItem(json, key, newJson.get(key));
            }
        } catch (Exception e){
            String[] options = text.split("[&\\n]+");
            for(String option: options) {
                String[] parts = option.split("=", 2);
                if (parts.length > 1) {
                    putItem(json, parts[0], parts[1]);
                } else {
                    putItem(json, parts[0], "");
                }
            }
        }
        return json;
    }

    private static JSONObject putItem(JSONObject json, String key, Object value) {
        if(json.has(key)) {
            Object object = json.get(key);
            if(object instanceof JSONArray) {
                ((JSONArray) object).put(value);
            } else {
                JSONArray array = new JSONArray();
                array.put(object);
                if(value instanceof JSONArray) {
                    for(int i = 0; i < ((JSONArray) value).length(); i++) {
                        array.put(((JSONArray) value).get(i));
                    }
                } else {
                    array.put(value);
                }
                json.put(key, array);
            }
        } else {
            json.put(key, value);
        }
        return json;
    }

    public String getCallback() {
        return callback;
    }

    public void setCallback(String callback) {
        this.callback = callback;
    }

    public String getFallback() {
        return fallback;
    }

    public void setFallback(String fallback) {
        this.fallback = fallback;
    }
}
