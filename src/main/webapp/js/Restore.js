/**
 * Edequate. Copyright (C) 2017-18 Edeqa <http://www.edeqa.com>
 *
 * Created 3/29/18.
 *
 * !!! IMPORTANT !!!
 * DO NOT EDIT THIS FILE
 * !!! IMPORTANT !!!
 */

function Restore(u) {
    var self = this;
    this.edequate = u;

    this.start = function(arguments) {
        self.arguments = arguments = arguments || {};

        var info = arguments.info;
        self.mainType = arguments.type || "main";
        self.eventBus = u.eventBus;

        var dialogRestore;

        self.selectLang = u.create(HTML.SELECT, { className: "actionbar-select-lang changeable", value: u.load("lang"), onchange: function() {
                var lang = (this.value || navigator.language).toLowerCase().slice(0,2);
                u.save("lang", lang);
                self.loadResources(self.mainType + ".json");
                self.holder.resume();
            }}, self.actionbar).place(HTML.OPTION, { name: u.lang.loading, value:"" });

        u.require({src:"/rest/locales",isJSON:true}).then(function(json){
            console.log("locales", json.message);
            u.clear(self.selectLang);
            var count = 1;
            self.selectLang.place(HTML.OPTION, { innerHTML: "Default", value: "en" });
            for(var x in json.message) {
                // noinspection JSUnfilteredForInLoop
                self.selectLang.place(HTML.OPTION, { innerHTML: json.message[x], value: x });
                if(u.load("lang") === x) self.selectLang.selectedIndex = count;
                count++;
            }
        });

        this.loadResources(function() {
            dialogRestore = dialogRestore || u.dialog({
                title: "Restore access",
                items: [
                    { type: HTML.INPUT, label: "Login or e-mail" }
                ],
                positive: {
                    label: u.lang.ok,
                    dismiss: false,
                    onclick: function(event) {
                        console.log("RESTORE");

                        var login = dialogRestore.items[0].value;
                        if(!login) {
                            u.toast.error("Login is not defined");
                            return;
                        }
                        u.getJSON("/admin/restore/password", {login:login}).then(function(json){
                            try {
                                u.toast.show(json.message);
                                dialogRestore.close();
                                document.getElementsByClassName("admin-splash-info")[0].innerHTML = json.message;
                                document.getElementsByClassName("admin-splash-buttons")[0].show();
                            } catch(e) {
                                console.error(error,e,xhr);
                            }

                        }).catch(function(error, xhr) {
                            try {
                                var message = JSON.parse(xhr.response).message;
                                u.toast.error(message);
                            } catch(e) {
                                console.error(error,e,xhr);
                            }
                        });

                    }
                },
                negative: {
                    label: u.lang.cancel,
                    onclick: function(event) {
                        window.location = "/admin/";
                    }
                }
            });
            dialogRestore.open();
            dialogRestore.focus();
        });
    };

    this.loadResources = function(callback) {
        var lang = (u.load("lang") || navigator.language).toLowerCase().slice(0,2);
        u.lang.overrideResources({
            resources: "/rest/resources",
            resource: ["common.json"],
            locale: lang,
            callback: callback
        });
    };
}