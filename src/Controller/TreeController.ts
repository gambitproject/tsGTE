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
///<reference path="../Utils/HoverMenuManager.ts"/>
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

        // An array used to list all nodes that need to be deleted
        private nodesToDelete: Array<Node>;
        selectedNodes: Array<NodeView>;
        hoverSignal:Phaser.Signal;

        constructor(game: Phaser.Game) {
            this.game = game;
            this.setCircleBitmapData(1);

            this.nodesToDelete = [];
            this.selectedNodes = [];
            this.selectionRectangle = new SelectionRectangle(this.game);
            this.createInitialTree();
            this.attachHandlersToNodes();
            this.undoRedoController = new UndoRedoController(this);
            this.errorPopUp = new ErrorPopUp(this.game);
            this.hoverSignal = new Phaser.Signal();
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
        /** Empties the selected nodes in a better way*/
        emptySelectedNodes(){
            while(this.selectedNodes.length!==0){
                this.selectedNodes.pop();
            }
        }

        /** The node specific method for attaching handlers*/
        private attachHandlersToNode(n: NodeView) {
            n.events.onInputOver.add(function(){
                let node = <NodeView>arguments[0];
                this.handleInputOverNode(node);
            },this);
            n.events.onInputDown.add(function(){
                let node = <NodeView>arguments[0];
                this.handleInputDownNode(node);
            },this);
            n.events.onInputOut.add(function(){
                let node = <NodeView>arguments[0];
                this.handleInputOutNode(node);
            },this);
        }

        /**The iSet specific method for attaching handlers*/
        private attachHandlersToISet(iSet:ISetView){
            iSet.events.onInputOver.add(function(){
               let iSet = <ISetView>arguments[0];
               this.handleInputOverISet(iSet);
            },this);
        }

        /**Handler for the signal HOVER on a Node*/
        private handleInputOverNode(nodeV: NodeView) {
            if (!this.game.input.activePointer.isDown && nodeV.node.iSet === null) {
                this.hoverSignal.dispatch(nodeV);
            }
        }

        /**Handler for the signal HOVER_OUT on a Node*/
        private handleInputOutNode(nodeV?: NodeView) {

        }

        /**Handler for the signal CLICK on a Node*/
        private handleInputDownNode(nodeV: NodeView) {
            if (!this.game.input.activePointer.isDown) {
                this.hoverSignal.dispatch(nodeV);
            }
        }

        /**Handler for the signal HOVER on an ISet*/
        private handleInputOverISet(iSetV:ISetView){
            if(!this.game.input.activePointer.isDown){
                this.hoverSignal.dispatch(iSetV);
            }
        }

        /**Adding child or children to a node*/
        addNodeHandler(nodeV:NodeView){
            this.handleInputOutNode(nodeV);
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

            this.resetTree();
        }

        /** A method for assigning a player to a given node.*/
        assignPlayerToNode(playerID: number, n: NodeView) {
            if (playerID > this.tree.players.length - 1) {
                this.tree.addPlayer(new Player(playerID, playerID.toString(), PLAYER_COLORS[playerID - 1]));

            }
            n.node.convertToLabeled(this.tree.findPlayerById(playerID));
            // If the node is in an iset, change the owner of the iSet to the new player
            if(n.node.iSet && n.node.iSet.nodes.length>1){
                n.node.iSet.changePlayer(n.node.owner);
                let iSetView = this.treeView.findISetView(n.node.iSet);
                iSetView.nodes.forEach(nv=>{
                    nv.resetNodeDrawing();
                });
                iSetView.tint = iSetView.iSet.player.color;
            }
            n.resetNodeDrawing();

            this.resetTree();
            // this.treeView.moves.forEach(m=>{
            //     m.updateLabelText();
            // });
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
                node.convertToDefault();
            }
            this.resetTree();
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
            let player = null;
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

                if(n.node.owner){
                    player = n.node.owner;
                }
            });

            this.tree.addISet(player,iSetNodes);
            this.resetTree();
        }

        /**A method for deleting an iSet*/
        removeISetHandler(iSet:ISet){
            this.tree.removeISet(iSet);
            this.treeView.removeISetView(this.treeView.findISetView(iSet));
        }

        /**A method for resetting the tree after each action on the tree*/
        private resetTree(){

            this.treeView.drawTree();
            this.undoRedoController.saveNewTree();

            this.treeView.iSets.forEach(iSetV=>{
                this.attachHandlersToISet(iSetV);
            });
        }

        /**Get all children of a given node*/
        private getAllBranchChildren(node: Node) {
            node.children.forEach(c => {
                this.getAllBranchChildren(c);
            });
            this.nodesToDelete.push(node);
        }

        /**A method for deleting a single! node from the treeView and tree*/
        private deleteNode(node: Node) {
            this.treeView.removeNodeView(this.treeView.findNodeView(node));
            this.tree.removeNode(node);
        }
    }
}
