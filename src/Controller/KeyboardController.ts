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
        nKey: Phaser.Key;
        numberKeys: Array<Phaser.Key>;
        zeroKey: Phaser.Key;
        deleteKey: Phaser.Key;
        testButton: Phaser.Key;


        constructor(game: Phaser.Game, treeController: TreeController) {
            this.game = game;
            this.treeController = treeController;
            this.numberKeys = [];

            this.addKeys();
            this.deselectNodesHandler();
            this.addNodesHandler();
            this.deleteNodeHandler();
            this.assignPlayerToNodeHandler();
            this.assignChancePlayerToNodeHandler();
            this.testButtonHandler();
        }

        /**Assigning all keys to the corresponding properties in the class*/
        addKeys() {
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.zeroKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
            this.deleteKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DELETE);
            this.testButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            let keys = [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR];
            keys.forEach(k => {
                this.numberKeys.push(this.game.input.keyboard.addKey(k));
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
            this.nKey.onDown.add(() => {
                if (this.treeController.selectedNodes.length > 0) {
                    this.treeController.selectedNodes.forEach(n => {
                        n.inputHandler.dispatch(n, "inputDown");
                    })
                }
            });
        }

        /** A method for deleting nodes, when DELETE key is pressed*/
        deleteNodeHandler(){
            this.deleteKey.onDown.add(()=>{
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
            });
        }

        /**A method for assigning players to nodes when one of the keys 1,2,3 or 4 is pressed*/
        assignPlayerToNodeHandler() {
            this.numberKeys.forEach((k) => {
                let playerID = this.numberKeys.indexOf(k) + 1;
                k.onDown.add(() => {
                    if (this.treeController.selectedNodes.length > 0) {
                        this.treeController.selectedNodes.forEach((n) => {
                           this.treeController.assignPlayerToNode(playerID,n);
                        });
                    }
                });
            });
        }

        /**A method for assigning chance player to a node*/
        assignChancePlayerToNodeHandler() {
            this.zeroKey.onDown.add(() => {
                if (this.treeController.selectedNodes.length > 0) {
                    this.treeController.selectedNodes.forEach((n) => {
                        n.node.convertToChance(this.treeController.tree.players[0]);
                        n.resetNodeDrawing();
                    });
                }
            });
        }

        /**Spacebar is for testing purposes only for now*/
        testButtonHandler() {

        }
    }
}