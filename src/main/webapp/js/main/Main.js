/**
 * Part of Edeqa <http://www.edeqa.com>
 * Copyright (C) 2017-18 Edeqa
 *
 * Created 12/27/17.
 *
 * !!! IMPORTANT !!!
 * DO NOT EDIT THIS FILE
 * !!! IMPORTANT !!!
 */

function Main(u) {
    var self = this;
    this.start = function(info) {
        self.layout = u.create(HTML.DIV, {className:"layout"}, document.body);
        self.actionbar = u.actionBar({
            title: "Loading...",
            onbuttonclick: function(){
                try {
                    self.drawer.open();
                } catch(e) {
                    console.error(e);
                }
            }
        }, document.body);

        self.selectLang = u.create(HTML.SELECT, { className: "actionbar-select-lang changeable", onchange: function(e, event) {
            var lang = (this.value || navigator.language).toLowerCase().slice(0,2);
            u.save("lang", lang);
            //loadResources("index.json");
            //u.fire.call(EVENTS.RELOAD, type);
        }}, self.actionbar).place(HTML.OPTION, { name: u.lang.loading, value:"" });

        //u.post("/rest/v1/getContent", {resource: "index-contact.html", locale: lang}).then(function(xhr){
        u.getJSON("/rest/v1/locales").then(function(json){
            console.log("locales", json.message);
            u.clear(self.selectLang);
            var count = 1;
            self.selectLang.place(HTML.OPTION, { innerHTML: "Default", value: "en" });
            for(var x in json.message) {
                self.selectLang.place(HTML.OPTION, { innerHTML: json.message[x], value: x });
                if(u.load("lang") === x) self.selectLang.selectedIndex = count;
                count++;
            }
        });

        u.getJSON("/rest/v1/content", {locale: "en", resource: "options-index.json"}).then(function(options){
            console.log("Options",options)

            self.drawer = new u.drawer({
                title: options.title || "Title",
                collapsed: u.load("drawer:collapsed"),
                logo: {
                    src: "/images/logo.svg"
                },
                onprimaryclick: function(){
                    console.log("onprimaryclick");
                },
                footer: {
                    className: "drawer-footer-label",
                    content: [
                        u.create(HTML.DIV, { className: "drawer-footer-link", innerHTML: options.copyright}),
                        u.create(HTML.DIV, { className: "drawer-footer-link", innerHTML: options.copyright, onclick: function(e){
                            //dialogAbout.open();
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }})
                    ]
                },
                sections: options.drawer
            }, document.body);

            u.getJSON("/rest/v1/holders").then(function(json){
                console.log("holders", json);
                for(var i in json.message) {
                    json.message[i] = json.message[i].replace(".js","");
                }
                u.eventBus.register(json.message, {
                    context: self,
                    onprogress: function (loaded) {
                        u.byId("loading-dialog-progress").innerHTML = Math.ceil(loaded / json.message.length * 100) + "%";
                    },
                    onstart: function () {
                        console.log(u.eventBus.holders)
                    },
                    onsuccess: function () {
                        for(var x in u.eventBus.holders) {
                            var holder = u.eventBus.holders[x];
                            if(holder.menu) {
                                self.drawer.add(holder.category, holder.type, holder.menu, holder.icon, function(){
                                    u.progress.show("Loading...");
                                    self.drawer.toggleSize(false);
                                    self.actionbar.toggleSize(false);
                                    self.actionbar.setTitle(this.title);

                                    self.content.scrollTop = 0;
                                    u.progress.hide();
                                    window.history.pushState({}, null, "/main/" + this.type);

                                    self.drawer.close();
                                    if(this.resume) {
                                        this.resume();
                                    }
                                    return false;
                                }.bind(holder));
                            }
                        }

                        if(info) {
                            self.content.innerHTML = info;
                            self.content.classList.add("content-info");
                            u.byId("loading-dialog").hide();
                        } else {
                            u.post("/rest/v1/content", {resource: "index-home.html"}).then(function(xhr){
                                self.content.innerHTML = xhr.response;
                                self.content.classList.add("content-home");

                                u.byId("loading-dialog").hide();

                            }).catch(function(error, json) {
                                self.content.innerHTML = "Error";
                                self.content.classList.add("content-error");

                                u.byId("loading-dialog").hide();
                            });
                        }

                    },
                    onerror: function (code, origin, error) {
                        console.error(code, origin, error);
                    }
                });
            });


            var switchFullDrawer = function(){
                if(self.content.scrollTop) {
                    self.drawer.toggleSize(true);
                    self.actionbar.toggleSize(true);
                    self.buttonScrollTop.show(HIDING.OPACITY);
                    clearTimeout(self.buttonScrollTop.hideTimeout);
                    self.buttonScrollTop.hideTimeout = setTimeout(function(){
                        self.buttonScrollTop.hide(HIDING.OPACITY);
                    }, 1500);
                } else {
                    self.drawer.toggleSize(false);
                    self.actionbar.toggleSize(false);
                    self.buttonScrollTop.hide(HIDING.OPACITY);
                }
            };
            self.content = u.create(HTML.DIV, {className:"content", onwheel: switchFullDrawer, ontouchmove: switchFullDrawer}, self.layout);


            self.buttonScrollTop = u.create(HTML.BUTTON, {
                className: "icon button-scroll-top changeable hidden",
                onclick: function() {
                    self.content.scrollTop = 0;
    //                self.content.scrollIntoView({block:"start", behaviour: "smooth"});
                    switchFullDrawer.call(self.content);
                },
                innerHTML: "keyboard_arrow_up"
            }, self.layout);
        });



    };

}