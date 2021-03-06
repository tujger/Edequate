/**
 * Copyright (C) Edeqa <http://www.edeqa.com>
 *
 * Created 1/19/18.
 */
function LogoutHolder(main) {
    var u = main.edequate;

    this.category = DRAWER.SECTION_LAST;
    this.type = "logout";
    this.title = "Log out";
    this.menu = "Log out";
    this.icon = "exit_to_app";
    this.preventState = true;
    this.preventHistory = true;

    this.start = function() {
    };

    this.resume = function() {
        u.clear(document.body);
        u.create(HTML.DIV, {
            className: "admin-splash-layout"
        }, document.body).place(HTML.IMG, {
            className: "admin-splash-logo",
            src: "/images/logo.svg"
        }).place(HTML.SPAN, {
            className: "admin-splash-title",
            innerHTML: "${APP_NAME}"
        }).place(HTML.SPAN, {
            className: "admin-splash-subtitle",
            innerHTML: "Admin"
        });

        window.history.pushState({}, null, "/admin/home");

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/admin", true);
        xhr.setRequestHeader("Authorization", "Digest logout");
        xhr.send();
        setTimeout(function () {
            window.location.reload();
        }, 1);
    }
}
