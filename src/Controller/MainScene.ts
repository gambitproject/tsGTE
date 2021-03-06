/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="KeyboardController.ts"/>
///<reference path="UserActionController.ts"/>
///<reference path="../Menus/TopMenu/TopMenu.ts"/>
module GTE {
    /**A class for the main part of the software. This is the starting point of the core software*/
    export class MainScene extends Phaser.State {
        // The Tree Controller handles everything related to the tree
        treeController: TreeController;
        // User Action Controller handles actions from the user. These actions will be called whenever a keyboard key
        // or a button is pressed. Abstracts the logic of user actions and removes unnecessary code repetition.
        userActionController: UserActionController;
        // The Keyboard Controller handles input and sends signals and executes methods from the treeController
        keyboardController: KeyboardController;
        //The Hover Menu Manager handles the buttons and signals when hovering on a node or iset.
        hoverManager: HoverMenuController;
        // Top Menu with action buttons
        topMenu: TopMenu;
        //The label input field which appears when you click on a label
        labelInput: LabelInput;
        // For resizing the game
        resizeLocked: boolean;

        /** The create method is built-into the engine for every state. It acts as a constructor.*/
        create() {

            this.treeController = new TreeController(this.game);
            this.userActionController = new UserActionController(this.game, this.treeController);
            this.keyboardController = new KeyboardController(this.game, this.userActionController);
            this.hoverManager = new HoverMenuController(this.game, this.userActionController);
            this.topMenu = new TopMenu(this.userActionController);

            this.resizeLocked = false;
            this.gameResize();
        }

        private gameResize() {
            window.onresize = () => {
                if (!this.resizeLocked) {
                    this.resizeLocked = true;
                    this.game.time.events.add(100, () => {
                        let width = window.innerWidth * devicePixelRatio;
                        let height = window.innerHeight * devicePixelRatio;
                        if (width > 1920) {
                            width = 1920;
                            height = 1920 / window.innerWidth * window.innerHeight;
                        }
                        this.game.scale.setGameSize(width, height);
                        this.treeController.treeViewProperties = new TreeViewProperties(this.game.height * INITIAL_TREE_HEIGHT, this.game.width * INITIAL_TREE_WIDTH);
                        this.treeController.treeView.properties = this.treeController.treeViewProperties;
                        this.treeController.resetTree(true, false);
                        this.resizeLocked = false;
                    });
                }
            }
        }

        /** The update method is built-into the engine for every state. It executes at most 60 times a second*/
        update() {
            this.userActionController.update();
        }

        /** This is used for testing purposes - displays a text 60 times a second in the app*/
        render() {
            // this.game.debug.text(this.game.time.fps.toString(), 20,60, "#000000", "20px Arial");
            // this.game.debug.text(this.game.world.children.length.toString(), 20,20, "#ff0000", "20px Arial");
            // if(this.treeController) {
            //     this.game.debug.text("undoTrees: "+this.treeController.undoRedoController.treesList.length,20,80,"#000000","20px Arial");
            // this.game.debug.text("index: "+this.treeController.undoRedoController.currentTreeIndex,20,100,"#000000","20px Arial");
            // }
            // this.game.debug.text("w: "+this.game.width + " h: "+this.game.height, 20,80, "#000000", "20px Arial");
            // if(this.hoverManager){
            //     this.game.debug.text("selected in Hover: "+this.hoverManager.selectedNodesSprites.length.toString(), 20,60, "#000000", "20px Arial");
            // }

            // if(this.userActionController){
            //     this.game.debug.text("cut x: "+this.userActionController.cutSprite.position.x+"    cut y: "+this.userActionController.cutSprite.position.y, 20,60, "#000000", "20px Arial");
            // }
            // if(this.treeController && this.treeController.treeView && this.treeController.treeView){
            //     this.treeController.treeView.nodes.forEach(n=>{
            //         if(n.payoffsLabel) {
            //             this.game.debug.spriteBounds(n.payoffsLabel,"#ff0000",false);
            //         }
            //     });
            // }
            // if(this.userActionController && this.userActionController.strategicFormView){
            //     this.userActionController.strategicFormView.cells.forEach(c=>{
            //         if(c.p1Text && c.p2Text) {
            //             this.game.debug.spriteBounds(c.p1Text,"#ff0000",false);
            //             this.game.debug.spriteBounds(c.p2Text,"#ff0000",false);
            //         }
            //     });
            // }
            // if(this.treeController.treeView.iSets){
            //     this.game.debug.text(this.treeController.tree.iSets.length+" "+this.treeController.treeView.iSets.length, 20,40, "#ff0000", "20px Arial");
            // this.treeController.treeView.iSets.forEach(i=>{
            //    this.game.debug.spriteBounds(i.label,"#00ff00",false);
            //    this.game.debug.spriteBounds(i.ownerLabel,"#ff0000",false);
            // });
            // }
            // if(this.userActionController.undoRedoController){
            //     this.game.debug.text(this.userActionController.undoRedoController.treesList.length+" "+this.userActionController.undoRedoController.treeCoordinatesList.length, 20,40, "#ff0000", "20px Arial");
            //
            // }
            // if(this.treeController.treeView && this.treeController.treeView.treeTweenManager){
            //     this.game.debug.text("n: "+this.treeController.treeView.nodes.length + " o: "+this.treeController.treeView.treeTweenManager.oldCoordinates.length, 20,40, "#ff0000", "20px Arial");
            // }

        }
    }
}