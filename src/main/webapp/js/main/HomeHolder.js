/**
 * Copyright (C) Edeqa <http://www.edeqa.com>
 *
 * Created 12/28/17.
 */

function HomeHolder(main) {
    var u = main.edequate;

    this.category = DRAWER.SECTION_PRIMARY;
    this.type = "home";
    this.title = u.lang.home;
    this.menu = u.lang.home;
    this.icon = "home";
    this.priority = 10;

    this.start = function() {
        console.log("Starting HomeHolder");
    };

    this.resume = function() {
        console.log("Resuming HomeHolder");
        u.progress.show(u.lang.loading);
        this.title = u.lang.home;
        this.menu = u.lang.home;
        u.clear(main.content);
        u.post("/rest/content", {resource: "main-home.html", locale: main.selectLang.value}).then(function(xhr){
            u.create(HTML.DIV, {className: "content-normal", innerHTML: xhr.response}, main.content);
            u.progress.hide();
        }).catch(function(error, json) {
            console.error(json);
            u.create(HTML.DIV, {className: "content-centered", innerHTML: u.lang.error}, main.content);
            u.progress.hide();
        });
    }
}