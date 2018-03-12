/**
 * Part of Waytous <http://waytous.net>
 * Copyright (C) Edeqa LLC <http://www.edeqa.com>
 *
 * Created 3/8/17.
 */
function PagesManagerHolder(main) {
    var div;

    this.category = DRAWER.SECTION_RESOURCES;
    this.type = "pages";
    this.title = "Pages";
    this.menu = "Pages";
    this.icon = "mode_edit";

    var sectionsNames = {
        "0": "Primary",
        "1": "Summary",
        "2": "Main",
        "3": "Explore",
        "4": "Share",
        "5": "Resources",
        "6": "Miscellaneous",
        "7": "Settings",
        "8": "Help",
        "9": "Last"
    };

    this.start = function() {
        div = main.content;
    };

    this.resume = function() {
        u.clear(div);
        var titleNode = u.create(HTML.H2, "Structure", div);

        var tree = new u.tree({hideRoot:true, expanded:true});
        div.appendChild(tree);

        u.create(HTML.BUTTON, { className:"icon button-inline", innerHTML: "add", title:"Add page", onclick: function(){
                console.log("add");
                main.turn("page", ["add"]);
            }}, titleNode);
        u.create(HTML.BUTTON, { className:"icon button-inline", innerHTML: "expand_more", title:"Expand all", onclick: function(){
                tree.expand();
            }}, titleNode);
        u.create(HTML.BUTTON, { className:"icon button-inline", innerHTML: "expand_less", title:"Collapse all", onclick: function(){
                tree.collapse();
            }}, titleNode);


        u.getJSON("/rest/data/types").then(function(json){
            console.log(json.message);

            for(var i in json.message) {
                var ids = json.message[i].split(/[\-.]/);
                if(ids && ids[0] === "pages") {
                    var branch = tree.add({
                        id: ids[1],
                        titleClassName: "tree-pages-item-title",
                        content: u.create(HTML.DIV, {className:"tree-pages-root"})
                            .place(HTML.DIV, {innerHTML:ids[1].toUpperCaseFirst()})
                            .place(HTML.BUTTON, {
                                innerHTML:"add",
                                title: "Add page into section",
                                className:"icon tree-pages-item-icon",
                                onclick: function (e) {
                                    e.stopPropagation();
                                    console.log("add page to", this.parentNode.item.id);
                                    main.turn("page", ["add",this.parentNode.item.id]);
                                }
                            })
                            .place(HTML.BUTTON, {
                                innerHTML:"expand_more",
                                title: "Expand all",
                                className:"icon tree-pages-item-icon",
                                onclick: function (e) {
                                    e.stopPropagation();
                                    this.parentNode.item.expand();
                                }
                            })
                            .place(HTML.BUTTON, {
                                innerHTML:"expand_less",
                                title: "Collapse all",
                                className:"icon tree-pages-item-icon",
                                onclick: function (e) {
                                    e.stopPropagation();
                                    this.parentNode.item.collapse();
                                }
                            })
                    });
                    u.getJSON("/rest/data", {resource: "pages-" + ids[1] + ".json"}).then(function(json){
                        var structure = parsePages(json);
                        for(var x in structure) {
                            var category = this.items[x] || this.add({
                                id: x,
                                priority: -(+x),
                                content: u.create(HTML.DIV, {className:"tree-pages-category"})
                                    .place(HTML.DIV, {innerHTML:sectionsNames[x]})
                                    .place(HTML.BUTTON, {
                                        innerHTML:"add",
                                        title: "Add page into section",
                                        className:"icon tree-pages-item-icon",
                                        onclick: function (e) {
                                            e.stopPropagation();
                                            console.log("add page to", this.parentNode.item.id);
                                            main.turn("page", ["add",this.parentNode.item.id]);
                                        }
                                    })
                            });
                            for(var y in structure[x]) {
                                var values = structure[x][y];
                                category.add({
                                    id: values.type,
                                    priority: values.priority,
                                    content: u.create(HTML.DIV, {className:"tree-pages-item-leaf"})
                                        .place(HTML.DIV, {
                                            innerHTML:values.title
                                        })
                                        .place(HTML.A, {
                                            innerHTML:"link",
                                            className: "icon tree-pages-item-icon",
                                            href:"/" + this.id + "/" + values.type,
                                            target:"_blank"
                                        })
                                        .place(HTML.BUTTON, {
                                            innerHTML:"edit",
                                            title: "Edit page",
                                            className:"icon tree-pages-item-icon",
                                            onclick: function (e) {
                                                e.stopPropagation();
                                                console.log("edit page", this.parentNode.item.id);
                                                main.turn("page", ["edit",this.parentNode.item.id]);
                                            }
                                        })
                                });
                            }
                        }
                    }.bind(branch)).catch(function(e,x){
                        console.error(e,x);
                    });
                    u.getJSON("/rest/" + ids[1]).then(function(json){
                        for(var i in json.message) {
                            u.require(json.extra + "/" + json.message[i].replace(".js", "")).then(function(holder) {
                                var category = holder && holder.category;
                                if(category !== undefined && "menu" in holder) {
                                    category = this.items[""+category] || this.add({
                                        id: ""+category,
                                        priority: -category,
                                        content: u.create(HTML.DIV, {className:"tree-pages-category"})
                                            .place(HTML.DIV, {innerHTML:sectionsNames[holder.category]})
                                            .place(HTML.BUTTON, {
                                                innerHTML:"add",
                                                className:"icon tree-pages-item-icon",
                                                onclick: function (e) {
                                                    e.stopPropagation();
                                                    console.log("add page to", this.parentNode.item.id);
                                                    main.turn("page", ["add",this.parentNode.item.id]);
                                                }
                                            })
                                    });
                                    category.add({
                                        id: holder.type,
                                        priority: holder.priority,
                                        content: u.create(HTML.DIV, {className:"tree-pages-item-leaf"})
                                            .place(HTML.DIV, {
                                                innerHTML:holder.title || holder.moduleName
                                            })
                                            .place(HTML.A, {
                                                innerHTML:"link",
                                                className: "icon tree-pages-item-icon",
                                                href:"/" + this.id + "/" + holder.type,
                                                target:"_blank"
                                            })
                                    });
                                }

                            }.bind(this))
                        }
                    }.bind(branch)).catch(function(e,x){
                        console.error(e,x);
                    });
                }

            }

        }).catch(function(e,x){
            console.error(e,x);
        });
    };

    function parsePages(pages, structure) {
        structure = structure || {"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{},"8":{},"9":{}};
        try {
            if (!pages) return;
            if (pages.constructor === Object) {
                if (pages.menu) {
                    structure[pages.category] = structure[pages.category] || {};
                    if(!structure[pages.category][pages.type]) {
                        structure[pages.category][pages.type] = pages;
                    }
                }
            } else if (pages.constructor === Array) {
                for (var i in pages) {
                    parsePages(pages[i], structure);
                }
            }
        } catch(e) {
            console.error(e);
        }
        return structure;
    }
}