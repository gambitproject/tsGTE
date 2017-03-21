///<reference path="../../lib/phaser.d.ts"/>
module GTE {
    export class UserActionController {
        game: Phaser.Game;
        treeController: TreeController;

        constructor(game: Phaser.Game, treeController: TreeController) {
            this.game = game;
            this.treeController = treeController;
        }

        /**A method for deselecting nodes. This method should not be here and will be moved to a new class.*/
        //TODO: Move to a new class (maybe a more abstract InputController which will have mouse and keyboard
        deselectNodesHandler() {
            if (this.treeController.selectedNodes.length>0) {
                this.treeController.selectedNodes.forEach(n => {
                    n.isSelected = false;
                    n.resetNodeDrawing();
                });
                this.treeController.selectedNodes = [];
            }
        }
        /**A method for adding children to selected nodes (keyboard N).*/
        addNodesHandler() {
            if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(n => {
                    n.inputHandler.dispatch(n, "inputDown");
                })
            }
        }
        /** A method for deleting nodes (keyboard DELETE).*/
        deleteNodeHandler() {
            if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(n => {
                    this.treeController.deleteNodeHandler(n.node);
                });
                this.treeController.treeView.drawTree();
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
            this.treeController.treeView.drawTree();
        }
        /**A method for assigning players to nodes (keyboard 1,2,3,4)*/
        assignPlayerToNodeHandler(playerID: number) {
            if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach((n) => {
                    this.treeController.assignPlayerToNode(playerID, n);
                    this.treeController.undoRedoController.saveNewTree();
                });
            }
        }
        /**A method for assigning chance player to a node (keyboard 0)*/
        assignChancePlayerToNodeHandler() {
            if (this.treeController.selectedNodes.length > 0) {
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
        /**A method for assigning undo/redo functionality (keyboard ctrl/shift + Z)*/
        undoRedoHandler(undo: boolean) {
            this.treeController.undoRedoController.changeTreeInController(undo);
        }
    }
}
