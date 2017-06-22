///<reference path="../../../lib/jquery.d.ts"/>
///<reference path="../../Controller/TreeController.ts"/>
///<reference path="../../../lib/FileSaver.d.ts"/>
///<reference path="../../Model/Tree.ts"/>
///<reference path="../../Utils/TreeParser.ts"/>
///<reference path="../../View/ISetView.ts"/>


module GTE {
    export class TopMenu {
        treeController: TreeController;
        treeParser: TreeParser;

        constructor(treeController: TreeController) {
            this.treeController = treeController;
            this.treeParser = new TreeParser();
            this.appendElements();
            setTimeout(() => {
                this.attachEvents();
            }, 200);

        }

        appendElements() {
            $.get("src/Menus/TopMenu/top-menu.html", function (data) {
                $('body').append(data);
            });

            let css = `<link rel="stylesheet" href="src/Menus/TopMenu/top-menu.css" type="text/css"/>`;
            $('head').append(css);
        }

        attachEvents() {
            'use strict';
            $("#new-wrapper").on("click", () => {
                this.treeController.deleteNodeHandler(this.treeController.tree.root);
                this.treeController.addNodeHandler(this.treeController.treeView.nodes[0]);
            });
            $("#save-wrapper").on("click", () => {
                let text = this.treeParser.stringify(this.treeController.tree);
                let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
                saveAs(blob, GTE_DEFAULT_FILE_NAME + ".txt");
            });
            $("#load-wrapper").on("click", () => {
                $("#input-load").click();
            });

            $("#input-load").on("change", (event) => {

                let input = event.target;

                let reader = new FileReader();
                reader.onload = () => {
                    let text = reader.result;
                    this.handleLoadedFile(text);
                };


                reader.readAsText((<any>input).files[0]);
            });

            $("#save-image-wrapper").on("click",()=>{
                console.log("save-clicked");
                this.treeController.game.world.getByName("hoverMenu").alpha = 0;
                setTimeout(()=>{let cnvs = $('#phaser-div').find('canvas');
                    (<any>cnvs[0]).toBlob(function(blob) {
                        saveAs(blob, GTE_DEFAULT_FILE_NAME+".png");
                    });},100);

            });
        }

        private handleLoadedFile(text: string) {
            console.log("handler");
            try {
                this.treeController.deleteNodeHandler(this.treeController.tree.root);
                this.treeController.treeView.nodes[0].destroy();
                this.treeController.treeView.iSets.forEach((iSet: ISetView) => {
                    iSet.destroy();
                });
                let tree = this.treeParser.parse(text);
                if (tree.nodes.length >= 3) {
                    this.treeController.tree = tree;
                    this.treeController.treeView = new TreeView(this.treeController.game, this.treeController.tree, this.treeController.treeProperties);
                    this.treeController.emptySelectedNodes();
                    this.treeController.treeView.nodes.forEach(n => {
                        n.resetNodeDrawing();
                    });
                    this.treeController.attachHandlersToNodes();
                    this.treeController.treeView.iSets.forEach(iSetV => {
                        this.treeController.attachHandlersToISet(iSetV);
                    });
                }
            }
            catch (err) {
                this.treeController.errorPopUp.show("Error in reading file. ");
            }
        }
    }
}