///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../Model/ISet.ts"/>
module GTE {
    export class UserActionController {
        game: Phaser.Game;
        treeController: TreeController;
        backgroundInputSprite:Phaser.Sprite;

        constructor(game: Phaser.Game, treeController: TreeController) {
            this.game = game;
            this.treeController = treeController;
            this.createBackgroundForInputReset();
        }

        /**This sprite resets the input and node selection if someone clicks on a sprite which does not have input*/
        private createBackgroundForInputReset(){
            this.backgroundInputSprite = this.game.add.sprite(0,0,"");
            this.backgroundInputSprite.width = this.game.width;
            this.backgroundInputSprite.height = this.game.height;
            this.backgroundInputSprite.inputEnabled = true;
            this.backgroundInputSprite.sendToBack();
            this.backgroundInputSprite.events.onInputDown.add(()=>{
                if(!this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
                    this.deselectNodesHandler();
            });
        }
        /**A method for deselecting nodes.*/
        deselectNodesHandler() {
            if (this.treeController.selectedNodes.length>0) {
                this.treeController.selectedNodes.forEach(n => {
                    n.isSelected = false;
                    n.resetNodeDrawing();
                });
                this.treeController.emptySelectedNodes();
            }
        }
        /**A method for adding children to selected nodes (keyboard N).*/
        addNodesHandler(nodeV?:NodeView) {
            if(nodeV){
                this.treeController.addNodeHandler(nodeV);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(n => {
                    this.treeController.addNodeHandler(n);
                })
            }
        }

        /** A method for deleting nodes (keyboard DELETE).*/
        deleteNodeHandler(nodeV?:NodeView) {

            if(nodeV){
                this.treeController.deleteNodeHandler(nodeV.node);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(n => {
                    this.treeController.deleteNodeHandler(n.node);
                });
                // this.treeController.treeView.drawTree();
            }
            let deletedNodes = [];
            if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(n => {
                    if (n.node === null) {
                        deletedNodes.push(n);
                    }
                });
            }

            deletedNodes.forEach(n => {
                this.treeController.selectedNodes.splice(this.treeController.selectedNodes.indexOf(n), 1);
            });
            // this.treeController.treeView.drawTree();
        }
        /**A method for assigning players to nodes (keyboard 1,2,3,4)*/
        assignPlayerToNodeHandler(playerID: number, nodeV?:NodeView) {
            if(nodeV){
                this.treeController.assignPlayerToNode(playerID,nodeV);
                // this.treeController.undoRedoController.saveNewTree();
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach((n) => {
                    this.treeController.assignPlayerToNode(playerID, n);
                    // this.treeController.undoRedoController.saveNewTree();
                });
            }
        }
        /**A method for assigning chance player to a node (keyboard 0)*/
        assignChancePlayerToNodeHandler(n?:NodeView) {
            if(n){
                n.node.convertToChance(this.treeController.tree.players[0]);
                n.resetNodeDrawing();
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach((n) => {
                    n.node.convertToChance(this.treeController.tree.players[0]);
                    n.resetNodeDrawing();
                });
            }
        }
        /**A method for creating an iSet (keyboard I)*/
        createISetHandler() {
            if (this.treeController.selectedNodes.length > 1) {
                this.treeController.createISet();
            }
        }

        /**Remove iSetHandler*/
        removeISetHandler(iSet:ISet){
            this.treeController.removeISetHandler(iSet);
        }
        /**A method for assigning undo/redo functionality (keyboard ctrl/shift + Z)*/
        undoRedoHandler(undo: boolean) {
            this.treeController.undoRedoController.changeTreeInController(undo);
        }
    }
}
