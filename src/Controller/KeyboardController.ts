/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
module GTE {
    /** A class for controlling the input of the application*/
    export class KeyboardController {
        game: Phaser.Game;
        // There is a reference to the tree controller, so that whenever a key is pressed we can call the corresponding method
        treeController: TreeController;
        shiftKey: Phaser.Key;
        controlKey:Phaser.Key;
        addNodesKey: Phaser.Key;
        playersKeys: Array<Phaser.Key>;
        assignChancePlayerKey: Phaser.Key;
        removeNodesKey: Phaser.Key;
        testButton: Phaser.Key;
        undoRedoButton:Phaser.Key;
        iSetKey:Phaser.Key;

        constructor(game: Phaser.Game, treeController: TreeController) {
            this.game = game;
            this.treeController = treeController;
            this.playersKeys = [];

            this.addKeys();
            this.deselectNodesHandler();
            this.addNodesHandler();
            this.deleteNodeHandler();
            this.assignPlayerToNodeHandler();
            this.assignChancePlayerToNodeHandler();
            this.createISetHandler();
            this.undoRedoHandler();
            this.testButtonHandler();
        }

        /**Assigning all keys to the corresponding properties in the class*/
        addKeys() {
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.controlKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.addNodesKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.assignChancePlayerKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
            this.removeNodesKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DELETE);
            this.iSetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
            this.testButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.undoRedoButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);

            let keys = [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR];
            keys.forEach(k => {
                this.playersKeys.push(this.game.input.keyboard.addKey(k));
            });
        }

        /**A method for deselecting nodes. This method should not be here and will be moved to a new class.*/
        //TODO: Move to a new class (maybe a more abstract InputController which will have mouse and keyboard handlers?)
        deselectNodesHandler() {
            this.game.input.onDown.add(() => {
                if (!this.shiftKey.isDown && this.treeController.selectedNodes.length > 0) {
                    this.treeController.selectedNodes.forEach(n => {
                        n.isSelected = false;
                        n.resetNodeDrawing();
                    });
                    this.treeController.selectedNodes = [];
                }
            });
        }

        /**A method for adding children to selected nodes, when the N key is pressed*/
        addNodesHandler() {
            this.addNodesKey.onDown.add(() => {
                if (this.treeController.selectedNodes.length > 0) {
                    this.treeController.selectedNodes.forEach(n => {
                        n.inputHandler.dispatch(n, "inputDown");
                    })
                }
            });
        }

        /** A method for deleting nodes, when DELETE key is pressed*/
        deleteNodeHandler(){
            this.removeNodesKey.onDown.add(()=>{
                if(this.treeController.selectedNodes.length>0){
                    this.treeController.selectedNodes.forEach(n=>{
                        this.treeController.deleteNodeHandler(n.node);
                    });
                    this.treeController.treeView.drawTree();
                }
                let deletedNodes = [];
                if(this.treeController.selectedNodes.length>0){
                    this.treeController.selectedNodes.forEach(n=>{
                       if(n.node===null){
                           deletedNodes.push(n);
                       }
                    });
                }

                deletedNodes.forEach(n=>{
                    this.treeController.selectedNodes.splice(this.treeController.selectedNodes.indexOf(n),1);
                });
                this.treeController.treeView.drawTree();
            });
        }

        /**A method for assigning players to nodes when one of the keys 1,2,3 or 4 is pressed*/
        assignPlayerToNodeHandler() {
            this.playersKeys.forEach((k) => {
                let playerID = this.playersKeys.indexOf(k) + 1;
                k.onDown.add(() => {
                    if (this.treeController.selectedNodes.length > 0) {
                        this.treeController.selectedNodes.forEach((n) => {
                           this.treeController.assignPlayerToNode(playerID,n);
                            this.treeController.undoRedoController.saveNewTree();
                        });
                    }
                });
            });
        }

        /**A method for assigning chance player to a node*/
        assignChancePlayerToNodeHandler() {
            this.assignChancePlayerKey.onDown.add(() => {
                if (this.treeController.selectedNodes.length > 0) {
                    this.treeController.selectedNodes.forEach((n) => {
                        n.node.convertToChance(this.treeController.tree.players[0]);
                        n.resetNodeDrawing();
                    });
                }
            });
        }

        /**A method for creating an iSet*/
        createISetHandler(){
            this.iSetKey.onDown.add(()=>{
               if(this.treeController.selectedNodes.length>1){
                   this.treeController.createISet();
               }
            });
        }

        /**A method for assigning undo/redo functionality*/
        undoRedoHandler(){
            this.undoRedoButton.onDown.add(()=>{
                if(this.controlKey.isDown && !this.shiftKey.isDown){
                    this.treeController.undoRedoController.changeTreeInController(true);
                }
                if(this.controlKey.isDown && this.shiftKey.isDown){
                    this.treeController.undoRedoController.changeTreeInController(false);
                }
            });
        }

        /**Spacebar is for testing purposes only for now*/
        testButtonHandler() {

        }
    }
}