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

    var dialogRequest;
    var dialogReset;

    this.start = function(arguments) {
        self.arguments = arguments = arguments || {};

        var info = arguments.info;
        self.mainType = arguments.type || "main";
        self.eventBus = u.eventBus;


        self.selectLang = u.create(HTML.SELECT, { className: "actionbar-select-lang changeable", value: u.load("lang"), onchange: function() {
                var lang = (this.value || navigator.language).toLowerCase().slice(0,2);
                u.save("lang", lang);
                self.loadResources(self.mainType + ".json");
                self.holder.resume();
            }}, self.actionbar).place(HTML.OPTION, { name: u.lang.loading, value:"" });

        u.require({src:"/rest/locales",isJSON:true}).then(function(json){
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

        u.progress.show("Wait...");
        this.loadResources(function() {

            var url = new URL(window.location.href);
            window.history.pushState({}, null, url.path);

            var options = (url.search || "").split("&");
            for(var i in options) {
                var x = options[i].split("=", 2);
                if(x.length > 1 && x[0] === "request") {
                    u.getJSON("/admin/restore/password", {token:x[1]}).then(function(json) {
                        u.progress.hide();
                        showResetDialog(json.message);
                    }).catch(function(error, xhr) {
                        u.progress.hide();
                        var info = "Failed";
                        try {
                            info = JSON.parse(xhr.response).message;
                        } catch(e) {
                            console.error(error,e,xhr);
                        }
                        u.toast.error(info);
                        document.getElementsByClassName("admin-splash-info")[0].innerHTML = info;
                        document.getElementsByClassName("admin-splash-buttons")[0].show();
                    });
                    return;
                }
            }
            u.progress.hide();
            showRequestDialog();
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

    function showRequestDialog() {
        dialogRequest = dialogRequest || u.dialog({
            title: "Restore access",
            items: [
                { type: HTML.INPUT, label: "Login or e-mail" }
            ],
            positive: {
                label: u.lang.ok,
                dismiss: false,
                onclick: function(event) {
                    var login = dialogRequest.items[0].value;
                    if(!login) {
                        u.toast.error("Login is not defined");
                        return;
                    }

                    u.progress.show("Wait...");
                    u.getJSON("/admin/restore/password", {login:login}).then(function(json){
                        u.progress.hide();
                        try {
                            var info = "Reset link has been sent to %s's email. It will be valid only %d minutes.<br><a href=\"%s\">%s</a>".sprintf(login, json.message.timeout / 1000 / 60, json.message.link, json.message.link);
                            u.toast.show(info);
                            dialogRequest.close();
                            document.getElementsByClassName("admin-splash-info")[0].innerHTML = info;
                            document.getElementsByClassName("admin-splash-buttons")[0].show();
                        } catch(e) {
                            console.error(error,e,xhr);
                        }

                    }).catch(function(error, xhr) {
                        u.progress.hide();
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
        dialogRequest.open();
        dialogRequest.focus();
        dialogRequest.items[0].focus();
    }

    function showResetDialog(options) {
        dialogReset = dialogReset || u.dialog({
            title: "Reset password",
            items: [
                { type: HTML.PASSWORD, label: "New password", onkeyup: function() {
                        var width = (12 - passwordNode.value.length) / 12. * 100;
                        if(width < 0) width = 0;
                        strengthNode.firstChild.style.width = width + "%";
                    }},
                {type: HTML.DIV, className: "dialog-progress-bar admin-edit-dialog-strength", innerHTML: u.create(HTML.DIV, {className:"dialog-progress-value"})},
                { type: HTML.PASSWORD, label: "Confirm password" }
            ],
            positive: {
                label: u.lang.ok,
                dismiss: false,
                onclick: function(event) {

                    if(!passwordNode.value) {
                        u.toast.error("Password not defined");
                        passwordNode.focus();
                        return;
                    }
                    if(passwordNode.value.length > 0 && passwordNode.value.length < 6) {
                        u.toast.error("Password too short");
                        passwordNode.focus();
                        return;
                    }
                    if(passwordNode.value !== confirmPasswordNode.value) {
                        u.toast.error("Password not confirmed");
                        confirmPasswordNode.focus();
                        return;
                    }

                    dialogReset.close();
                    u.progress.show("Wait...");
                    u.getJSON("/admin/restore/password", {nonce: options.nonce, password:dialogReset.items[0].value}).then(function(json){
                        u.progress.hide();
                        u.toast.show("Password has been updated");
                        window.location = "/admin/";
                    }).catch(function(error, xhr) {
                        u.progress.hide();
                        try {
                            var info = JSON.parse(xhr.response).message;
                            u.toast.error(info);
                            document.getElementsByClassName("admin-splash-info")[0].innerHTML = info;
                        } catch(e) {
                            document.getElementsByClassName("admin-splash-info")[0].innerHTML = "Failed";
                        }
                            console.error(error,xhr);
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
        var passwordNode = dialogReset.items[0];
        var strengthNode = dialogReset.items[1];
        var confirmPasswordNode = dialogReset.items[2];
        dialogReset.open();
        dialogReset.focus();
        dialogReset.items[0].focus();
    }
}