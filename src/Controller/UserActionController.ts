///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../Model/ISet.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="../Utils/Constants.ts"/>
///<reference path="../Model/Node.ts"/>
module GTE {
    export class UserActionController {
        game: Phaser.Game;
        treeController: TreeController;
        backgroundInputSprite: Phaser.Sprite;
        cutSprite: Phaser.Sprite;
        cutInformationSet: ISetView;
        // Used for going to the next node on tab pressed
        private nodesBFSOrder: Array<Node>;

        constructor(game: Phaser.Game, treeController: TreeController) {
            this.game = game;
            this.treeController = treeController;
            this.nodesBFSOrder = [];
            this.createBackgroundForInputReset();
            this.createCutSprite();
        }

        /**This sprite is created for the cut functionality of an independent set*/
        private createCutSprite() {
            this.cutSprite = this.game.add.sprite(0, 0, "scissors");
            this.cutSprite.anchor.set(0.5, 0.5);
            this.cutSprite.alpha = 0;
            this.cutSprite.tint = CUT_SPRITE_TINT;
            this.cutSprite.width = this.game.height * ISET_LINE_WIDTH;
            this.cutSprite.height = this.game.height * ISET_LINE_WIDTH;
        }

        /**This sprite resets the input and node selection if someone clicks on a sprite which does not have input*/
        private createBackgroundForInputReset() {
            this.backgroundInputSprite = this.game.add.sprite(0, 0, "");
            this.backgroundInputSprite.width = this.game.width;
            this.backgroundInputSprite.height = this.game.height;
            this.backgroundInputSprite.inputEnabled = true;
            this.backgroundInputSprite.sendToBack();
            this.backgroundInputSprite.events.onInputDown.add(() => {
                if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
                    this.deselectNodesHandler();
            });
        }

        /**A method for deselecting nodes.*/
        deselectNodesHandler() {
            if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(n => {
                    n.isSelected = false;
                    n.resetNodeDrawing();
                });
                this.treeController.emptySelectedNodes();
            }
        }

        /**A method for adding children to selected nodes (keyboard N).*/
        addNodesHandler(nodeV?: NodeView) {
            if (nodeV) {
                this.treeController.addNodeHandler(nodeV);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(n => {
                    this.treeController.addNodeHandler(n);
                });
            }
            this.treeController.undoRedoController.saveNewTree();
        }

        /** A method for deleting nodes (keyboard DELETE).*/
        deleteNodeHandler(nodeV?: NodeView) {

            if (nodeV) {
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
            this.treeController.undoRedoController.saveNewTree();
        }

        /**A method for assigning players to nodes (keyboard 1,2,3,4)*/
        assignPlayerToNodeHandler(playerID: number, nodeV?: NodeView) {
            if (nodeV) {
                this.treeController.assignPlayerToNode(playerID, nodeV);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach((n) => {
                    this.treeController.assignPlayerToNode(playerID, n);
                });
            }
            this.treeController.undoRedoController.saveNewTree();
        }

        /**A method for assigning chance player to a node (keyboard 0)*/
        assignChancePlayerToNodeHandler(n?: NodeView) {
            if (n) {
                n.node.convertToChance(this.treeController.tree.players[0]);
                n.resetNodeDrawing();
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach((n) => {
                    n.node.convertToChance(this.treeController.tree.players[0]);
                    n.resetNodeDrawing();
                });
            }
            this.treeController.undoRedoController.saveNewTree();
        }

        /**A method for creating an iSet (keyboard I)*/
        createISetHandler() {
            if (this.treeController.selectedNodes.length > 1) {
                this.treeController.createISet(this.treeController.selectedNodes);
            }
            this.treeController.undoRedoController.saveNewTree();
        }

        /**Remove iSetHandler*/
        removeISetHandler(iSet: ISet) {
            this.treeController.removeISetHandler(iSet);
            this.treeController.undoRedoController.saveNewTree();
        }

        /**Removes and iSet by a given list of nodes*/
        removeISetsByNodesHandler(nodeV?: NodeView) {
            if (nodeV) {
                this.removeISetHandler(nodeV.node.iSet);
            }
            else {
                this.treeController.removeISetsByNodesHandler();
            }
            this.treeController.undoRedoController.saveNewTree();
        }

        /**A method for assigning undo/redo functionality (keyboard ctrl/shift + Z)*/
        undoRedoHandler(undo: boolean) {
            this.treeController.undoRedoController.changeTreeInController(undo);
        }

        /**Starts the "Cut" state for an Information set*/
        initiateCutSpriteHandler(iSetV: ISetView) {
            this.cutInformationSet = iSetV;
            this.cutSprite.bringToTop();
            this.deselectNodesHandler();
            this.game.add.tween(this.cutSprite).to({alpha: 1}, 300, Phaser.Easing.Default, true);
            this.game.input.keyboard.enabled = false;
            this.treeController.treeView.nodes.forEach(n => {
                n.inputEnabled = false;
            });
            this.treeController.treeView.iSets.forEach(iSet => {
                iSet.inputEnabled = false;
            });

            this.game.input.onDown.addOnce(() => {
                this.treeController.treeView.nodes.forEach(n => {
                    n.inputEnabled = true;
                });
                this.treeController.treeView.iSets.forEach(iSet => {
                    iSet.inputEnabled = true;
                });
                this.game.input.keyboard.enabled = true;
                this.cutSprite.alpha = 0;

                this.treeController.cutInformationSet(this.cutInformationSet, this.cutSprite.x, this.cutSprite.y);
                this.treeController.undoRedoController.saveNewTree();
            }, this);

        }

        /**Updates the position of the cut sprite once every frame, when the cut functionality is on*/
        updateCutSpriteHandler() {
            if (this.cutSprite.alpha > 0) {
                let mouseXPosition = this.game.input.mousePointer.x;
                let finalPosition = new Phaser.Point();
                let nodeWidth = this.cutInformationSet.nodes[0].width * 0.5;

                //Limit from the left for X coordinate
                if (mouseXPosition - nodeWidth < this.cutInformationSet.nodes[0].x) {
                    finalPosition.x = this.cutInformationSet.nodes[0].x + nodeWidth;
                }
                //Limit from the right for X coordinate
                else if (mouseXPosition + nodeWidth > this.cutInformationSet.nodes[this.cutInformationSet.nodes.length - 1].x) {
                    finalPosition.x = this.cutInformationSet.nodes[this.cutInformationSet.nodes.length - 1].x - nodeWidth;
                }
                // Or just follow the mouse (X coordinate)
                else {
                    finalPosition.x = mouseXPosition;
                }

                let closestLeftNodeIndex;

                // Find the two consecutive nodes where the sprite is
                for (let i = 0; i < this.cutInformationSet.nodes.length - 1; i++) {
                    if (finalPosition.x >= this.cutInformationSet.nodes[i].x && finalPosition.x <= this.cutInformationSet.nodes[i + 1].x) {
                        closestLeftNodeIndex = i;
                    }
                }

                // set the y difference to be proportional to the x difference
                let closestLeftNodePosition = this.cutInformationSet.nodes[closestLeftNodeIndex].position;
                let closestRightNodePosition = this.cutInformationSet.nodes[closestLeftNodeIndex + 1].position;
                let proportionInX = (finalPosition.x - closestLeftNodePosition.x) / (closestRightNodePosition.x - closestLeftNodePosition.x);
                // console.log(proportionInX);
                finalPosition.y = closestLeftNodePosition.y + proportionInX * (closestRightNodePosition.y - closestLeftNodePosition.y);

                this.cutSprite.position.x = finalPosition.x;
                this.cutSprite.position.y = finalPosition.y;

                finalPosition = null;
                mouseXPosition = null;
                nodeWidth = null;
            }
        }

        /**If the label input is active, go to the next label
         * If next is false, we go to the previous label*/
        activateLabel(next: boolean) {

            if (this.treeController.labelInput.active) {
                if (this.treeController.labelInput.shouldRecalculateOrder) {
                    this.nodesBFSOrder = this.treeController.tree.BFSOnTree();
                }
                // If we are currently looking at moves
                if (this.treeController.labelInput.currentlySelected instanceof MoveView) {
                    let index = this.nodesBFSOrder.indexOf((<MoveView>this.treeController.labelInput.currentlySelected).move.to);

                    // Calculate the next index in the BFS order to tab to. If it is the last node, go to the next after the root, i.e. index 1
                    let nextIndex;
                    if (next) {
                        nextIndex = this.nodesBFSOrder.length !== index + 1 ? index + 1 : 1;
                    }
                    else {
                        nextIndex = index === 1 ? this.nodesBFSOrder.length - 1 : index - 1;
                    }
                    // Activate the next move
                    let nextMove = this.treeController.treeView.findMoveView(this.nodesBFSOrder[nextIndex].parentMove);
                    nextMove.label.events.onInputDown.dispatch(nextMove.label);
                }
                // If we are currently looking at nodes
                else if (this.treeController.labelInput.currentlySelected instanceof NodeView) {
                    let index = this.nodesBFSOrder.indexOf((<NodeView>this.treeController.labelInput.currentlySelected).node);
                    let nextIndex = this.calculateNodeLabelIndex(next,index);
                    let nextNode = this.treeController.treeView.findNodeView(this.nodesBFSOrder[nextIndex]);
                    nextNode.label.events.onInputDown.dispatch(nextNode.label)
                }
            }
        }

        /**If the input field is on and we press enter, change the label*/
        changeLabel() {
            if (this.treeController.labelInput.active) {
                if (this.treeController.labelInput.currentlySelected instanceof MoveView) {
                    this.treeController.tree.changeMoveLabel((<MoveView>this.treeController.labelInput.currentlySelected).move, this.treeController.labelInput.inputField.val());
                    this.treeController.treeView.moves.forEach(m => {
                        m.updateLabel();
                    });
                    this.activateLabel(true);
                }
                else if (this.treeController.labelInput.currentlySelected instanceof NodeView) {
                    (<NodeView>this.treeController.labelInput.currentlySelected).node.owner.label = this.treeController.labelInput.inputField.val();
                    this.treeController.treeView.nodes.forEach((n: NodeView) => {
                        n.setLabelText();
                    });
                    this.activateLabel(true);
                }
            }
        }

        /**Hides then input*/
        hideInputLabel() {
            if (this.treeController.labelInput.active) {
                this.treeController.labelInput.hideLabel();
            }
        }

        /**A helper method which calculates the next possible index of a labeled node*/
        private calculateNodeLabelIndex(next: boolean, current: number) {
            let nodeIndex = current;
            if (next) {
                for (let i = current + 1; i < this.nodesBFSOrder.length; i++) {
                    if (this.nodesBFSOrder[i].owner && this.nodesBFSOrder[i].owner !== this.treeController.tree.players[0]) {
                        return i;
                    }
                }
                // If we have not found such an element in the next, keep search from the beginning
                for (let i = 0; i < current; i++) {
                    if (this.nodesBFSOrder[i].owner && this.nodesBFSOrder[i].owner !== this.treeController.tree.players[0]) {
                        return i;
                    }
                }
            }
            // If we want the previous
            else {
                for (let i = current-1; i >= 0; i--) {
                    if (this.nodesBFSOrder[i].owner && this.nodesBFSOrder[i].owner !== this.treeController.tree.players[0]) {
                        return i;
                    }
                }
                // If we have not found such an element in the next, keep search from the beginning
                if (nodeIndex === current) {
                    for (let i = this.nodesBFSOrder.length-1; i > current; i--) {
                        if (this.nodesBFSOrder[i].owner && this.nodesBFSOrder[i].owner !== this.treeController.tree.players[0]) {
                            return i;
                        }
                    }
                }
            }
            return current;
        }
    }
}
