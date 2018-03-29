/**
 * Edequate - javascript DOM and interface routines
 * Look for updates at https://edeqa.github.io/Edequate/
 * ------------------------------------------
 * Copyright (C) 2017-18 Edeqa <http://www.edeqa.com>
 *
 * History:
 * 7 - create(options#content) - if content is defined then just uses it as current HTMLElement; new component - tree; node#setContent(node)
 * 6 - drawer.headerSubtitle; require with caching
 * 5 - onload initialization; DRAWER constants
 * 4 - table#options#caption.selectable=true/false
 * 3 - sprintf redesigned; table#options.sort=true/false; table#options.filter=true/false;
 *       dialog#options.autoclose=true/false; dialog#setHeader; dialog#getHeader;
 *       dialog#setFooter; dialog#getFooter; dialog#setPositive; dialog#getPositive;
 *       dialog#setNeutral; dialog#getNeutral; dialog#setNegative; dialog#getNegative;
 *       menu; create#options.children; create#options.variable; create#options.childName
 * 2 - HTMLElement#updateHTML(text)
 * 1 - some fixes and improvements
 * 0 - initial release
 */

function Edequate(options) {
    var self = this;

    this.version = 6;

    var HTML = {
        DATE:"date",
        DATETIME: "datetime",
        DATETIME_LOCAL: "datetime-local",
        DIV:"div",
        LINK:"link",
        A:"a",
        IMG:"img",
        MAIN:"main",
        META:"meta",
        STYLE:"style",
        CLASS:"className",
        CLASSNAME:"className",
        SCRIPT:"script",
        TITLE:"title",
        ID:"id",
        SRC:"src",
        HTTP_EQUIV: "http-equiv",
        TABLE:"table",
        TR:"tr",
        TH:"th",
        TD:"td",
        H1:"h1",
        H2:"h2",
        H3:"h3",
        H4:"h4",
        H5:"h5",
        H6:"h6",
        H7:"h7",
        I:"i",
        BORDER:"border",
        COLSPAN:"colspan",
        ROWSPAN:"rowspan",
        HREF:"href",
        TARGET:"target",
        SMALL:"small",
        REL:"rel",
        STYLESHEET:"stylesheet",
        TYPE:"type",
        BR:"br",
        FORM:"form",
        NAME:"name",
        LABEL:"label",
        INPUT:"input",
        CHECKBOX:"checkbox",
        TEXT:"text",
        NUMBER:"number",
        TEXTAREA:"textarea",
        HIDDEN:"hidden",
        PASSWORD:"password",
        SELECT:"select",
        OPTION:"option",
        SUBMIT:"submit",
        VALUE:"value",
        MANIFEST:"manifest",
        SPAN:"span",
        BUTTON:"button",
        CLICK:"click",
        SVG:"svg",
        PATH:"path",
        MOUSEOVER:"mouseover",
        MOUSEOUT:"mouseout",
        MOUSEUP:"mouseup",
        MOUSEDOWN:"mousedown",
        MOUSEMOVE:"mousemove",
        MOUSEENTER:"mouseenter",
        MOUSELEAVE:"mouseleave",
        VIEWBOX:"viewBox",
        INNERHTML:"innerHTML",
        INNERTEXT:"innerText",
        BLOCK:"block",
        AUTO:"auto",
        AUDIO:"audio"
    };

    var ERRORS = {
        NOT_EXISTS: "NOT_EXISTS",
        NOT_AN_OBJECT: "NOT_AN_OBJECT",
        INCORRECT_JSON: "INCORRECT_JSON",
        ERROR_LOADING: "ERROR_LOADING",
        ERROR_SENDING_REQUEST: "ERROR_SENDING_REQUEST",
        INVALID_MODULE: "INVALID_MODULE",
        CALLBACK_FAILED: "CALLBACK_FAILED"
    };

    var DRAWER = {
        SECTION_PRIMARY: 0,
        SECTION_SUMMARY: 1,
        SECTION_MAIN: 2,
        SECTION_EXPLORE: 3,
        SECTION_SHARE: 4,
        SECTION_RESOURCES: 5,
        SECTION_MISCELLANEOUS: 6,
        SECTION_SETTINGS: 7,
        SECTION_HELP: 8,
        SECTION_LAST: 9
    };

    var HIDING = {
        OPACITY: "opacity",
        SCALE_XY: "scale-xy",
        SCALE_X: "scale-x",
        SCALE_X_LEFT: "scale-x-left",
        SCALE_X_RIGHT: "scale-x-right",
        SCALE_Y: "scale-y",
        SCALE_Y_TOP: "scale-y-top",
        SCALE_Y_BOTTOM: "scale-y-bottom"
    };

    URL = function(link) {
        this.href = link.href || link;
        var p = this.href.split("://");
        this.protocol = "http:";
        if(p.length > 1) {
            this.protocol = p.shift() +":";
            p = p.join("://").split("/");
        } else {
            p = p.join("/").split("/");
        }
        this.host = p.shift();
        p = "/" + p.join("/");

        var h = this.host.split(":");
        this.hostname = h.shift();
        this.port = h.shift();
        if(!this.port) this.port = "";
        // noinspection JSPotentiallyInvalidUsageOfThis
        this.origin = this.protocol + "//" + this.host;

        p = p.split("#");
        this.hash = p.length > 1 ? p.pop() : "";

        p = p.join("#").split("?");
        this.search = p.length > 1 ? p.pop() : "";

        this.path = p.join("?");
        this.password = "";
        this.username = "";
    };

    HTMLElement.prototype.show = function(animatedType) {
        var div = this, parent, holder, computedStyle;
        if(!div.classList.contains("hidden")) return;
        clearTimeout(div.hideTask);
        div.isHidden = false;
        if(animatedType && (div.offsetWidth || div.offsetHeight)) {
            var height,width;
            switch(animatedType) {
                case HIDING.SCALE_Y:
                case HIDING.SCALE_Y_TOP:
                case HIDING.SCALE_Y_BOTTOM:
                    parent = div.parentNode;
                    holder = create(HTML.DIV, {style:{display:"none"}});
                    parent.replaceChild(holder,div);
                    document.body.appendChild(div);
                    div.style.position = "fixed";
                    div.style.left = "-10000px";
                    div.classList.remove("hidden");

                    computedStyle = window.getComputedStyle(div,null);
                    height = computedStyle.height;

                    div.classList.add("hidden");
                    div.style.position = "";
                    div.style.left = "";
                    parent.replaceChild(div,holder);
                    holder = null;

                    div.style.height = "0px";
                    break;
                case HIDING.SCALE_X:
                case HIDING.SCALE_X_LEFT:
                case HIDING.SCALE_X_RIGHT:
                    parent = div.parentNode;
                    holder = create(HTML.DIV, {style:{display:"none"}});
                    parent.replaceChild(holder,div);
                    document.body.appendChild(div);
                    div.style.position = "fixed";
                    div.style.left = "-10000px";
                    div.classList.remove("hidden");

                    computedStyle = window.getComputedStyle(div,null);
                    width = computedStyle.width;

                    div.classList.add("hidden");
                    div.style.position = "";
                    div.style.left = "";
                    parent.replaceChild(div,holder);
                    holder = null;

                    div.style.width = "0px";
                    break;
                case HIDING.SCALE_XY:
                    parent = div.parentNode;
                    holder = create(HTML.DIV, {style:{display:"none"}});
                    parent.replaceChild(holder,div);
                    document.body.appendChild(div);
                    div.style.position = "fixed";
                    div.style.left = "-10000px";
                    div.classList.remove("hidden");

                    computedStyle = window.getComputedStyle(div,null);
                    height = computedStyle.height;

                    div.classList.add("hidden");
                    div.style.position = "";
                    div.style.left = "";
                    parent.replaceChild(div,holder);
                    holder = null;

                    width = computedStyle.width;
                    height = computedStyle.height;
                    div.style.width = "0px";
                    div.style.height = "0px";
                    break;
            }

            div.classList.add("hiding-"+animatedType);
            div.classList.add("hiding-animation");

            div.classList.remove("hidden");

            var duration = 200;
            try {
                duration = parseFloat(window.getComputedStyle(div, null).transitionDuration)*1000;
            } catch(e) {
                console.error(e)
            }

            div.hideTask = setTimeout(function(){
                div.classList.remove("hiding-"+animatedType);
                if(height) div.style.height = height;
                if(width) div.style.width = width;
                setTimeout(function(){
                    if(height) div.style.height = "";
                    if(width) div.style.width = "";
                    div.classList.remove("hiding-animation");
                }, duration);
            },0);
        } else {
            div.classList.remove("hidden");
        }
        return div;
    };

    HTMLElement.prototype.hide = function(animatedType) {
        var div = this, computedStyle;
        if(div.classList.contains("hidden")) return;
        clearTimeout(div.hideTask);
        div.isHidden = true;
        if(animatedType && div.offsetWidth) {
            var height,width;
            switch(animatedType) {
                case HIDING.SCALE_Y:
                case HIDING.SCALE_Y_TOP:
                case HIDING.SCALE_Y_BOTTOM:
                    computedStyle = window.getComputedStyle(div,null);
                    height = computedStyle.height;
                    div.style.height = height;
                    break;
                case HIDING.SCALE_X:
                case HIDING.SCALE_X_LEFT:
                case HIDING.SCALE_X_RIGHT:
                    computedStyle = window.getComputedStyle(div,null);
                    width = computedStyle.width;
                    div.style.width = width;
                    break;
                case HIDING.SCALE_XY:
                    computedStyle = window.getComputedStyle(div,null);
                    width = computedStyle.width;
                    height = computedStyle.height;
                    div.style.width = width;
                    div.style.height = height;
                    break;
            }

            div.classList.add("hiding-animation");
            div.classList.add("hiding-"+animatedType);

            computedStyle = window.getComputedStyle(div,null);

            var duration = 200;
            try {
                duration = parseFloat(computedStyle.transitionDuration)*1000;
            } catch(e) {
                console.error(e)
            }

            if(height)div.style.height = "0px";
            if(width)div.style.width = "0px";

            div.hideTask = setTimeout(function(){
                div.classList.add("hidden");
                if(height)div.style.height = "";
                if(width)div.style.width = "";
                div.classList.remove("hiding-"+animatedType);
                div.classList.remove("hiding-animation");
            }, duration);
        } else {
            div.classList.add("hidden");
        }
        return div;
    };

    HTMLElement.prototype.updateHTML = function(update, options) {
        clearTimeout(this._updateTask);
        options = options || {};
        this.innerHTML = update;
        /** @namespace options.noflick */
        if(!options.noflick) {
            this.classList.add("changed");
            this._updateTask = setTimeout(function(){this.classList.remove("changed")}.bind(this), 5000);
        }
    };

    HTMLElement.prototype.place = function(type, args) {
        if(type && typeof type === "object") {
            args = type;
            type = HTML.DIV;
        } else if(!type) {
            type = HTML.DIV;
        }
        create(type, args || {}, this);
        return this;
    };

    if(!Object.assign) {
        Object.defineProperty(Object.prototype, "assign", {
            enumerable: false,
            value: function(target, first, second) {
                for(var x in first) {
                    if(first.hasOwnProperty(x)) target[x] = first[x];
                }
                for(x in second) {
                    if(second.hasOwnProperty(x)) target[x] = second[x];
                }
                return target;
            }
        });
    }

    HTMLElement.prototype.setContent = function(node) {
        for(var i = this.childNodes.length - 1; i >= 0; i--) {
            this.removeChild(this.childNodes[i]);
        }
        this.appendChild(node);
        return this;
    };

    if(!Object.assign) {
        Object.defineProperty(Object.prototype, "assign", {
            enumerable: false,
            value: function(target, first, second) {
                for(var x in first) {
                    if(first.hasOwnProperty(x)) target[x] = first[x];
                }
                for(x in second) {
                    if(second.hasOwnProperty(x)) target[x] = second[x];
                }
                return target;
            }
        });
    }

    if(!String.prototype.toUpperCaseFirst) {
        Object.defineProperty(String.prototype, "toUpperCaseFirst", {
            enumerable: false,
            value: function() {
                return this.substring(0,1).toUpperCase() + this.substring(1);
            }
        });
    }

    if(!String.prototype.sprintf) {
        Object.defineProperty(String.prototype, "sprintf", {
            enumerable: false,
            value: function() {
                if(arguments[0].constructor === Array || arguments[0].constructor === Object) {
                    // noinspection JSUnusedAssignment
                    arguments = arguments[0];
                }
                var args = [];
                for(var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                return this.replace(/%[\d.]*[sdf]/g, function(pattern){
                    var value = args.shift();
                    var tokens = pattern.match(/^%(0)?([\d.]*)(.)$/);
                    switch(tokens[3]) {
                        case "d":
                            var length = +tokens[2];
                            var string = value.toString();
                            if(length > string.length) {
                                tokens[1] = tokens[1] || " ";
                                value = tokens[1].repeat(length - string.length) + string;
                            }
                            break;
                        case "f":
                            break;
                        case "s":
                            break;
                        default:
                            console.error("Unknown pattern: " + tokens[0]);
                    }
                    return value;
                });
            }
        });
    }

    function EPromise() {
        return {
            then: function(callback) {
                this.onResolved = callback || function(){};
                return this;
            },
            catch: function(callback) {
                this.onRejected = callback || function(){};
            },
            onResolved: function(value) {
                console.warn("Define '.then(onResolved(value){...})'; got response: ", value && value.response);
            },
            onRejected: function(code, value, error, options) {
                console.warn("Define '.catch(onRejected(code, value[, error[, options]]){...})'");
                console.error(code, value, error, options);
            },
            promise: function(newPromise) {
                return newPromise;
            }
        };
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function normalizeName(name) {
        if(name === HTML.CLASSNAME){
            name = "class";
        } else if(name in attributable) {
        } else if(name.toLowerCase() === "viewbox") {
            name = HTML.VIEWBOX;
        } else if(name !== name.toLowerCase()) {
            var ps = name.split(/([A-Z])/);
            name = ps[0];
            for(var i = 1; i < ps.length; i++) {
                if(i % 2 !== 0) name += "-";
                name += ps[i].toLowerCase();
            }
        }
        return name;
    }

    var attributable = {
        "frameBorder":1,
        "xmlns":1,
        "strokeWidth":1,
        "version":1,
        "fill":1,
        "d":1,
        "tabindex":1,
        "readOnly":1
    };

    function create(name, properties, appendTo, position) {
        var el,replace = false;
        if(name && typeof name === "object") {
            position = appendTo;
            appendTo = properties;
            properties = name;
            name = HTML.DIV;
        } else if(!name) {
            name = HTML.DIV;
        }

        if(properties && properties.content && properties.content instanceof HTMLElement) {
            el = properties.content;
        } else if(properties && properties.xmlns) {
            el = document.createElementNS(properties.xmlns, name);
            // namespace = properties.xmlns;
        } else {
            el = document.createElement(name);
        }

        if(appendTo && typeof appendTo === "string") {
            replace = true;
            properties.id = appendTo;
            appendTo = byId(appendTo);
            if(!properties.innerHTML && appendTo.innerHTML) properties.innerHTML = appendTo.innerHTML;
        }

        if(properties) {
            if(properties instanceof HTMLElement) {
                el.appendChild(properties);
            } else if(properties.constructor === Object) {
                for(var x in properties) {
                    if(!properties.hasOwnProperty(x)) continue;
                    if(x === HTML.INNERHTML || x === HTML.INNERTEXT) {
                        if (properties[x]) {
                            if (properties[x] instanceof HTMLElement) {
                                el.appendChild(properties[x]);
                            } else if (typeof properties[x] === "string") {
                                properties[x] = properties[x].replace(/\${(\w+)}/g, function (x, y) {
                                    return Lang[y] ? Lang[y].outerHTML : y
                                });
                                el[x] = properties[x];
                            } else {
                                el[x] = properties[x];
                            }
                        }
                    } else if(x === "variable") {
                        create.variables[properties[x]] = el;
                    } else if(x === "childName") {
                        if(appendTo ) {
                            if(appendTo instanceof HTMLElement) {
                                if(appendTo.hasOwnProperty(properties[x])) {
                                    console.warn("Property " + properties[x] + " of node has overrided.");
                                }
                                appendTo[properties[x]] = el;
                            } else {
                                console.error("Property " + properties[x] + " can not be defined for non-HTMLElement.")
                            }
                        } else {
                            console.error("Property " + properties[x] + " can not be defined for null.")
                        }
                    } else if(x === "content" && properties[x] && properties[x].constructor === Array) {
                        for(var i = 0; i < properties[x].length; i++) {
                            el.appendChild(properties[x][i]);
                        }
                    } else if(x === "content" && properties[x] instanceof HTMLElement) {
                    //     el.appendChild(properties[x]);
                    } else if(x === "children" && properties[x]) {
                        var nodes = [];
                        if(properties[x] instanceof HTMLElement) {
                            if(properties[x].childNodes) {
                                for (var i = 0; i < properties[x].childNodes.length; i++) {
                                    nodes.push(properties[x].childNodes[i]);
                                }
                            }
                        } else if (properties[x].constructor === Array) {
                            nodes = properties[x];
                        }
                        for(var i = 0; i < nodes.length; i++) {
                            if(nodes[i] instanceof HTMLElement) {
                                el.appendChild(nodes[i]);
                            }
                        }
                    } else if(properties[x] instanceof HTMLElement) {
                        el.appendChild(properties[x]);
                        el[x] = properties[x];
                    } else if(x.toLowerCase() === "onlongclick" && properties[x]) {
                        var mousedown,mouseup;
                        el.longclickFunction = properties[x];
                        mouseup = function(){
                            clearTimeout(el.longTask);
                        };
                        mousedown = function(evt){
                            clearTimeout(el.longTask);
                            // noinspection JSReferencingMutableVariableFromClosure
                            el.addEventListener("mouseup", mouseup, {passive: true});
                            // noinspection JSReferencingMutableVariableFromClosure
                            el.addEventListener("touchend", mouseup, {passive: true});
                            el.longTask = setTimeout(function(){
                                // noinspection JSReferencingMutableVariableFromClosure
                                el.removeEventListener("mouseup", mouseup, {passive: true});
                                // noinspection JSReferencingMutableVariableFromClosure
                                el.removeEventListener("touchend", mouseup, {passive: true});
                                el.longTask = -1;
                                el.longclickFunction(evt);
                            }, 500);
                        };
                        el.addEventListener("mousedown", mousedown, {passive: true});
                        el.addEventListener("touchstart", mousedown, {passive: true});
                        el.addEventListener("contextmenu", function(evt){
                            evt.preventDefault();
                            evt.stopPropagation();
                        }, {passive: false});
                    } else if(x.toLowerCase() === "onclick") {
                        el.clickFunction = properties[x];
                        if(el.clickFunction) {
                            var call = function(evt) {
                                if(el.longTask && el.longTask < 0) return;
                                el.clickFunction(evt);
                            };
                            el.addEventListener("click", call, {passive: true});
                            el.addEventListener("touch", call, {passive: true});
                        }
                    } else if(x.indexOf("on") === 0) {
                        var action = x.substr(2).toLowerCase();
                        call = properties[x];
                        if(call) {
                            el.addEventListener(action, call, {passive: true});
                        }
                    } else if(x === "async" || x === "defer") {
                        if(!!properties[x]) {
                            el.setAttribute(x, "");
                        }
                    } else {
                        var propertyName = normalizeName(x), value = properties[x];
                        if(value != undefined) {
                            if(value.constructor === Object) {
                                var v = "";
                                for(var y in value) {
                                    // noinspection JSUnfilteredForInLoop
                                    v += normalizeName(y) + ": " + value[y] + "; ";
                                }
                                value = v;
                            }
                            if(x === "hide" || x === "show") {
                                el[x] = value;
                            } else if(x in el || propertyName in el || propertyName.substr(0,5) === "data-" || x in attributable) {
                                el.setAttribute(propertyName, value);
                            } else {
                                el[x] = value;
                            }
                        }
                    }
                }
            } else if (properties.constructor === String || properties.constructor === Number) {
                el.innerHTML = properties;
            }
        }
        if(el.classList.contains("hidden")) el.isHidden = true;
        if(appendTo) {
            if(replace) {
                appendTo.parentNode.replaceChild(el, appendTo);
            } else if(appendTo.childNodes.length > 0) {
                if(position === "first") {
                    appendTo.insertBefore(el,appendTo.firstChild);
                } else {
                    appendTo.appendChild(el);
                }
            } else {
                appendTo.appendChild(el);
            }
        }
        return el;
    }
    create.variables = {};

    function clear(element) {
        if(element === null || element === undefined) return "";
        if(element instanceof HTMLElement) {
            for(var i = element.childNodes.length-1; i>=0; i--) {
                element.removeChild(element.childNodes[i]);
            }
        } else if(typeof element === "boolean") {
            return element;
        } else if(typeof element === "number") {
            return element;
        } else if(typeof element === "string") {
            element = element.replace(/<.*?>/g, "");
            return element;
        } else if(element instanceof Array || element instanceof Object) {
            for(i in element) {
                // noinspection JSUnfilteredForInLoop
                element[i] = clear(element[i])
            }
            return element;
        }
        return element;
    }

    function destroy(node) {
        try {
            clear(node);
            if(node.parentNode) node.parentNode.removeChild(node);
            node = null;
        } catch(e) {
            console.error(e);
        }
    }

    function keys(o) {
        var keys = [];
        for(var x in o) {
            // noinspection JSUnfilteredForInLoop
            keys.push(x);
        }
        return keys;
    }

    function require(names, context) {
        if(names.constructor !== Array) {
            names = [names];
        }
        var instanceNames = [];
        var instances = {};
        var returned = new EPromise();
        var count = 0;
        var max = names.length;

        function instantiate(options) {
            count++;
            if(this.isScript && this.instance && window[this.instance] && window[this.instance].constructor === Function) {
                try {
                    instances[this.instance] = new window[this.instance](context);
                    instances[this.instance].moduleName = this.instance;
                    instances[this.instance].origin = this.origin;
                } catch(e) {
                    returned.onRejected(ERRORS.INVALID_MODULE, this.instance, e);
                }
            } else if(options && options.isJSON) {
                instances[options.instance] = this;
            } else if(options && options.isText) {
                instances[options.instance] = this.toString();
            }
            if(count === max) {
                if(Object.keys(instances).length === 1) {
                    returned.onResolved(instances[instanceNames[0]]);
                } else {
                    var values = [];
                    for(var i in instanceNames) {
                        if(instances[instanceNames[i]]) {
                            values.push(instances[instanceNames[i]]);
                        } else {
                            break;
                        }
                    }
                    returned.onResolved.apply(returned, values);
                }
            }
            return true;
        }

        while(names.length) {
            var name = names.shift();

            var origin;
            var onlyname;
            var isJSON = false;
            var isScript = false;
            var isText = false;
            var body;
            if(name.constructor === String) {
                origin = name;
                var parts = name.split("/");
                var filename = parts[parts.length-1];
                // var onlyname = filename.split(".")[0];
                var filenameParts = filename.split(".");
                var extension = filenameParts.pop();
                if(filenameParts.length === 0) {
                    filenameParts.push(extension);
                    extension = null;
                }
                onlyname = filenameParts.join(".");
                instanceNames.push(onlyname);
                isText = extension === "text" || extension === "txt";
                isJSON = extension === "json";
                isScript = !isText && !isJSON;
            } else if(name instanceof Object) {
                isScript = !!name.isScript;
                isJSON = !!name.isJSON;
                isText = !!name.isText;
                body = name.body;
                name = name.src;
                origin = name;

                parts = name.split("/");
                filename = parts[parts.length-1];
                filenameParts = filename.split(".");
                extension = filenameParts.pop();
                if(filenameParts.length === 0) {
                    filenameParts.push(extension);
                    extension = null;
                }
                onlyname = filenameParts.join(".");
                instanceNames.push(onlyname);
            }
            var options = {
                src: name,
                origin: origin,
                instance: onlyname,
                async: true,
                // defer: true,
                isScript: isScript,
                isJSON: isJSON,
                isText: isText,
                onload: function() {
                    instantiate.call(this);
                },
                onerror: function(e) {
                    returned.onRejected(ERRORS.NOT_EXISTS, this.instance, e);
                }
            };
            if(isScript) {
                if(window[onlyname]) {
                    setTimeout(instantiate.bind(options), 0);
                } else {
                    create(HTML.SCRIPT, options, document.head);
                }
            } else if(isJSON) {
                getJSON(name, body).then(function(json){
                    instantiate.call(json, this);
                }.bind(options)).catch(function(e,json){
                    returned.onRejected(ERRORS.ERROR_LOADING, e, json);
                });
            } else if(body) {
                post(name, body).then(function(result){
                    instantiate.call(result.response, this);
                }.bind(options)).catch(function(e,result){
                    returned.onRejected(ERRORS.ERROR_LOADING, e, result);
                });
            } else {
                get(name).then(function(result){
                    instantiate.call(result.response, this);
                }.bind(options)).catch(function(e,result){
                    returned.onRejected(ERRORS.ERROR_LOADING, e, result, this);
                }.bind(options));
            }
        }
        return returned;
    }

    function _stringify(key, value) {
        return typeof value === "function" ? value.toString() : value;
    }
    function _parse(key, value) {
        if (typeof value === "string" && /^function.*?\([\s\S]*?\)\s*{[\s\S]*}[\s\S]*$/.test(value)) {
            var args = value
                    .replace(/\/\/.*$|\/\*[\s\S]*?\*\//mg, "") //strip comments
                    .match(/\([\s\S]*?\)/m)[0]                 //find argument list
                    .replace(/^\(|\)$/g, "")                   //remove parens
                    .match(/[^\s(),]+/g) || [],                //find arguments
                body = value.replace(/\n/mg, "").match(/{([\s\S]*)}/)[1];    //extract body between curlies
            return Function.apply(0, args.concat(body));
        } else {
            return value;
        }
    }
    function save(name, value) {
        if(value) {
            localStorage[self.origin + ":" + name] = JSON.stringify(value, _stringify);
        } else {
            delete localStorage[self.origin + ":" + name];
        }
    }

    function load(name) {
        var value = localStorage[self.origin + ":" + name];
        if(value) {
            return JSON.parse(value, _parse);
        } else {
            return null;
        }
    }

    function saveForContext(name, value) {
        if(!self.context) {
            save(name, value);
            return;
        }
        if(value) {
            localStorage[self.origin + "$" + self.context +":" + name] = JSON.stringify(value, _stringify);
        } else {
            delete localStorage[self.origin + "$" + self.context +":" + name];
        }
    }

    function loadForContext(name) {
        if(!self.context) {
            return load(name);
        }
        var value = localStorage[self.origin + "$" + self.context +":"+name];
        if(value) {
            return JSON.parse(value, _parse);
        } else {
            return null;
        }
    }

    var dialogQueue = [];
    var performingDialogInQueue;

    /**
    * dialog = new Dialog(options [, appendTo])
    * options = {
    *       id,
    *       title: name | {label, className, button},
    *       queue: true|*false*, - if true then post this dialog to the queue and wait
    *       priority: 0-9, - makes sense with queue=true
    *       modal: true|*false*, - if true then dim all behind the dialog and wait for user
    *       hiding: HIDING.method, - default is HIDING.OPACITY
    *       resizeable: true|*false*,
    *       header, - also can set up using setHeader
    *       items, - items can be added also via dialog.addItem
    *       footer, - also can set up using setFooter
    *       positive: button, - also can set up using setPositive
    *       neutral: button, - also can set up using setNeutral
    *       negative: button, - also can set up using setNegative
    *       onopen: function, - also will be called if positive is clicked
    *       onclose: function, - also will be called if negative is clicked
    *       timeout, - dialog will be closed automatically after timeout, onclose will be called
    *       help: function, - question mark will be shown on bottom right corner
    *   }
     * title.button = {
    *       icon,
    *       className,
    *       onclick: function
    *   }
     * button = {
    *       label,
    *       className,
    *       onclick,
    *       dismiss: *true*|false, - if false then dialog will keep shown,
    *   }
     * dialog.add(options)
     * options = {
    *       id,
    *       type: HTML.DIV|HTML.A|HTML.SELECT|*HTML.TEXT*|HTML.NUMBER|HTML.TEXTAREA|HTML.BUTTON|HTML.HIDDEN,
    *       className,
    *       labelClassName,
    *       label,
    *       order, - item will be added before another item that has greater order
    *       label|title|innerHTML, - actual for HTML.DIV, can be String or HTMLElement
    *       enclosed: true|*false*, - hide body and show it on click on title
    *       body, - actual only if enclosed:true
    *       value, - actual for HTML.HIDDEN, HTML.SELECT
    *       values, - actual for HTML.SELECT
    *       default, - actual for HTML.SELECT
    *       onclick: function,
    *   }
     * dialog.open()
     * dialog.close()
     * dialog.setHeader(options) - as for create
     * dialog.getHeader()
     * dialog.setFooter(options) - as for create
     * dialog.getFooter()
     * dialog.setPositive(button)
     * dialog.getPositive()
     * dialog.setNeutral(button)
     * dialog.getNeutral()
     * dialog.setNegative(button)
     * dialog.getNegative()
     *
     */
    function Dialog(options, appendTo) {
        appendTo = appendTo || document.body;
        options = options || {};

        var dim;
        if(options.modal) {
            dim = create(HTML.DIV, {className:"dialog-dim hidden"}, appendTo);
        }

        var dialog = create(HTML.DIV, {
            className:"modal shadow hidden" + optionalClassName(options.className),
            tabindex:-1,
            onblur: function(evt) {
                if(this._onblur) this._onblur(evt);
                if(this.autoclose) {
                    this.close();
                }
            },
            onfocus: options.onfocus,
            autoclose: options.autoclose,
            _onblur: options.onblur
        }, appendTo);
        dialog.options = options;
        if(dim) {
            dialog.modal = dim;
        }

        dialog.opened = false;

        dialog.clearItems = function() {
            clear(dialog.itemsLayout);
            dialog.itemsLayout.hide();
            dialog.items = [];
        };
        dialog.onaccept = function() {

        };
        dialog.oncancel = function() {

        };

        dialog.add = function(item, appendTo) {
            appendTo = appendTo || dialog.itemsLayout;

            if(item instanceof Array) {
                if(item.length) {
                    for(var i = 0; i < item.length; i++) {
                        dialog.add(item[i], appendTo);
                    }
                }
                return dialog;
            }

            item = item || {};
            item.type = item.type || HTML.DIV;

            var div,x;
            if(item.type === HTML.DIV || item.type === HTML.A) {
                if(item.enclosed) {
                    div = x = create(item.type, {
                        className: "dialog-item-enclosed" + optionalClassName(item.className)
                    });
                    var enclosedButton, enclosedIcon;
                    enclosedButton = create(HTML.DIV, {className:"dialog-item-enclosed-button", onclick: function(){
                        if(x.body.classList.contains("hidden")) {
                            enclosedIcon.innerHTML = "expand_less";
                            x.body.show(HIDING.SCALE_Y_TOP);
                            if(item.onopen) {
                                item.onopen(div);
                            }
                        } else {
                            enclosedIcon.innerHTML = "expand_more";
                            x.body.hide(HIDING.SCALE_Y_TOP);
                        }
                    }}, x);
                    enclosedIcon = create(HTML.DIV, {className:"icon dialog-item-enclosed-icon notranslate", innerHTML:"expand_more"}, enclosedButton);
                    create(HTML.DIV, {className:"dialog-item-enclosed-label", innerHTML: item.label || "Show more information"}, enclosedButton);
                    x.body = create(HTML.DIV, {className:"dialog-item-enclosed-body hidden", innerHTML:item.body || ""}, x);
                } else {
                    item.className = "dialog-item" + optionalClassName(item.className);
                    item.innerHTML = item.label || item.title || item.innerHTML || "";
                    delete item.label;
                    delete item.title;
                    var type = item.type;
                    delete item.type;
                    div = x = create(type, item);
                }
            } else if(item.type === HTML.HIDDEN) {
                div = x = create(HTML.INPUT, {type:HTML.HIDDEN, value:item.value || ""});
            } else if(item.type === HTML.SELECT) {
                var className = "dialog-item dialog-item-input" + optionalClassName(item.className);
                delete item.className;
                div = create(HTML.DIV, {className: className, onclick: function(){this.firstChild.nextSibling.click();}});

                if(item.label) {
                    var labelOptions = {
                        className:"dialog-item-label" + optionalClassName(item.labelClassName)
                    };
                    delete item.labelClassName;
                    if(item.label.constructor === String) {
                        labelOptions.innerHTML = item.label;
                    } else {
                        labelOptions.content = item.label;
                    }
                    delete item.label;
                    if(item.id){
                        labelOptions["for"] = item.id;
//                    } else {
//                        create(HTML.DIV, labelOptions , div);
                    }
                    create(HTML.LABEL, labelOptions , div);
                }

                item.className = "dialog-item-input-select" + optionalClassName(item.itemClassName);
                delete item.itemClassName;
                item.tabindex = item.tabindex || 0;
                x = new NodeSelect(item, div);
            } else {
                item.itemClassName = "dialog-item dialog-item-input" + optionalClassName(item.itemClassName);
                div = create(HTML.DIV, {className:item.itemClassName, onclick: function(){this.lastChild.click();}});

                if(item.label) {
                    /** @namespace item.labelClassName */
                    labelOptions = {
                        className:"dialog-item-label" + optionalClassName(item.labelClassName)
                    };
                    if(item.label.constructor === String) {
                        labelOptions.innerHTML = item.label;
                    } else {
                        labelOptions.content = item.label;
                    }
                    if(item.id){
                        labelOptions["for"] = item.id;
                    }
                    create(HTML.LABEL, labelOptions , div);
                }

                item.tabindex = item.tabindex || 0;
                item.className = "dialog-item-input-"+item.type + optionalClassName(item.className);
                var onkeyup = item.onkeyup;
                item.onkeyup = function(e){
                    if(e.keyCode === 13 && this.type !== HTML.TEXTAREA) {
                        dialog.onaccept();
                    } else if(e.keyCode === 27) {
                        dialog.oncancel();
                    }
                    if(onkeyup) onkeyup.call(this, e);
                };
                delete item.label;
                delete item.labelClassName;

                if(item.type === HTML.TEXTAREA) {
                    x = new NodeTextarea(item, div);
                } else {
                    x = new NodeInput(item, div);
                }
            }
            dialog.items.push(x);

            if(item.order) {
                var appended = false;
                for(var i in appendTo.childNodes) {
                    if(!appendTo.childNodes.hasOwnProperty(i)) continue;
                    if(appendTo.childNodes[i].order > item.order) {
                        appendTo.insertBefore(div, appendTo.childNodes[i]);
                        appended = true;
                        break;
                    }
                }
                if(!appended) appendTo.appendChild(div);

            } else {
                appendTo.appendChild(div);
            }
            dialog.itemsLayout.show();
            return x;
        };

        dialog.setItems = function(items) {
            dialog.clearItems();
            dialog.addItems(items);
            return dialog;
        };

        dialog.adjustPosition = function() {
            var left,top,width,height;
            var id = options.id || (options.title && options.title.label && (options.title.label.dataset && options.title.label.dataset.lang ? options.title.label.dataset.lang : options.title.label));
            if(id) {
                left = load("dialog:"+id+":left");
                top = load("dialog:"+id+":top");
                width = load("dialog:"+id+":width");
                height = load("dialog:"+id+":height");
            }
            if(left || top || width || height) {
                if(left) dialog.style.left = left;
                if(top) dialog.style.top = top;
                if(width) dialog.style.width = width;
                if(height) dialog.style.height = height;
                dialog.style.right = HTML.AUTO;
                dialog.style.bottom = HTML.AUTO;
            } else {
//                left = dialog.offsetLeft;
                var outWidth = appendTo.offsetWidth;

                if((dialog.offsetLeft + dialog.offsetWidth) >= outWidth || left === 0) {
                    dialog.style.left = ((outWidth - dialog.offsetWidth) /2)+"px";
                    dialog.style.top = ((appendTo.offsetHeight - dialog.offsetHeight) /2)+"px";
                    dialog.style.right = "auto";
                    dialog.style.bottom = "auto";
                }
            }
            dialog.focus();
            var focused = false;
            for(var i in dialog.items) {
                if(dialog.items[i].constructor === HTMLInputElement && (dialog.items[i].type === HTML.TEXT || dialog.items[i].type === HTML.NUMBER)) {
                    focused = true;
                    dialog.items[i].focus();
                    break;
                }
            }
            if(!focused) {
                if(dialog.positive && !options.timeout) dialog.positive.focus();
                else if(dialog.negative && options.timeout) dialog.negative.focus();
            }
        };

        var backButtonAction = function(event) {
            window.history.pushState(null, document.title, location.href);
            event.preventDefault();
            event.stopPropagation();
            dialog.close();
        };

        // define the method of animated showing and hiding
        if(options.hiding !== undefined) {
            if(""+options.hiding === "false") {
                options.hiding = "";
            } else if(options.hiding.constructor === String) {
                options.hiding = {
                    open: options.hiding,
                    close: options.hiding
                }
            } else {
                options.hiding.open = options.hiding.open || HIDING.OPACITY;
                options.hiding.close = options.hiding.close || HIDING.OPACITY;
            }
        } else {
            options.hiding = {
                open: HIDING.OPACITY,
                close: HIDING.OPACITY
            }
        }

        dialog.open = function(event){
            var dialog = this;
            if(dialog.opened) return;
            /** @namespace dialog.options.queue */
            if(dialog.options.queue) {
                if(performingDialogInQueue) {
                    if(dialog.options.priority) {
                        var addedToQueue = false;
                        for(var i in dialogQueue) {
                            if(dialog.options.priority > (dialogQueue[i].options.priority||0)) {
                                dialogQueue.splice(i,0,dialog);
                                addedToQueue = true;
                                break;
                            }
                        }
                        if(!addedToQueue) dialogQueue.push(dialog);
                    } else {
                        dialogQueue.push(dialog);
                    }
                    return;
                } else {
                    performingDialogInQueue = dialog;
                }
            }

            clearInterval(dialog.intervalTask);
            if(dialog.modal) {
                dialog.modal.show();
                dialog.style.zIndex += 10000;
            }
            dialog.show(dialog.options.hiding.open);
            dialog.opened = true;
            dialog.adjustPosition();
            if(dialog.options.onopen) dialog.options.onopen.call(dialog,dialog.items,event);
            if(dialog.offsetHeight) {
                if(dialog.options.timeout) {
                    var current = 0;
                    dialog.intervalTask = setInterval(function(){
                        current += 16;
                        dialog.progress.style.width = 100 - (current / dialog.options.timeout * 100) + "%";
                        if(current >= dialog.options.timeout) {
                            clearInterval(dialog.intervalTask);
                            dialog.close();
                        }
                    }, 16);
                }
            } else {
                dialog.close();
            }
            if(options.title && options.title.button == defaultCloseButton) {
                window.addEventListener("popstate", backButtonAction, {passive: true});
            }
            return dialog;
        };

        dialog.close = function (event){
            var dialog = this;
            if(!dialog.opened) {
                var index = dialogQueue.indexOf(dialog);
                if(index >= 0) {
                    dialogQueue.splice(index,1);
                }
                return;
            }
            clearInterval(dialog.intervalTask);
            dialog.hide(dialog.options.hiding.close);
            if(dialog.modal) {
                dialog.modal.hide();
                dialog.style.zIndex -= 10000;
            }
            dialog.opened = false;

            window.removeEventListener("popstate", backButtonAction);

            if(dialog.options.onclose) dialog.options.onclose.call(dialog, dialog.items, event);

            if(dialog.options.queue) {
                performingDialogInQueue = null;
                if(dialogQueue.length > 0) {
                    dialog = dialogQueue.shift();
                    dialog.open();
                }
            }
        };
        dialog.addEventListener("keyup", function(e) {
            if(e.keyCode === 27) {
                if(options.negative && options.negative.onclick) {
                    dialog.close();
                    options.negative.onclick.call(dialog,dialog.items);
                }
            }
        }, {passive: true});

        options = options || {};

        var defaultCloseButton = {
            icon: " ",
            className: "",
            onclick: function(){
                dialog.close();
                if(options.negative && options.negative.onclick) options.negative.onclick.call(dialog,dialog.items);
            }
        };
        if(options.title) {
            if(options.title.constructor === String || options.title instanceof HTMLElement) {
                options.title = {
                    label: options.title,
                    className: "",
                    button: defaultCloseButton
                }
            } else {
                options.title.className = optionalClassName(options.title.className);
                options.title.button = options.title.button || defaultCloseButton;
                if(options.title.button.className) options.title.button.className = " " + options.title.button.className;
                options.title.button.onclick = options.title.button.onclick || function(){};
            }

            var titleLayout = create(HTML.DIV, {
                className:"dialog-title" + optionalClassName(options.title.className),
                onmousedown: function(e) {
                    if(e.button !== 0) return;
//                    var position = dialog.getBoundingClientRect();
                    var position = { left: dialog.offsetLeft, top: dialog.offsetTop, width: dialog.offsetWidth, height: dialog.offsetHeight };
                    var offset = [ e.clientX, e.clientY ];
                    var moved = false;
                    function mouseup(){
                        window.removeEventListener(HTML.MOUSEUP, mouseup, false);
                        window.removeEventListener(HTML.MOUSEMOVE, mousemove, false);
                        var id = options.id || (options.title.label && ((options.title.label.dataset && options.title.label.dataset.lang) ? options.title.label.dataset.lang : options.title.label));
                        if(id && moved) {
                            if(dialog.style.left) save("dialog:"+id+":left", dialog.style.left);
                            if(dialog.style.top) save("dialog:"+id+":top", dialog.style.top);
                        }
                    }
                    function mousemove(e){
                        var deltaX = e.clientX - offset[0];
                        var deltaY = e.clientY - offset[1];
                        if(deltaX || deltaY) {
                            moved = true;
                            dialog.style.left = (position.left + deltaX) + "px";
                            dialog.style.top = (position.top + deltaY ) + "px";
                            dialog.style.right = "auto";
                            dialog.style.bottom = "auto";
                        }
                    }
                    window.addEventListener(HTML.MOUSEUP, mouseup, {passive: true});
                    window.addEventListener(HTML.MOUSEMOVE, mousemove, {passive: true});
                },
                ondblclick: function() {
                    var id = options.id || (options.title.label && ((options.title.label.dataset && options.title.label.dataset.lang) ? options.title.label.dataset.lang : options.title.label));
                    save("dialog:"+id+":left");
                    save("dialog:"+id+":top");
                    save("dialog:"+id+":width");
                    save("dialog:"+id+":height");
                    dialog.style.left = "";
                    dialog.style.top = "";
                    dialog.style.width = "";
                    dialog.style.height = "";
                    dialog.style.right = "";
                    dialog.style.bottom = "";
                    dialog.adjustPosition();
                },
                oncontextmenu: function(e){e.stopPropagation(); return false;}
        }, dialog);
            dialog.titleLayout = create(HTML.DIV, {className:"dialog-title-label", innerHTML: options.title.label }, titleLayout);
            dialog.setTitle = function(title) {
                Lang.updateNode(dialog.titleLayout, title);
                //dialog.titleLayout
            };

            if(options.title.button && options.title.button.icon) {
                create(HTML.DIV, {className:"icon dialog-title-button notranslate" + optionalClassName(options.title.button.className), innerHTML:options.title.button.icon, onclick:options.title.button.onclick}, titleLayout);
            }

            if(options.title.filter) {
                dialog.filterLayout = create(HTML.DIV, {
                    className: "dialog-filter"
                }, titleLayout);
                dialog.filterButton = create(HTML.DIV, {
                    className: "icon dialog-filter-button notranslate",
                    innerHTML: "search",
                    onclick: function() {
                        dialog.filterButton.hide();
                        dialog.filterInput.classList.remove("hidden");
                        dialog.filterInput.focus();
                    }
                }, dialog.filterLayout);
                dialog.filterInput = create(HTML.INPUT, {
                    className: "dialog-filter-input hidden",
                    tabindex: -1,
                    onkeyup: function(evt) {
                        if(evt.keyCode === 27) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            if(this.value) {
                                this.value = "";
                            } else {
                                dialog.focus();
                            }
                        }
                        clearTimeout(dialog.filterInput.updateTask);
                        dialog.filterInput.updateTask = setTimeout(function(){
                            dialog.filterInput.apply();
                        }, 300);
                    },
                    onfocus: function(evt) {
                        evt.stopPropagation();
                    },
                    onblur: function() {
                        if(!this.value) {
                            dialog.filterInput.classList.add("hidden");
                            dialog.filterButton.show();
                        }
                    },
                    onclick: function() {
                        this.focus();
                    },
                    apply: function() {
                        if(this.value) {
                            dialog.filterClear.show();
                        } else {
                            dialog.filterClear.hide();
                        }
                        var counter = 0;
                        var substring = this.value.trim().toLowerCase();
                        for(var i in dialog.itemsLayout.childNodes) {
                            if(!dialog.itemsLayout.childNodes.hasOwnProperty(i)) continue;
                            var text = dialog.itemsLayout.childNodes[i].innerText;
                            if(!substring || (text && text.toLowerCase().match(substring))) {
                                dialog.itemsLayout.childNodes[i].show(HIDING.SCALE_Y_TOP);
                                counter++;
                            } else {
                                dialog.itemsLayout.childNodes[i].hide(HIDING.SCALE_Y_TOP);
                            }
                        }
                        if(counter) {
                            dialog.filterPlaceholder.hide();
                            dialog.itemsLayout.show(HIDING.SCALE_Y_TOP);
                        } else {
                            dialog.filterPlaceholder.show();
                            dialog.itemsLayout.hide(HIDING.SCALE_Y_TOP);
                        }
                    }
                }, dialog.filterLayout);
                dialog.filterClear = create(HTML.DIV, {
                    className: "icon dialog-filter-clear hidden notranslate",
                    innerHTML: "clear",
                    onclick: function() {
                        dialog.filterInput.value = "";
                        dialog.filterInput.focus();
                        dialog.filterInput.apply();
                    }
                }, dialog.filterLayout);
            }

        }

        dialog.header = create(HTML.DIV, {className:"hidden"}, dialog);
        dialog.getHeader = function() { return dialog.header };
        dialog.setHeader = function(item) {
            if(!item) {
                dialog.header.hide();
                dialog.header.innerHTML = "";
                return dialog.header;
            }
            item.className = "dialog-header" + optionalClassName(item.className);
            item.innerHTML = item.label || item.title || item.innerHTML || "";
            delete item.label;
            delete item.title;
            var type = item.type;
            delete item.type;
            var node = create(type, item);
            dialog.header.parentNode.replaceChild(node, dialog.header);
            dialog.header = node;
            return dialog.header;
        };
        if(options.header) {
            dialog.setHeader(options.header);
        }

        dialog.itemsLayout = create(HTML.DIV, {className:"dialog-items" +optionalClassName(options.itemsClassName)}, dialog);
        dialog.items = [];
        if(options.items) {
            dialog.add(options.items);
        }

        if(options.title && options.title.filter) {
            dialog.filterPlaceholder = create(HTML.DIV, {
                className: "dialog-items hidden",
                innerHTML: "Nothing found"
            }, dialog);
        }

        dialog.footer = create(HTML.DIV, {className:"hidden"}, dialog);
        dialog.getFooter = function() { return dialog.footer };
        dialog.setFooter = function(item) {
            if(!item) {
                dialog.footer.hide();
                dialog.footer.innerHTML = "";
                return dialog.footer;
            }
            item.className = "dialog-footer" + optionalClassName(item.className);
            item.innerHTML = item.label || item.title || item.innerHTML || "";
            delete item.label;
            delete item.title;
            var type = item.type;
            delete item.type;
            var node = create(type, item, dialog);
            dialog.footer.parentNode.replaceChild(node, dialog.footer);
            dialog.footer = node;
            return dialog.footer;
        };
        if(options.footer) {
            dialog.setFooter(options.footer);
        }

        var buttons = create(HTML.DIV, {className:"dialog-buttons hidden" + optionalClassName(options.buttonsClassName)}, dialog);
        dialog.positive = create(HTML.BUTTON, {className: "hidden"}, buttons);
        dialog.neutral = create(HTML.BUTTON, {className: "hidden"}, buttons);
        dialog.negative = create(HTML.BUTTON, {className: "hidden"}, buttons);

        dialog.getPositive = function() {
            return dialog.positive;
        };
        dialog.setPositive = function(item) {
            if(!item) {
                dialog.positive.hide();
                dialog.onaccept = function() {
                };
                return dialog.positive;
            }
            item.tabindex = 0;
            item.className = "dialog-button dialog-button-positive" + optionalClassName(item.className);
            item._onclick = item.onclick;
            item.onclick = function(event){
                if(item._onclick) item._onclick.call(dialog,dialog.items,event);
                if(item.dismiss === undefined || item.dismiss) dialog.close();
            };
            item.innerHTML = item.label;

            if(dialog.positive) {
                var node = create(HTML.BUTTON, item, buttons);
                dialog.positive.parentNode.replaceChild(node, dialog.positive);
                dialog.positive = node;
            } else {
                dialog.positive = create(HTML.BUTTON, item, buttons);
            }
            buttons.show();
            dialog.onaccept = function() {
                item.onclick.call(dialog,dialog.items);
            };
            return dialog.positive;
        };
        if(options.positive && options.positive.label) {
            dialog.setPositive(options.positive);
        }

        dialog.getNeutral = function() {
            return dialog.neutral;
        };
        dialog.setNeutral = function(item) {
            if(!item) {
                dialog.neutral.hide();
                dialog.oncancel = function() {
                };
                return dialog.neutral;
            }
            item.tabindex = 0;
            item.className = "dialog-button dialog-button-neutral" + optionalClassName(item.className);
            item._onclick = item.onclick;
            item.onclick = function(event){
                if(item._onclick) item._onclick.call(dialog,dialog.items,event);
                if(item.dismiss === undefined || item.dismiss) dialog.close();
            };
            item.innerHTML = item.label;

            if(dialog.neutral) {
                var node = create(HTML.BUTTON, item, buttons);
                dialog.neutral.parentNode.replaceChild(node, dialog.neutral);
                dialog.neutral = node;
            } else {
                dialog.neutral = create(HTML.BUTTON, item, buttons);
            }
            dialog.oncancel = function() {
                item.onclick.call(dialog,dialog.items);
            };
            buttons.show();
            return dialog.neutral;
        };
        if(options.neutral && options.neutral.label) {
            dialog.setNeutral(options.neutral);
        }

        dialog.getNegative = function() {
            return dialog.negative;
        };
        dialog.setNegative = function(item) {
            if(!item) {
                dialog.negative.hide();
                return dialog.negative;
            }
            item.tabindex = 0;
            item.className = "dialog-button dialog-button-negative" + optionalClassName(item.className);
            item._onclick = item.onclick;
            item.onclick = function(event){
                if(item._onclick) item._onclick.call(dialog,dialog.items,event);
                /** @namespace item.dismiss */
                if(item.dismiss === undefined || item.dismiss) dialog.close();
            };
            item.innerHTML = item.label;

            if(dialog.negative) {
                var node = create(HTML.BUTTON, item, buttons);
                dialog.negative.parentNode.replaceChild(node, dialog.negative);
                dialog.negative = node;
            } else {
                dialog.negative = create(HTML.BUTTON, item, buttons);
            }
            buttons.show();
            return dialog.negative;
        };
        if(options.negative && options.negative.label) {
            dialog.setNegative(options.negative);
        }

        /** @namespace options.help */
        if(options.help) {
            create(HTML.BUTTON, {className:"dialog-help-button icon", onclick:options.help, innerHTML:"help_outline"}, dialog);
        }
        /** @namespace options.resizeable */
        if(options.resizeable) {
            create(HTML.DIV, {
                className:"dialog-resize",
                onmousedown: function(e) {
                    if(e.button !== 0) return;
                    var position = { left: dialog.offsetLeft, top: dialog.offsetTop, width: dialog.offsetWidth, height: dialog.offsetHeight };
                    var offset = [ e.clientX, e.clientY ];
                    var moved = false;
                    function mouseup(){
                        window.removeEventListener(HTML.MOUSEUP, mouseup, false);
                        window.removeEventListener(HTML.MOUSEMOVE, mousemove, false);
                        if((options.id || options.title.label) && moved) {
                            var id = options.id || (options.title.label && ((options.title.label.dataset && options.title.label.dataset.lang) ? options.title.label.dataset.lang : options.title.label));
                            if(dialog.style.width) save("dialog:"+id+":width", dialog.style.width);
                            if(dialog.style.height) save("dialog:"+id+":height", dialog.style.height);
                        }
                    }
                    function mousemove(e){
                        var deltaX = e.clientX - offset[0];
                        var deltaY = e.clientY - offset[1];
                        if(deltaX || deltaY) {
                            moved = true;
                            dialog.style.width = (position.width + deltaX)+"px";
                            dialog.style.height = (position.height + deltaY)+"px";
                        }
                    }
                    window.addEventListener(HTML.MOUSEUP, mouseup, {passive: true});
                    window.addEventListener(HTML.MOUSEMOVE, mousemove, {passive: true});
                    e.stopPropagation();
                }
            }, dialog);
        }

        if(options.timeout) {
            var progressBar = create(HTML.DIV, {className:"dialog-progress-bar"}, dialog);
            dialog.progress = create(HTML.DIV, {className:"dialog-progress-value"}, progressBar);
            dialog.progress.style.width = "0%";
        }
        return dialog;
    }

    function NodeInput(options, appendTo) {
        options = options || {};

        var type = HTML.INPUT;
        options.type = options.type.toLowerCase();
        if(options.type === HTML.BUTTON) {
            type = options.type;
        }

        if(options.onclick && options.type !== HTML.BUTTON) {
            var onclick = options.onclick;
            options.onclick = function(e) { this.focus(); onclick.call(this); e.stopPropagation(); };
        } else if(options.onclick) {
        } else{
            options.onclick = function(e) { this.focus(); e.stopPropagation(); };
        }
        options.value = options.value || "";

        var input = create(type, options);
        if(appendTo) appendTo.appendChild(input);

        return input;
    }

    function NodeSelect(options, appendTo) {
        options = options || {};
        var optionClassName = options.optionClassName;
        delete options.optionClassName;
        var values = options.values || options.options;
        delete options.values;
        delete options.options;
        var defaultValue = options.value || "";
        delete options.value;
        var onchange = options.onchange;
        options.onchange = function(event) {
            if(onchange) onchange.call(select, event);
            select.oldValue = select.value;
        };


        var select = create(HTML.SELECT, options);
        select.setOptions = function(values) {
            clear(this);
            if (values instanceof Array) {
                for (var i in values) {
                    // noinspection JSUnfilteredForInLoop
                    var value = values[i];
                    for (y in value) {
                        // noinspection JSUnfilteredForInLoop
                        var valueOptions = {
                            value: y,
                            innerHTML: value[y]
                        };
                        // noinspection EqualityComparisonWithCoercionJS
                        if(defaultValue == y) valueOptions.selected = true;
                        if(optionClassName) valueOptions.className = optionClassName;
                        create(HTML.OPTION, valueOptions, this);
                    }
                }
            } else if (values instanceof Object) {
                var keys = Object.keys(values).sort(function (a, b) {
                    var left = values[a];
                    if(left === undefined) return -1;
                    if(left instanceof HTMLSpanElement) {
                        left = left.innerText;
                    }
                    left = left.trim();
                    var right = values[b];
                    if(right === undefined) return 1;
                    if(right instanceof HTMLSpanElement) {
                        right = right.innerText;
                    }
                    right = right.trim();
                    return left.toLowerCase() < right.toLowerCase() ? -1 : left.toLowerCase() > right.toLowerCase() ? 1 : 0
                });
                for (i in keys) {
                    // noinspection JSUnfilteredForInLoop
                    value = values[keys[i]];
                    if(value instanceof HTMLSpanElement) {
                        value = value.innerText;
                    }
                    value = value.trim();
                    valueOptions = {
                        value: keys[i],
                        innerHTML: value
                    };
                    // noinspection EqualityComparisonWithCoercionJS
                    if(defaultValue == keys[i]) valueOptions.selected = true;
                    if(optionClassName) valueOptions.className = optionClassName;
                    create(HTML.OPTION, valueOptions, this);
                }
            }
        };
        select.oldValue = defaultValue;
        if(values) {
            select.setOptions(values);
        }
        if(appendTo) appendTo.appendChild(select);
        return select;
    }

    // using https://quilljs.com/docs/delta/
    function NodeTextarea(options, appendTo) {
        options = options || {};

        var editor = options.editor;
        delete options.editor;

        if(!options.onclick) {
            options.onclick = function(e) { e.stopPropagation(); };
        }
        var value = options.value || "";
        delete options.value;

        var textarea;
        if(editor) {
            delete options.type;
            options.onkeyup = function(e) {
                e.stopPropagation();
            };
            textarea = create(HTML.DIV, options);
            textarea.changed = false;
            textarea.editNode = create(HTML.DIV, {}, textarea);
            textarea.setValue = function (value) {
                textarea.editNode.innerHTML = value;
            };
            textarea.getValue = function () {
                return textarea.editNode.innerHTML;
            };
            textarea.changed = false;
            create(HTML.LINK, {href:"https://cdn.quilljs.com/1.3.6/quill.snow.css", rel:"stylesheet"}, document.head);
            require("https://cdn.quilljs.com/1.3.6/quill.js").then(function() {
                textarea.editor = new Quill(textarea.editNode, {
                    theme: "snow",
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            // [{ 'font': [] }],
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            // [{ 'align': [] }],
                            ['link', 'image']
                        ]
                    }
                });
                textarea.editor.on("text-change", function() {
                    textarea.changed = true;
                });
                textarea.setValue = function(value) {
                    textarea.editor.setText("");
                    textarea.editor.clipboard.dangerouslyPasteHTML(0, value);
                    textarea.changed = false;
                };
                textarea.getValue = function() {
                    var text = "";
                    var value = textarea.editNode.firstChild.innerHTML;
                    var tokens = value.split(/(<.*?>)/);
                    var indent = 0;
                    function tabs(number) { var tabs = "";for(var i = 0; i < number; i++){ tabs += "\t";} return tabs;}
                    for(var i in tokens) {
                        if(tokens[i].indexOf("</") === 0) {
                            indent--;
                            text += tabs(indent) + tokens[i] + "\n";
                        } else if(tokens[i].toLowerCase().indexOf("<img") === 0) {
                            text += tabs(indent) + tokens[i] + "\n";
                        } else if(tokens[i].indexOf("<") === 0) {
                            text += tabs(indent) + tokens[i] + "\n";
                            indent++;
                        } else if (tokens[i]) {
                            text += tabs(indent) + tokens[i] + "\n";
                        }
                    }
                    return text;
                };
            }).catch(function(e) {
                console.error(e);
                textarea.setValue(value);
            });
        } else {
            textarea = create(HTML.TEXTAREA, options);
            textarea.setValue = function(value) {
            };
            textarea.getValue = function() {
                return "";
            };
            textarea.setValue(value);
        }

        if(appendTo) appendTo.appendChild(textarea);
        return textarea;
    }

    function cloneAsObject(object) {
        var o = {};
        for(var x in object) {
            // noinspection JSUnfilteredForInLoop
            if(!object[x] || object[x].constructor === String || object[x].constructor === Number) {
                // noinspection JSUnfilteredForInLoop
                o[x] = object[x] || "";
            } else {
                // noinspection JSUnfilteredForInLoop
                o[x] = cloneAsObject(object[x]);
            }
        }
        return o;
    }

    function Lang(string, value) {
        if(value) {
            var prev = Lang.$origin[string];
            Lang.$origin[string] = value;
            if(!prev) {
                Object.defineProperty(Lang, string, {
                    get: function() {
                        Lang.$nodes[string] = Lang.$nodes[string] || create(HTML.SPAN, {
                            dataLang: string
                        });
                        var a = Lang.$nodes[string].cloneNode();
                        a.format = function() {
                            Lang.$arguments[this.dataset.lang] = arguments;
                            this.innerHTML = Lang.$origin[this.dataset.lang] || (this.dataset.lang ? this.dataset.lang.substr(0,1).toUpperCase() + this.dataset.lang.substr(1) : "");
                            this.innerHTML = this.innerHTML.sprintf(arguments);
                            return this;
                        };
                        a.innerHTML = Lang.$origin[string] || (string ? string.substr(0,1).toUpperCase() + string.substr(1) : "");
                        if(Lang.$arguments[string]){
                            a.innerHTML = a.innerHTML.sprintf(Lang.$arguments[string]);
                        }
                        a.dataset.lang = string;
                        return a;
                    }
                });
            }
        }
        return (Lang.$origin[string] && Lang[string]) || (string ? string.substr(0, 1).toUpperCase() + string.substr(1) : "");
    }

    Lang.$nodes = Lang.$nodes || {};
    Lang.$origin = Lang.$origin || {};
    Lang.$arguments = Lang.$arguments || {};

    Lang.overrideResources = function(options) {
        if(!options || !options.resource) {
            console.error("Not defined resources");
            return;
        }
        if(options.resources.constructor === String) {
            getJSON(options.resources, options).then(function(json){
                var nodes = document.getElementsByTagName(HTML.SPAN);
                console.warn("Switching to resources \""+(options.locale || options.resources)+"\".");
                for(var x in json) {
                    // noinspection JSUnfilteredForInLoop
                    Lang(x, json[x]);
                }
                for(var i = 0; i < nodes.length; i++) {
                    if(nodes[i].dataset.lang) {
                        try {
                            nodes[i].innerHTML = Lang[nodes[i].dataset.lang].innerHTML;
                        } catch(e) {
                            console.warn("Resource not found: " + nodes[i].dataset.lang);
                        }
                    }
                }
                if(options.callback) options.callback();
            }).catch(function(code, xhr, error){
                switch(code) {
                    case ERRORS.ERROR_LOADING:
                        console.warn("Error fetching resources for",options,xhr.status + ': ' + xhr.statusText);
                        break;
                    case ERRORS.INCORRECT_JSON:
                        console.warn("Incorrect, empty or damaged resources file for",options,error,xhr);
                        break;
                    default:
                        console.warn("Incorrect, empty or damaged resources file for",options,error,xhr);
                        break;
                }
                if(options.callback) options.callback();
            });

        } else if(options.resources.resources) {
            for(var x in options.resources.resources) {
                // noinspection JSUnfilteredForInLoop
                Lang(x, options.resources.resources[x]);
            }
        }
    };
    Lang.updateNode = function(node, lang) {
        if(typeof lang === "string") {
            node.innerHTML = lang;
        } else if(node && lang && lang.dataset && lang.dataset.lang) {
            node.innerHTML = lang.outerHTML;
        }
    };

    /**
     get(url [, post])
     .then(callback(xhr))
     .catch(callback(code,xhr));
     */

    function rest(method, url, body) {
        var returned = new EPromise();
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        if(this.isJSON) {
            xhr.setRequestHeader("Content-type", "application/json");
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) {
                returned.onRejected(xhr.status, xhr);
            } else {
                returned.onResolved(xhr);
            }
        };
        try {
            if(body) {
                if(body.constructor === Object) {
                    body = JSON.stringify(body);
                }
                xhr.send(body);
            } else {
                xhr.send();
            }
        } catch(e) {
            returned.onRejected(ERRORS.ERROR_SENDING_REQUEST, xhr);
            return;
        }
        return returned;
    }

    function get(url) {
        return rest.call(this, "GET",url);
    }

    function post(url, body) {
        return rest.call(this, "POST", url, body);
    }

    function put(url) {
        return rest.call(this, "PUT",url);
    }

    /**
     getJSON(url [, post])
     .then(callback(xhr))
     .catch(callback(code,xhr));
     */
    function getJSON(url, body) {
        var callbacks = {
            then: function(json,xhr) { console.warn("Define .then(callback(json,xhr){...}) for", json, xhr)},
            "catch": function(code, xhr) { console.error(code, xhr); }
        };
        var catchFunction = function(callback) {
            callbacks.catch = callback;
        };
        var thenFunction = function(callback) {
            callbacks.then = function(xhr) {
                try {
                    var text = xhr.responseText;
                    text = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/[\r\n]+/gm, " ");
                    var json = JSON.parse(text);
                    try {
                        callback(json, xhr);
                    } catch(e) {
                        callbacks.catch(ERRORS.CALLBACK_FAILED, e, json);
                    }
                } catch(e) {
                    callbacks.catch(ERRORS.INCORRECT_JSON, xhr, e);
                }
            };
            return { "catch": catchFunction };
        };
        setTimeout(function(){
            if(body) post.bind({isJSON:true})(url, body).then(callbacks.then).catch(callbacks.catch);
            else get.bind({isJSON:true})(url).then(callbacks.then).catch(callbacks.catch);
        },0);
        return { then: thenFunction, "catch": catchFunction };
    }

    function Drawer(options, appendTo) {
//        collapsed = options.collapsed;
        var collapsed = load(options.collapsed);
        if(options.collapsed === undefined) {
            collapsed = load("drawer:collapsed");
            options.collapsed = "drawer:collapsed";
        } else if(typeof options.collapsed === "boolean") {
            collapsed = options.collapsed;
            options.collapsed = "drawer:collapsed";
        } else {
            collapsed = load(options.collapsed);
        }

        var swipeHolder = function(e){
            var touch;
            if(e.changedTouches) touch = e.changedTouches[0];

            var startX = e.pageX || touch.pageX;
            var lastX = startX;
            var lastDelta = 0;

            var endHolder = function(e){
                window.removeEventListener("touchend",endHolder);
                window.removeEventListener("touchmove",moveHolder);
                layout.style.transition = "";

                if(e.changedTouches) touch = e.changedTouches[0];
                var x = parseInt(layout.style.left || 0);
                if(lastDelta < -20 || (lastDelta <=0 && x < -layout.offsetWidth/2)) {
                    layout.style.left = (-layout.offsetWidth*1.5)+"px";
                    setTimeout(function(){layout.close()},500);
                } else {
                    layout.style.left = "";
                }
            };
            var moveHolder = function(e) {
                var delta;
                if(e.changedTouches) touch = e.changedTouches[0];
                delta = (e.pageX || touch.pageX) - startX;
                lastDelta = (e.pageX || touch.pageX) - lastX;
                lastX = e.pageX || touch.pageX;

                if(delta <= -10) {
                    layout.style.left = delta + "px";
                    e.stopPropagation();
                }
            };
            window.addEventListener("touchend", endHolder, {passive: true});
            window.addEventListener("touchmove", moveHolder, {passive: true});

            layout.style.transition = "none";
        };

        var layout = create(HTML.DIV, {
            className:"drawer noselect changeable" + (collapsed ? " collapsed" : "") + optionalClassName(options.className),
            tabindex: -1,
            onblur: function(){
                layout.close();
                return true;
            },
            open: function() {
                var self = this;
                self.classList.add("drawer-open");
                self.style.left = "";
                self.scrollTop = 0;
                self.menu.scrollTop = 0;
                setTimeout(function() {
                    this.focus();
                }.bind(self), 0);
            },
            close: function(){
                this.classList.remove("drawer-open");
            },
            toggle: function() {
                if(this.classList.contains("drawer-open")) {
                    this.blur();
                } else {
                    this.open();
                }
            },
            sections: [],
            toggleSize: function(force) {
                collapsed = !collapsed;
                if(force !== undefined) collapsed = force;
                save("drawer:collapsed", collapsed);
                layout.toggleButton.innerHTML = collapsed ? "last_page" : "first_page";
                layout.classList[collapsed ? "add" : "remove"]("collapsed");
                layoutHeaderHolder.classList[collapsed ? "add" : "remove"]("collapsed");
                /** @namespace options.ontogglesize */
                if(options.ontogglesize) options.ontogglesize(collapsed);
            },
            ontouchstart: swipeHolder
//            onmousedown: swipeHolder
        });
        layout.items = {};
        if(typeof appendTo === "string") {
            appendTo = byId(appendTo);
            appendTo.parentNode.replaceChild(layout, appendTo);
        } else {
            appendTo.insertBefore(layout, appendTo.firstChild);
        }

        layout.frame = create("iframe", {width:"100%",height:"1%", className:"drawer-iframe"}, layout);
        layout.frame.contentWindow.addEventListener("resize",function(){
            if(!layout.resizeTask) layout.resizeTask = setTimeout(function(){
                if(options.ontogglesize) options.ontogglesize();
                delete layout.resizeTask;
            }, 500);
        }, {passive: true});

        var swipeRightHolder = function(e){
            var touch;
            if(e.changedTouches) touch = e.changedTouches[0];

            var startX = e.pageX || touch.pageX;
            var lastDelta = 0;

            layout.style.transition = "none";
            layout.style.left = "-10000px";
            layout.classList.add("drawer-open");
            layout.style.left = (-layout.offsetWidth + startX)+"px";

            var endHolder = function(e){
                window.removeEventListener("touchend", endHolder);
                window.removeEventListener("touchmove", moveHolder);
                layout.style.transition = "";

                if(e.changedTouches) touch = e.changedTouches[0];
                var x = parseInt(layout.style.left || 0);
                if(lastDelta < -20 || (lastDelta <=0 && x < -layout.offsetWidth/2)) {
                    layout.style.left = (-layout.offsetWidth*1.5)+"px";
                    setTimeout(function(){layout.close()},500);
                } else {
                    layout.style.left = "";
                }
            };
            var moveHolder = function(e) {
                var delta;
                if(e.changedTouches) touch = e.changedTouches[0];
                delta = (e.pageX || touch.pageX) - layout.offsetWidth;
                if(delta > 0) delta =0;
                    layout.style.left = delta + "px";
                    e.stopPropagation();
            };
            window.addEventListener("touchend", endHolder, {passive: true});
            window.addEventListener("touchmove", moveHolder, {passive: true});
        };

        var layoutHeaderHolder = create(HTML.DIV, {
            className: "drawer-header-holder changeable",
            ontouchstart: swipeRightHolder
        });
        layout.parentNode.insertBefore(layoutHeaderHolder, layout);

        layout.header = create(HTML.DIV, { className:"drawer-header changeable" }, layout);

        if(options.logo) {
            create(HTML.IMG, {
                className:"drawer-header-logo changeable",
                src:options.logo.src,
                onclick: options.logo.onclick
            }, layout.header);
        }
        layout.headerPrimary = create(HTML.DIV, {className:"drawer-header-name changeable", onclick: function(){
            layout.blur();
            if(options.onprimaryclick) options.onprimaryclick();
        }}, layout.header);
        layout.headerTitle = create(HTML.DIV, {className:"drawer-header-title changeable", innerHTML:options.title}, layout.header);
        layout.headerSubtitle = create(HTML.DIV, {className:"drawer-header-subtitle changeable", innerHTML: options.subtitle }, layout.header);


        layout.menu = create(HTML.DIV, {className:"drawer-menu changeable"}, layout);
        options.sections = options.sections || {};
        for(var i=0;i<10;i++){
            layout.sections[i] = create({order:i, className:"hidden" + (i===9 ? "" : " drawer-menu-divider")}, layout.menu)
                .place({className: "drawer-menu-section-title media-hidden"})
                .place({});
            if(options.sections[i]) {
                layout.sections[i].firstChild.place({className: "drawer-menu-section-label", innerHTML: options.sections[i]});
            }

            /** @namespace options.collapsible */
            if(options.collapsible && options.collapsible.indexOf(i) >= 0) {
                var sectionCollapsed = load("drawer:section:collapsed:"+i);
                if(sectionCollapsed) layout.sections[i].lastChild.hide();

                layout.sections[i].firstChild.addEventListener("click", function(){
                    if(this.nextSibling.isHidden) {
                        this.nextSibling.show(HIDING.SCALE_Y_TOP);
                        this.lastChild.show();
                        this.lastChild.previousSibling.hide();
                        save("drawer:section:collapsed:"+this.parentNode.order);
                    } else {
                        this.nextSibling.hide(HIDING.SCALE_Y_TOP);
                        this.lastChild.hide();
                        this.lastChild.previousSibling.show();
                        save("drawer:section:collapsed:"+this.parentNode.order, true);
                    }
                }, {passive: true});
                layout.sections[i].firstChild.place({ className: "icon drawer-menu-item drawer-menu-item-expand notranslate" + (sectionCollapsed ? "" : " hidden"), innerHTML: "expand_more"});
                layout.sections[i].firstChild.place({ className: "icon drawer-menu-item drawer-menu-item-collapse notranslate" + (sectionCollapsed ? " hidden" : ""), innerHTML: "expand_less"});
            }
        }

        layout.add = function(options) {
            options = options || {};
            options.section = options.section || DRAWER.SECTION_PRIMARY;
            if(!options.id) throw Error("ID is not defined for drawer item:", options);
            if(!options.name) throw Error("Name is not defined for drawer item:", options);
            var callback = options.callback || function() {console.warn("Callback is not defined for drawer item:", options);};
            options.priority = options.priority || 0;

            var th = create(HTML.DIV, {
                id: options.name,
                className:"drawer-menu-item",
                onclick: function (event) {
                    callback.call(this, event);
                    layout.blur();
//                    setTimeout(function () {
//                        callback.call(self,event);
//                        layout.blur();
//                    }, 100);
                },
                hide: function() {
                    this.classList.add("hidden");
                    this.fixShowing();
                    return this;
                },
                show: function() {
                    this.classList.remove("hidden");
                    this.fixShowing();
                    return this;
                },
                enable: function() {
                    this.classList.remove("disabled");
                    return this;
                },
                disable: function() {
                    this.classList.add("disabled");
                    return this;
                },
                fixShowing: function() {
                    var parent = th.parentNode.parentNode;
                    var shown = false;
                    for(var i in parent.childNodes) {
                        if(parent.childNodes.hasOwnProperty(i)) {
                            if(!parent.childNodes[i].classList.contains("hidden")) shown = true;
                        }
                    }
                    if(shown) parent.show();
                    else parent.hide();
                },
                increaseBadge: function() {
                    var val = parseInt(this.badgeNode.innerHTML || "0");
                    val ++;
                    this.badgeNode.innerHTML = val;
                    this.showBadge();
                },
                showBadge: function() {
                    this.badgeNode.show();
                },
                hideBadge: function() {
                    this.badgeNode.hide();
                    this.badgeNode.innerHTML = "0";
                },
                priority: options.priority
            });
            layout.items[options.id] = th;

            var added = false;
            for(var i = 0; i < layout.sections[options.section].lastChild.childNodes.length; i++) {
                var node = layout.sections[options.section].lastChild.childNodes[i];
                if(node.priority < options.priority) {
                    node.parentNode.insertBefore(th, node);
                    added = true;
                }
            }
            if(!added) {
                layout.sections[options.section].lastChild.appendChild(th);
            }

            if(options.icon) {
                if(options.icon.constructor === String) {
                    th.iconNode = create(HTML.DIV, { className:"icon drawer-menu-item-icon notranslate", innerHTML: options.icon }, th);
                } else {
                    th.appendChild(options.icon);
                    th.iconNode = options.icon;
                }
            }
            if(callback) {
                th.labelNode = create(HTML.DIV, {
                    className: "drawer-menu-item-label",
                    innerHTML: options.name
                }, th);
            }
            th.badgeNode = create(HTML.DIV, { className:"drawer-menu-item-badge hidden", innerHTML: "0" }, th);
            layout.sections[options.section].show();

            return th;
        };

        layout.remove = function(id) {
            if(layout.items[id]) {
                var item = layout.items[id];
                item.parentNode.removeChild(item);
                delete layout.items[id];
                return item;
            }
        };

        layout.footer = create(HTML.DIV, { className:"drawer-footer"}, layout);

        layout.toggleButton = create(HTML.DIV, {className: "icon drawer-menu-item-icon drawer-footer-button notranslate", innerHTML: collapsed ? "last_page" : "first_page", onclick: function(){
            layout.toggleSize();
        }}, layout.footer);
        if(options.footer) {
            create(HTML.DIV, options.footer, layout.footer);
        }

        return layout;
    }

    function Toast() {
        var toast = create(HTML.DIV, {className:"toast-holder hidden", onclick: function(){ this.hide(HIDING.SCALE_Y_BOTTOM); }});
        toast.content = create(HTML.DIV, {className:"toast shadow"}, toast);
        toast.show = function(text,delay){
            toast.content.classList.remove("toast-error");
            if(!toast.parentNode) document.body.appendChild(toast);
            clearTimeout(toast.hideTask);
            Lang.updateNode(toast.content, text);
            HTMLDivElement.prototype.show.call(toast, HIDING.SCALE_Y_BOTTOM);
            delay = delay || 5000;
            if(delay > 0) {
                toast.hideTask = setTimeout(function(){
                    toast.hide(HIDING.SCALE_Y_BOTTOM);
                },delay);
            }
        };
        toast.error = function(text,delay){
            this.show(text, delay);
            toast.content.classList.add("toast-error");
        };
        return toast;
    }

    function notification(options) {
        /** @namespace options.persistent */
        if(!options.persistent && !document.hidden) return;
        if(load("main:disable_notification")) return;
        if (!("Notification" in window)) {
            console.error("This browser does not support desktop notification");
        } else {
            Notification.requestPermission(function(result) {
                if(result === "granted") {
                    var title = options.title;
                    delete options.title;
                    var notif;
                    try {
                        notif = new Notification(title, options);
                    } catch (e) {
                        if(e.name === "TypeError") {
                            navigator.serviceWorker.register("/sw.js").then(function(){
                                navigator.serviceWorker.ready.then(function(registration) {
                                    notif = registration.showNotification(title, options);
                                });
                            });
                        }
                    }
                    notif.onclick = function(e){
                        notif.close();
                        window.focus();
                        if(options.onclick) options.onclick(e);
                        else {console.warn("Redefine onclick.")}
                    };
                    if(options.duration) {
                        setTimeout(function(){
                            notif.close();
                        }, options.duration);
                    }
                }
            });
        }
    }

    function ActionBar(options, appendTo) {

        var actionbar = create(HTML.DIV, {
            className:"actionbar changeable" + optionalClassName(options.className),
            toggleSize: function(force){
                var collapsed = actionbar.classList.contains("collapsed");
                if(force !== undefined) collapsed = force;
                actionbar.classList[collapsed ? "add" : "remove"]("collapsed");
//                actionbarHolder.classList[collapsed ? "add" : "remove"]("actionbar-collapsed");
                if(options.ontogglesize) options.ontogglesize(force);
            },
            setTitle: function(text) {
                if(text instanceof HTMLElement) {
                    actionbar.titleNode.innerHTML = text.outerHTML;
                } else {
                    actionbar.titleNode.innerHTML = text;
                }
            }
        });
        create(HTML.SPAN, {innerHTML:"menu", className:"actionbar-button icon notranslate", onclick: options.onbuttonclick, onfocus:function(){}}, actionbar);
        var label = create(HTML.DIV, {className:"actionbar-label changeable"}, actionbar);
        actionbar.titleNode = create(HTML.DIV, {className:"actionbar-label-title changeable", innerHTML: options.title || ""}, label);
        actionbar.subtitle = create(HTML.DIV, {className:"actionbar-label-subtitle changeable", innerHTML: options.subtitle || ""}, label);

        if(typeof appendTo === "string") {
            appendTo = byId(appendTo);
            appendTo.parentNode.replaceChild(actionbar, appendTo);
        } else {
            appendTo.insertBefore(actionbar, appendTo.firstChild);
        }

//        var actionbarHolder = create(HTML.DIV, {className: "actionbar-holder changeable"});
//        actionbar.parentNode.insertBefore(actionbarHolder, actionbar);


        return actionbar;
    }

    function copyToClipboard(input) {
        if(!input) return false;
        input.focus();
        input.select();

        try {
            return document.execCommand('copy');
        } catch(err) {
            return false;
        }
    }

    /**
    * table = new Table(options [, appendTo])
    * table.add(rowOptions)
    * table.head.cells[index]
    * table.rows.clear()
    * table.rows[index].cells[index]
    * table.filter.set(filter) - removes all filters and set specified
    * table.filter.add(filter)
    * table.filter.remove(filter)
    * table.filter.clear()
    * table.placeholder.show("Sample text")
    * table.placeholder.hide()
    * table.sort(index)
    * table.sorts()
    * table.update()
    *
    * options = {
    *   className,
    *   caption: captionOptions
    *   items: [rowOptions]
    * }
    * captionOptions = {
    *   innerHTML|label,
    *   className,
    *   items: [
    *       label,
    *       selectable: true/*false*
    *   ]
    * }
    * rowOptions = {
    *   className,
    *   onclick: function,
    *   cells: [cellOptions]
    * }
    * cellOptions = {
    *   innerHTML,
    *   className,
    *   style,
    *   sort: Number/String,
    * }
    */
    function Table(options, appendTo) {
        options.className = "table" + optionalClassName(options.className);
        var table = create(HTML.DIV, {
            className: options.className,
            filter: function() {
                if(!options.caption.items) return;
                    for(var i in table.rows) {
                        var valid = true;
                        for(var j in table.filter.options) {
                            // noinspection JSUnfilteredForInLoop
                            if(table.filter.options[j]) {
                                // noinspection JSUnfilteredForInLoop
                                valid = table.filter.options[j].call(table,table.rows[i]);
                            }
                            if(!valid) break;
                        }
                        var row = table.rows[i];
                        if(valid && row.isHidden) {
                            setTimeout(function() {
                                this.show();
                            }.bind(row), 0);
                        } else if (!valid && !row.isHidden) {
                            setTimeout(function() {
                                this.hide();
                            }.bind(row), 0);
                        }
                    }
            },
            rows: [],
            saveOption: function(name, value) {
                if(options.id) {
                    delete savedOptions[name];
                    if(value) {
                        savedOptions[name] = value;
                        save("table:" + options.id, savedOptions);
                    }
                }
            },
            add: function(row) {
                row = row || {};
                row.className = "tr" +(row.onclick ? " clickable":"")+optionalClassName(row.className);

                var res = create(HTML.DIV, row, table.body);
                res.cells = [];
                res.table = table;

                for(var i in row.cells) {
                    // noinspection JSUnfilteredForInLoop
                    var item = row.cells[i];
                    item.className = "td" + optionalClassName(item.className);
                    item.innerHTML = item.innerHTML || item.label;
                    res.cells.push(create(HTML.DIV, item, res));
                }
                table.rows.push(res);
                table.placeholder.hide();
                table.update();
                return res;
            },
            update: function() {
                if(!options.caption.items) return;

                clearTimeout(table.updateTask);
                table.updateTask = setTimeout(function(){
                    table.filter();
                    for(var i in table._sorts) {
                        try{
                            // noinspection JSUnfilteredForInLoop
                            var index = table._sorts[i].index;
                            // noinspection JSUnfilteredForInLoop
                            table.head.cells[index].sort = table._sorts[i].mode;
                            table.sort(index);
                        } catch(e) {
                            console.error(e);
                        }
                    }
                }, 0);

            },
            sort: function(index) {
                if(!options.caption.items) return;

                var sort = table.head.cells[index].sort;

                table.head.cells[index].firstChild.show();
                table.head.cells[index].firstChild.classList[sort > 0 ? "add" : "remove"]("table-sort-descend");

                var rows = [];
                for(var i = 0; i < table.body.childNodes.length; i++) {
                    rows.push(table.body.childNodes[i]);
                }
                rows.sort(function(a, b) {
                    var aCriteria = a.cells[index].sort === undefined ? a.cells[index].innerText.toLowerCase() : a.cells[index].sort;
                    var bCriteria = b.cells[index].sort === undefined ? b.cells[index].innerText.toLowerCase() : b.cells[index].sort;

                    return aCriteria === bCriteria ? 0 : (aCriteria > bCriteria ? 1 : -1) * sort;
                });
                for(i in rows) {
                    table.body.appendChild(rows[i]);
                }
            },
            _sorts: [],
            sorts: function(options) {
                if(!options) return table._sorts;
                for(var i in table._sorts) {
                    // noinspection JSUnfilteredForInLoop, EqualityComparisonWithCoercionJS
                    if(table._sorts[i].index == options.index) {
                        // noinspection JSUnfilteredForInLoop
                        table._sorts.splice(i, 1);
                        break;
                    }
                }
                if(options.mode) table._sorts.push(options);
                table.saveOption("sorts", table._sorts);
            }
        });

        Object.defineProperty(table.rows, "clear", {
            enumerable: false,
            value: function() {
                var item;
                while(item = table.rows.pop()) {
                    item.parentNode.removeChild(item);
                }
            }
        });

        if(appendTo) appendTo.appendChild(table);

        options.caption = options.caption || {};
        options.caption.className = "thead" + optionalClassName(options.caption.className);
        if(options.caption.items) {
            table.head = create(HTML.DIV, {
                className: options.caption.className,
                oncontextmenu: function(e){e.stopPropagation(); return false;}
            }, table);
            table.head.cells = [];

//            var div = create(HTML.DIV, {className:"tr"}, table.head);
            var selectable = false;
            for(var i in options.caption.items) {
                // noinspection JSUnfilteredForInLoop
                var item = options.caption.items[i];
                item.className = "th" + optionalClassName(item.className);
                delete item.innerHTML;
                if(options.sort === undefined || options.sort) {
                    item.index = i;
                    item.sort = 0;
                    item.onclick = function() {
                        this.sort ++;
                        if(this.sort === 0) this.sort ++;
                        else if(this.sort > 1) this.sort = -1;

                        table.sorts({ index: this.index, mode: this.sort });
                        table.sort(this.index);

                    };
                    item.ondblclick = function() {
                        this.sort = 0;
                        table.sorts({ index: this.index });
                        table.head.cells[this.index].firstChild.hide();
                        table.update();
                    };
                }
                if(item.selectable) {
                    item.onlongclick = function() {
                        this.selectButton.click();
                    }
                }
                var cell = create(HTML.DIV, item, table.head);
                cell.sortIcon = create(HTML.DIV,{className:"icon table-sort notranslate hidden", innerHTML: "sort"}, cell);
                cell.label = create(HTML.SPAN, {innerHTML: item.innerHTML || item.label}, cell);
                //cell.oncontextmenu = function(e){e.stopPropagation(); e.preventDefault(); return false;}

                if(item.selectable) {
                    selectable = true;
                    cell.selectButton = create(HTML.DIV, {
                        className:"icon table-select notranslate",
                        innerHTML:"expand_more",
                        onclick: function(e){
                            var cell = this.parentNode;
                            progressHolder.show();
                            e.stopPropagation();
                            setTimeout(function() {
                                var selected = {};
                                var index = this.parentNode.index;
                                for(var j in table.rows) {
                                    if(selected[table.rows[j].cells[index].innerHTML]) {
                                        selected[table.rows[j].cells[index].innerHTML] ++;
                                    } else {
                                        selected[table.rows[j].cells[index].innerHTML] = 1;
                                    }
                                }
                                var menuItems = [{
                                    type: HTML.DIV,
                                    innerHTML: "&#150;",
                                    onclick: function() {
                                        table.saveOption("selectable");
                                        delete table.selectable;
                                        for(var i in table.head.cells) {
                                            // noinspection JSUnfilteredForInLoop
                                            if (table.head.cells[i].selectButton) {
                                                // noinspection JSUnfilteredForInLoop
                                                table.head.cells[i].selectButton.classList.remove("table-select-active");
                                                // noinspection JSUnfilteredForInLoop
                                                table.filter.remove(table.head.cells[i].filter);
                                                // noinspection JSUnfilteredForInLoop
                                                delete table.head.cells[i].filter;
                                            }
                                        }
                                        cell.selectButton.classList.remove("table-select-active");
                                    }
                                }];
                                for(var x in selected) {
                                    menuItems.push({
                                        type: HTML.DIV,
                                        innerHTML: x,
                                        onclick: function() {
                                            var self = this;
                                            if(table.selectable) {
                                                table.head.cells[table.selectable.index].selectButton.classList.remove("table-select-active");
                                            }
                                            table.selectable = { index: index, string: this.innerHTML};
                                            table.saveOption("selectable", table.selectable);

                                            if(cell.filter) table.filter.remove(self.parentNode.filter);
                                            var filterSelected = function(row) {
                                                if(row.table && row.table.selectable) {
                                                    return row.cells[row.table.selectable.index].innerHTML === row.table.selectable.string;
                                                } else {
                                                    return true;
                                                }
                                            };
                                            cell.selectButton.classList.add("table-select-active");
                                            cell.filter = table.filter.add(filterSelected)
                                        }
                                    })
                                }

                                var menu = new Menu({
                                    items: menuItems,
                                    title: this.parentNode.label.cloneNode(true)
                                });
                                progressHolder.hide();
                                menu.open(this.parentNode);
                            }.bind(this), 0)
                        }
                    }, cell);
                }
                table.head.cells.push(cell);
            }

            if((options.filter === undefined || options.filter) || (options.sort === undefined || options.sort) || selectable) {
                table.resetButton = create(HTML.DIV, {
                    className: "icon table-reset-button notranslate",
                    innerHTML: "clear_all",
                    title: "Reset customizations",
                    onclick: function() {
                        table._sorts = [];
                        table.saveOption("sorts");
                        for(var i in table.head.cells) {
                            table.head.cells[i].sort = 0;
                            table.head.cells[i].firstChild.hide();
                            if(table.head.cells[i].selectButton) {
                                table.head.cells[i].selectButton.classList.remove("table-select-active");
                            }
                            table.saveOption("selectable", table.selectable);
                        }
                        if(table.filterInput) {
                            table.filter.clear();
                            table.filterInput.value = "";
                            table.filterInput.focus();
                            table.filterInput.apply();
                            table.filterInput.blur();
                        }
                        table.update();
                    }
                }, table);
            }

            if(options.filter === undefined || options.filter) {
                table.filterLayout = create(HTML.DIV, {
                    className: "table-filter"
                }, table);

                table.filterButton = create(HTML.DIV, {
                    className: "icon table-filter-button notranslate",
                    innerHTML: "search",
                    title: "Filter",
                    onclick: function() {
                        table.filterButton.hide();
                        table.filterInput.classList.remove("hidden");
                        table.filterInput.focus();
                    }
                }, table.filterLayout);

                table.filterInput = create(HTML.INPUT, {
                    className: "table-filter-input hidden",
                    tabindex: -1,
                    onkeyup: function(evt) {
                        if(evt.keyCode === 27) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            if(this.value) {
                                this.value = "";
                            } else {
                                this.blur();
                            }
                        }
                        clearTimeout(table.filterInput.updateTask);
                        table.filterInput.updateTask = setTimeout(function(){
                            table.filterInput.apply();
                        }, 300);
                    },
                    onblur: function() {
                        if(!this.value) {
                            table.filterInput.classList.add("hidden");
                            table.filterButton.show();
                        }
                    },
                    onclick: function() {
                        this.focus();
                    },
                    _filter: function(row) {
                        for(var i in row.cells) {
                            if(row.cells[i].innerText.toLowerCase().indexOf(this.filterInput.value.toLowerCase()) >= 0) return true;
                        }
                        return false;
                    },
                    apply: function() {
                        if(this.value) {
                            table.filterClear.show();
                        } else {
                            table.filterClear.hide();
                        }
                        table.filter.add(table.filterInput._filter);
                        table.filter();
                    }
                }, table.filterLayout);
                table.filterClear = create(HTML.DIV, {
                    className: "icon table-filter-clear hidden notranslate",
                    innerHTML: "clear",
                    onclick: function() {
                        table.filterInput.value = "";
                        table.filterInput.focus();
                        table.filterInput.apply();
                    }
                }, table.filterLayout);
            }

            function normalizeFunction(func) {
                if(!func) return null;
                save(":functemp", func);
                func = load(":functemp");
                save(":functemp");
                return func;
            }
            function checkIfFilterInList(filter) {
                if(!filter) return true;
                for(var i in table.filter.options) {
                    // noinspection JSUnfilteredForInLoop
                    if(table.filter.options[i].toString() === filter.toString()) {
                        // noinspection JSUnfilteredForInLoop
                        return i;
                    }
                }
                return -1;
            }

            table.filter.set = function(filterOption) {
                if(filterOption) {
                    table.filter.options = [normalizeFunction(filterOption)];
                } else {
                    table.filter.options = null;
                }
                table.saveOption("filter",table.filter.options);
                table.filter();
            };
            table.filter.add = function(filterOption) {
                table.filter.options = table.filter.options || [];
                var newFilterOption = normalizeFunction(filterOption);
                if(checkIfFilterInList(newFilterOption) < 0) {
                    table.filter.options.push(newFilterOption);
                }
                table.saveOption("filter",table.filter.options);
                table.filter();
                return newFilterOption;
            };
            table.filter.remove = function(filterOption) {
                table.filter.options = table.filter.options || [];
                var newFilterOption = normalizeFunction(filterOption);
                var index = checkIfFilterInList(newFilterOption);
                if(index >= 0) {
                    table.filter.options.splice(index,1);
                }
                table.saveOption("filter",table.filter.options);
                table.filter();
            };
            table.filter.clear = function() {
                table.filter.options = null;
                table.saveOption("filter",table.filter.options);
                table.filter();
            }
        }

        /** @namespace options.bodyClassName */
        table.body = create(HTML.DIV, {className:"tbody" + optionalClassName(options.bodyClassName)}, table);

        table.placeholder = create(HTML.DIV, {
            className:"table-placeholder",
            innerHTML: options.placeholder || "No data",
            show: function(text){
//                clear(table.body);
                if(text) table.placeholder.innerHTML = text;
                table.placeholder.classList.remove("hidden");
            }
        }, table);

        if(options.id) {
            var savedOptions = load("table:" + options.id) || {};
            table.filter.options = savedOptions.filter;
            table._sorts = savedOptions.sorts || [];

            table.filter();
        }

        return table;
    }

    var loadingHolder;
    function loading(progress) {
        loadingHolder = loadingHolder || create("div", {style:{
            position: "fixed", top: 0, bottom: 0, left: 0, right: 0,
            zIndex: 10000, backgroundColor: "white", display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center", fontFamily: "sans-serif"
        }}, document.body)
            .place(HTML.DIV, {className:"loading-progress-circle"})
            .place(HTML.DIV, {className:"loading-progress-title", innerHTML: "Loading, please wait... "})
            .place(HTML.DIV, {className:"loading-progress-subtitle hidden"});
        if(progress) {
            Lang.updateNode(loadingHolder.lastChild, progress);
            loadingHolder.lastChild.show();
        } else {
            loadingHolder.lastChild.hide();
        }
    }
    loading.hide = function() {
        loadingHolder.hide();
    };

    var progressHolder;
    /**
     * progress(options [, appendTo])
     * options = {
    *       label,
    *       className,
    *       dim: true|*false*,
    *   }
     * progress.show([label])
     * progress.hide()
     */
    function Progress(options, appendTo) {
        options = options || {};
        if(typeof options === "string") {
            options = { label: options };
        } else if(options instanceof HTMLSpanElement) {
            options.label = options.outerHTML;
        }
        options.label = options.label || "Loading...";
        options.dim = options.dim || false;

        appendTo = appendTo || document.body;

        progressHolder = progressHolder || new Dialog({
            className: "progress-dialog" + optionalClassName(options.className),
            items: [
                { type: HTML.DIV, className: "progress-dialog-circle" },
                { type: HTML.DIV, className: "progress-dialog-title" }
            ]
        }, appendTo)
//        progress.show(options.label);
    }
    Progress.prototype.show = function(label) {
        progressHolder.items[1].innerHTML = label.innerHTML || label || "Loading...";
        progressHolder.open();
    };
    Progress.prototype.hide = function() {
        progressHolder.close();
    };


    /**
     * eventBus.register(file, options) or eventBus.register(files, options)
     * options = {
    *       context,
    *       onprogress: function((int) loadedFiles)
    *       validate: function() -> true|false
    *       onstart: function(),
    *       onsuccess: function(),
    *       onerror: function(code, origin, error)
    *   }
     * eventBus.fire(event, object)
     * eventBus.fire(callback)
     *
     * File can be presented as the path, ".js" will be added if not exists.
     * File will be added as a holder if it is based on eventBus.eventHolder or
     * it has following elements:
     *   type: String
     *   onEvent: function(event, object)
     *   start: function()
     */
    function EventBus() {
        this.events = window.EVENTS = window.EVENTS || {};

        // noinspection JSUnusedGlobalSymbols
        this.eventHolder = function() {
            return {
                onEvent:function(){console.warn("DEFINE onEvent(event, object)")},
//                start:function(){console.warn("DEFINE start()")},
                type:"DEFINE TYPE"
            }
        };

        var loaded = 0;
        this.origins = [];
        this.modules = [];
        this.holders = {};
        this.register = function(module, options) {
            if(module.constructor === Array) {
                for(var i in module) {
                    // noinspection JSUnfilteredForInLoop
                    self.eventBus.register(module[i], options);
                }
            } else {
                self.eventBus.origins.push(module);
                require(module, options.context).then(function(e) {
                    loaded++;
                    if(e && e.moduleName && e.type) {
//                        self.eventBus.holders[e.type.toLowerCase()] = e;
                        self.eventBus.holders[e.origin] = e;
                    }
                    if(options.onprogress) options.onprogress(loaded);

                    if(loaded === self.eventBus.origins.length) {
                        console.log("Preload finished: "+loaded+" files done.");

                        if(options.validate && !options.validate()) {
                            return;
                        }

                        if(options.modules) {
                            for(var i = 0; i < options.modules.length; i++) {
                                if(window[options.modules[i]]) {
                                    self.eventBus.modules.push(options.modules[i].toLowerCase().replace("holder",""));
                                    self.eventBus.holders[options.modules[i].toLowerCase().replace("holder","")] = new window[options.modules[i]](options.context);
                                }
                            }
                        } else if(self.eventBus.origins) {
                            for(i = 0; i < self.eventBus.origins.length; i++) {
                                var holder = self.eventBus.holders[self.eventBus.origins[i]];
                                if(holder && holder.type) {
                                    self.eventBus.modules.push(holder.type.toLowerCase());
                                    self.eventBus.holders[holder.type.toLowerCase()] = holder;
                                    delete self.eventBus.holders[holder.origin];
                                }
                            }
                        }
                        if(options.onstart) options.onstart(self.eventBus.modules);

                        for(i in self.eventBus.modules) {
                            if(self.eventBus.holders[self.eventBus.modules[i]].start) self.eventBus.holders[self.eventBus.modules[i]].start();
                        }

                        options.onsuccess();
                    }
                }).catch(function(code, e, error){
                    if(options.onerror) options.onerror(code, module, error);
                });
            }
        };

        // noinspection JSPotentiallyInvalidUsageOfThis
        this.fire = function(event, object) {
            if(!event) return;
            for(var i in self.eventBus.modules) {
                var module = self.eventBus.modules[i];
                if(self.eventBus.holders[module] && self.eventBus.holders[module].onEvent) {
                    try {
                        if(event.constructor === Function) {
                            var res = event.call(this, self.eventBus.holders[self.eventBus.modules[i]]);
                            if(res !== undefined && !res) break;
                        } else {
                            if (!self.eventBus.holders[module].onEvent.call(this, event, object)) break;
                        }
                    } catch(e) {
                        console.error(module, event, e);
                    }
                }
            }
        };

        // noinspection JSUnusedGlobalSymbols
        this.chain = function(callback) {
            for(var i in self.eventBus.modules) {
                try{
                    var res = callback(self.eventBus.holders[self.eventBus.modules[i]]);
                    if(res !== undefined && !res) break;
                } catch(e) {
                    console.error(self.eventBus.modules[i], e);
                }
            }
        }
    }

    /**
     * Menu
     */
    function Menu(options) {
        options = options || {};
        options.className = "menu" + optionalClassName(options.className);
        options.tabindex = -1;
        options.autoclose = true;

        //options._onopen = options.onopen;
        //options.onopen = function(evt) {
        //    console.log("MENU OPEN");
        //    if(options._onopen) options._onopen(evt);
        //};

        //options._onclose = options.onclose;
        //options.onclose = function(evt) {
        //    console.log("MENU CLOSE");
        //    if(options._onclose) options._onclose(evt);
        //};

        var items = options.items || [];
        options.items = [];
        var menu = new Dialog(options, document.body);

        menu._add = menu.add;
        menu.add = function(item) {
            item._onclick = item.onclick;
            item.onclick = function(evt) {
                if(this._onclick) this._onclick(evt);
                menu.close(HIDING.OPACITY)
            };
            item.oncontextmenu = function(e){e.stopPropagation(); e.preventDefault(); return false;};
            menu._add(item);
        };
        menu.addItems(items);

        menu._open = menu.open;
        menu.open = function(aroundNode) {
            menu._open(HIDING.SCALE_Y_BOTTOM);
            menu.style.top = (aroundNode.getBoundingClientRect().bottom + 5) + "px";
            menu.style.left = (aroundNode.getBoundingClientRect().right - menu.offsetWidth) + "px";
        };

        return menu;
    }

    function Tree(options, appendTo) {
        options = options || {};
        options.className = "tree" + optionalClassName(options.className);
        var items = options.items || [];
        var hideRoot = options.hideRoot;
        var expandedInitial = options.expanded;

        var root = new Leaf(options);
        root.raw = {};

        function Leaf(options) {
            options = options || {};
            var leafOptions = {};
            leafOptions.id = options.id;
            delete options.id;

            options.level = options.level || 0;
            if(hideRoot) options.level --;

            var hidden = !expandedInitial && options.level >= 0;
            var forced = load("tree:" + leafOptions.id);
            if(forced) {
                hidden = forced === 2;
            }

            leafOptions.className = "tree-item" + optionalClassName(options.className);
            if(hidden) leafOptions.className += " tree-item-collapsed";
            delete options.className;
            leafOptions.level = options.level;
            leafOptions.priority = options.priority;

            leafOptions.onclick = function(event) {
                event.stopPropagation();
                if(this.itemsNode.isHidden) {
                    this.open();
                } else {
                    this.close();
                }
            };
            var leaf = create(HTML.DIV, leafOptions);

            if(options.level >= 0) {
                var div = create(HTML.DIV, {className:"tree-item-title" + optionalClassName(options.titleClassName)}, leaf);
                for(var i = 0; i < options.level; i++) {
                    create(HTML.DIV, {className:"tree-item-indent"}, div);
                }
                delete options.level;
                leaf.iconNode = create(HTML.DIV, {
                    innerHTML: "",
                    className: "tree-item-leaf-icon icon notranslate"
                }, div);
                leaf.titleNode = create(HTML.DIV, options, div);
                leaf.titleNode.item = leaf;
            }

            leaf.itemsNode = create(HTML.DIV, {className:"tree-item-leaves" + (hidden ? " hidden" : "")}, leaf);

            leaf.add = function (options) {
                try {
                    if (options.id === undefined) {
                        console.error("Id for leaf is not defined", options);
                    }

                    var ids = [];
                    if (leaf.id) ids = leaf.id.split(":");
                    ids.push(options.id);
                    var oldId = options.id;
                    var id = ids.join(":");
                    options.id = id;

                    options.level = ids.length;
                    options.priority = options.priority || 0;
                    var subLeaf = new Leaf(options);

                    var added = false;
                    for(var i = 0; i < leaf.itemsNode.childNodes.length; i++) {
                        if((leaf.itemsNode.childNodes[i].priority || 0) < options.priority) {
                            leaf.itemsNode.insertBefore(subLeaf, leaf.itemsNode.childNodes[i]);
                            added = true;
                            break;
                        }
                    }
                    if(!added) {
                        leaf.itemsNode.appendChild(subLeaf);
                    }

                    if(leaf.iconNode) leaf.iconNode.innerHTML = "arrow_drop_down";

                    root.raw[id] = subLeaf;
                    leaf.items[oldId] = subLeaf;
                    return subLeaf;
                } catch(e) {
                    console.error(e);
                }
            };
            leaf.remove = function () {

            };
            leaf.open = function() {
                save("tree:" + this.id, 1);
                this.classList.remove("tree-item-collapsed");
                this.itemsNode.show();
            };
            leaf.close = function() {
                save("tree:" + this.id, 2);
                this.classList.add("tree-item-collapsed");
                if(this.level >= 0) {
                    this.itemsNode.hide();
                }
            };
            leaf.expand = function () {
                this.open();
                for(var i in this.items) {
                    this.items[i].expand();
                }
            };
            leaf.collapse = function () {
                this.close();
                for(var i in this.items) {
                    this.items[i].collapse();
                }
            };
            leaf.items = {};
            return leaf;
        }



        /*var tree = create(HTML.DIV, {
            add: function(leaf) {
                leaf = leaf || {};
                leaf.add = function(innerLeaf) {
                    innerLeaf = innerLeaf || {};
                    innerLeaf.id = leaf.id + ":" + innerLeaf.id;
                    return tree.add(innerLeaf);
                };

                var div = create(HTML.DIV, leaf);
                if(tree.raw[leaf.id]) {
                    console.warn("Tree leaf with id '" + leaf.id + "' already exists.");
                }
                tree.raw[leaf.id] = div;

                if(leaf.parent) {
                    tree.raw[leaf.parent].appendChild(div);
                } else {
                    tree.appendChild(div);
                }
                return div;
            }
        });*/
        if(appendTo) appendTo.appendChild(root);

        for(var i in items) {
            root.add(items[i])
        }
        return root;
    }

    function DataSource() {
        this.json = [];
        this.owner = null;
        this.add = function(item) {

        };
        this.getItem = function() {

        };
    }


    function optionalClassName(className) {
        return className ? " " + className : "";
    }

    this.HTML = HTML;
    // noinspection JSUnusedGlobalSymbols
    this.ERRORS = ERRORS;
    this.DRAWER = DRAWER;
    this.HIDING = HIDING;

    options = options || {};
    if(options.exportConstants) {
        window.HTML = HTML;
        window.ERRORS = ERRORS;
        window.DRAWER = DRAWER;
        window.HIDING = HIDING;
    }

    this.context = options.context || "";
    this.origin = options.origin || "edequate";

    this.actionBar = ActionBar;
    this.byId = byId;
    this.clear = clear;
    this.cloneAsObject = cloneAsObject;
    this.copyToClipboard = copyToClipboard;
    this.create = create;
    this.destroy = destroy;
    this.dialog = Dialog;
    this.drawer = Drawer;
    this.eventBus = new EventBus();
    this.fire = this.eventBus.fire;
    this.get = get;
    this.getJSON = getJSON;
    this.keys = keys;
    this.lang = Lang;
    this.load = load;
    this.loading = loading;
    this.loadForContext = loadForContext;
    this.menu = Menu;
    this.normalizeName = normalizeName;
    this.notification = notification;
    this.post = post;
    this.progress = new Progress();
    this.put = put;
    this.require = require;
    this.save = save;
    this.saveForContext = saveForContext;
    this.table = Table;
    this.toast = new Toast();
    this.tree = Tree;

}
(function() {
    var scripts = document.getElementsByTagName("script");
    var node = document.currentScript;
    if(!node) {
        for(var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute("src");
            if(src.match(/edequate\.js/i)) {
                node = scripts[i];
                break;
            }
        }
    }
    if(node) {
        window.addEventListener("load", function() {
            var data = node.dataset || {};
            var variable = data.variable || "edequate";
            var origin = data.origin;
            var context = data.context;
            // noinspection EqualityComparisonWithCoercionJS
            var exportConstants = data.exportConstants == "true";
            window[variable] = new Edequate({exportConstants:exportConstants, origin:origin, context:context});
            var callback = data.callback;
            if(callback) {
                try {
                    (new Function(callback))();
                } catch(e) {
                    console.error(e);
                }
            }
        })
    }
})();
