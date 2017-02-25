/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="../View/TreeView.ts"/>
///<reference path="../View/TreeViewProperties.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/MoveView.ts"/>
///<reference path="../Utils/SelectionRectangle.ts"/>
///<reference path="../Utils/Constants.ts"/>
///<reference path="UndoRedoController.ts"/>
///<reference path="../Utils/ErrorPopUp.ts"/>
///<reference path="../View/ISetView.ts"/>
module GTE {
    /**A class which connects the TreeView and the Tree Model.
     * Depending on the level of abstraction, some properties can be moved to different classes*/
    export class TreeController {
        game: Phaser.Game;
        bmd: Phaser.BitmapData;
        tree: Tree;
        treeView: TreeView;
        treeProperties: TreeViewProperties;
        undoRedoController: UndoRedoController;
        selectionRectangle: SelectionRectangle;
        errorPopUp: ErrorPopUp;
        // Preview Nodes and Moves are used when hovering
        private previewNodes: Array<NodeView>;
        private previewMoves: Array<MoveView>;
        // An array used to list all nodes that need to be deleted
        private nodesToDelete: Array<Node>;
        selectedNodes: Array<NodeView>;


        constructor(game: Phaser.Game) {
            this.game = game;
            this.setCircleBitmapData(1);

            this.previewMoves = [];
            this.previewNodes = [];
            this.nodesToDelete = [];
            this.selectedNodes = [];
            this.selectionRectangle = new SelectionRectangle(this.game);
            this.createInitialTree();
            this.attachHandlersToNodes();
            this.undoRedoController = new UndoRedoController(this);
            this.errorPopUp = new ErrorPopUp(this.game);
        }

        /**A method which creates the initial 3-node tree in the scene*/
        createInitialTree() {
            this.tree = new Tree();
            this.tree.addNode();
            this.tree.addChildToNode(this.tree.nodes[0]);
            this.tree.addChildToNode(this.tree.nodes[0]);
            this.tree.addPlayer(new Player(0, "0", 0x000000));
            this.tree.addPlayer(new Player(1, "1", PLAYER_COLORS[0]));

            this.tree.addPlayer(new Player(2, "2", PLAYER_COLORS[1]));
            this.treeProperties = new TreeViewProperties(250, 1000);
            this.treeView = new TreeView(this.game, this.tree, this.treeProperties);
            this.treeView.nodes[0].label.text = "A";
            this.treeView.nodes[1].label.text = "B";

            this.treeView.nodes[2].label.text = "C";
        }

        /**The update method is built-into Phaser and is called 60 times a second.
         * It handles the selection of nodes, while holding the mouse button*/
        update() {
            if (this.game.input.activePointer.isDown) {
                this.treeView.nodes.forEach((n: NodeView) => {
                    if (this.selectionRectangle.overlap(n) && this.selectedNodes.indexOf(n) === -1) {
                        // n.setColor(NODE_SELECTED_COLOR);
                        n.isSelected = true;
                        n.resetNodeDrawing();
                        this.selectedNodes.push(n);
                    }
                    if (!this.selectionRectangle.overlap(n) && this.selectedNodes.indexOf(n) !== -1 && !this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {

                        n.isSelected = false;
                        n.resetNodeDrawing();
                        this.selectedNodes.splice(this.selectedNodes.indexOf(n), 1);
                    }
                });
            }
        }

        /**A method for creating the circle for the nodes.
         * This method will imitate the zoom-in/zoom-out functionality*/
        setCircleBitmapData(scale: number) {
            this.bmd = this.game.make.bitmapData(this.game.height * NODE_RADIUS * scale, this.game.height * NODE_RADIUS * scale, "node-circle", true);
            this.bmd.ctx.fillStyle = "#ffffff";
            this.bmd.ctx.beginPath();
            this.bmd.ctx.arc(this.bmd.width / 2, this.bmd.width / 2, this.bmd.width * 0.45, 0, Math.PI * 2);
            this.bmd.ctx.fill();
        }

        /**Attaching listeners, that will listen for specific actions from the user*/
        attachHandlersToNodes() {
            this.treeView.nodes.forEach(n => {
                this.attachHandlersToNode(n);
            });
        }

        /** The node specific method for attaching handlers*/
        private attachHandlersToNode(n: NodeView) {
            n.inputHandler.add(function () {
                let node = <NodeView>arguments[0];
                let handlerText = arguments[1];
                switch (handlerText) {
                    case "inputOver":
                        this.handleInputOver(node);
                        break;
                    case "inputOut":
                        this.handleInputOut(node);
                        break;
                    case "inputDown":
                        this.handleInputDown(node);
                        break;
                    default:
                        break;
                }
            }, this)
        }

        /**Handler for the signal HOVER*/
        private handleInputOver(nodeV: NodeView) {
            if (!this.game.input.activePointer.isDown) {
                nodeV.setColor(HOVER_COLOR);
                let horizontalDistance = this.treeProperties.initialLevelDistance / (2 * (nodeV.node.depth + 1));

                if (nodeV.node.children.length === 0) {
                    let nodeV1 = new NodeView(this.game, new Node());
                    let nodeV2 = new NodeView(this.game, new Node());
                    let move1 = new MoveView(this.game, nodeV, nodeV1);

                    let move2 = new MoveView(this.game, nodeV, nodeV2);

                    nodeV1.setPosition(nodeV.x - horizontalDistance / 2, nodeV.y + this.treeProperties.levelHeight / 2);
                    nodeV2.setPosition(nodeV.x + horizontalDistance / 2, nodeV.y + this.treeProperties.levelHeight / 2);
                    nodeV1.setColor(HOVER_CHILDREN_COLOR);
                    nodeV2.setColor(HOVER_CHILDREN_COLOR);

                    move1.updateMovePosition();
                    move2.updateMovePosition();
                    move1.tint = HOVER_CHILDREN_COLOR;
                    move2.tint = HOVER_CHILDREN_COLOR;

                    this.previewNodes.push(nodeV1);
                    this.previewNodes.push(nodeV2);
                    this.previewMoves.push(move1);
                    this.previewMoves.push(move2);
                }
                else {
                    let nodeV1 = new NodeView(this.game, new Node());
                    let move1 = new MoveView(this.game, nodeV, nodeV1);

                    nodeV1.setPosition(nodeV.x + horizontalDistance / 2, nodeV.y);
                    nodeV1.setColor(HOVER_CHILDREN_COLOR);
                    move1.updateMovePosition();
                    move1.tint = HOVER_CHILDREN_COLOR;
                    this.previewNodes.push(nodeV1);
                    this.previewMoves.push(move1);
                }
            }
        }

        /**Handler for the signal HOVER_OUT*/
        private handleInputOut(nodeV?: NodeView) {
            if (nodeV) {
                nodeV.resetNodeDrawing();
            }
            this.previewNodes.forEach(n => {
                n.destroy();
                n = null;
            });
            this.previewNodes = [];

            this.previewMoves.forEach(m => {
                m.destroy();
                m = null;
            });
            this.previewMoves = [];
        }

        /**Handler for the signal CLICK*/
        private handleInputDown(nodeV: NodeView) {
            this.handleInputOut();
            if (nodeV.node.children.length === 0) {
                let child1 = this.treeView.addChildToNode(nodeV);
                let child2 = this.treeView.addChildToNode(nodeV);
                this.attachHandlersToNode(child1);
                this.attachHandlersToNode(child2);
            }
            else {
                let child1 = this.treeView.addChildToNode(nodeV);
                this.attachHandlersToNode(child1);
            }
            this.undoRedoController.saveNewTree();
        }

        /** A method for assigning a player to a given node.*/
        assignPlayerToNode(playerID: number, n: NodeView) {
            if (playerID > this.tree.players.length - 1) {
                this.tree.addPlayer(new Player(playerID, playerID.toString(), PLAYER_COLORS[playerID - 1]));

            }
            n.node.convertToLabeled(this.tree.findPlayerById(playerID));
            n.resetNodeDrawing();
        }

        /**A method for deleting a node - 2 step deletion.*/
        deleteNodeHandler(node: Node) {
            if (this.tree.nodes.indexOf(node) === -1) {
                return;
            }
            if (node.children.length === 0 && node !== this.tree.root) {
                this.deleteNode(node);
            }
            else {
                this.nodesToDelete = [];
                this.getAllBranchChildren(node);
                this.nodesToDelete.pop();
                this.nodesToDelete.forEach(n => {
                    this.deleteNode(n);
                });
                this.nodesToDelete = [];
            }
        }

        /**Creates an iSet with the corresponding checks*/
        createISet() {
            let nodes = [];
            this.selectedNodes.forEach(n => {
                nodes.push(n.node);
            });
            //Check for errors
            try {
                this.tree.canCreateISet(nodes);
            }
            catch (err) {
                this.errorPopUp.show(err.message);
                return;
            }
            // Create a list of nodes to put into an iSet - create the union of all iSets
            let iSetNodes = [];
            this.selectedNodes.forEach((n) => {
                if (n.node.iSet) {
                    n.node.iSet.nodes.forEach(iNode => {
                        iSetNodes.push(iNode);
                    });
                    let iSetView = this.treeView.findISetView(n.node.iSet);
                    this.tree.removeISet(n.node.iSet);
                    this.treeView.removeISetView(iSetView);
                }
                else{
                    iSetNodes.push(n.node);
                }
            });

            this.tree.addISet(iSetNodes[0].owner,iSetNodes);
            this.treeView.drawTree();
            // this.treeView.createISet();
            console.log(this.tree.iSets[0]);
        }

        /**Get all children of a given node*/
        private getAllBranchChildren(node: Node) {
            node.children.forEach(c => {
                this.getAllBranchChildren(c);
            });
            this.nodesToDelete.push(node);
        }

        /**A method for deleting the node from the treeView and tree*/
        private deleteNode(node: Node) {
            this.treeView.removeNodeView(this.treeView.findNodeView(node));
            this.tree.removeNode(node);
        }
    }
}
