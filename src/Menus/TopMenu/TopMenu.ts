///<reference path="../../../lib/jquery.d.ts"/>
///<reference path="../../../lib/FileSaver.d.ts"/>
///<reference path="../../Model/Tree.ts"/>
///<reference path="../../Utils/TreeParser.ts"/>
///<reference path="../../View/ISetView.ts"/>
///<reference path="../../Controller/UserActionController.ts"/>


module GTE {
    export class TopMenu {
        userActionController: UserActionController;
        treeParser: TreeParser;

        newButton:JQuery;
        saveButton:JQuery;
        loadButton:JQuery;
        saveImageButton:JQuery;
        inputLoad:JQuery;

        playerPlusButton:JQuery;
        playerMinusButton:JQuery;
        playerNumber:JQuery;

        constructor(userActionController: UserActionController) {
            this.userActionController = userActionController;
            this.treeParser = new TreeParser();
            this.appendElements();
            setTimeout(() => {
                this.newButton = $("#new-wrapper");
                this.saveButton = $("#save-wrapper");
                this.loadButton = $("#load-wrapper");
                this.inputLoad = $("#input-load");
                this.saveImageButton =  $("#save-image-wrapper");
                this.playerNumber = $("#player-number");
                this.playerMinusButton = $("#minusP-wrapper");
                this.playerPlusButton = $("#plusP-wrapper");
                this.attachEvents();
            }, 300);

        }

        appendElements() {
            $.get("src/Menus/TopMenu/top-menu.html", function (data) {
                $('body').append(data);
            });

            let css = `<link rel="stylesheet" href="src/Menus/TopMenu/top-menu.css" type="text/css"/>`;
            $('head').append(css);
        }

        attachEvents() {
            this.newButton.on("click", () => {
                this.userActionController.treeController.deleteNodeHandler(this.userActionController.treeController.tree.root);
                this.userActionController.treeController.addNodeHandler(this.userActionController.treeController.treeView.nodes[0]);
            });
            this.saveButton.on("click", () => {
                let text = this.treeParser.stringify(this.userActionController.treeController.tree);
                let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
                saveAs(blob, GTE_DEFAULT_FILE_NAME + ".txt");
            });
            this.loadButton.on("click", () => {
                this.inputLoad.click();
            });

            this.inputLoad.on("change", (event) => {

                let input = event.target;

                let reader = new FileReader();
                reader.onload = () => {
                    let text = reader.result;
                    this.handleLoadedFile(text);
                };


                reader.readAsText((<any>input).files[0]);
            });

            this.saveImageButton.on("click",()=>{
                console.log("save-clicked");
                this.userActionController.treeController.game.world.getByName("hoverMenu").alpha = 0;
                setTimeout(()=>{let cnvs = $('#phaser-div').find('canvas');
                    (<any>cnvs[0]).toBlob(function(blob) {
                        saveAs(blob, GTE_DEFAULT_FILE_NAME+".png");
                    });
                    },100);
            });

            this.playerMinusButton.on("click",()=>{
                let playersCount = parseInt(this.playerNumber.html());
                if(playersCount>2){
                    this.userActionController.removeLastPlayerHandler();
                    this.playerNumber.html((playersCount-1).toString());
                }
                console.log(this.playerNumber);
            });

            this.playerPlusButton.on("click",()=>{
                let playersCount = parseInt(this.playerNumber.html());
                if(playersCount<4){
                    this.userActionController.treeController.addPlayer(playersCount+1);
                    this.playerNumber.html((playersCount+1).toString());
                }
            });

        }

        private handleLoadedFile(text: string) {
            console.log("handler");
            try {
                this.userActionController.treeController.deleteNodeHandler(this.userActionController.treeController.tree.root);
                this.userActionController.treeController.treeView.nodes[0].destroy();
                this.userActionController.treeController.treeView.iSets.forEach((iSet: ISetView) => {
                    iSet.destroy();
                });
                let tree = this.treeParser.parse(text);
                if (tree.nodes.length >= 3) {
                    this.userActionController.treeController.tree = tree;
                    this.userActionController.treeController.treeView = new TreeView(this.userActionController.treeController.game, this.userActionController.treeController.tree, this.userActionController.treeController.treeProperties);
                    this.userActionController.treeController.emptySelectedNodes();
                    this.userActionController.treeController.treeView.nodes.forEach(n => {
                        n.resetNodeDrawing();
                    });
                    this.userActionController.treeController.attachHandlersToNodes();
                    this.userActionController.treeController.treeView.iSets.forEach(iSetV => {
                        this.userActionController.treeController.attachHandlersToISet(iSetV);
                    });
                }
            }
            catch (err) {
                this.userActionController.treeController.errorPopUp.show("Error in reading file. ");
                this.userActionController.treeController.createInitialTree();
            }
        }
    }
}