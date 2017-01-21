/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="TreeViewProperties.ts"/>
///<reference path="NodeView.ts"/>
///<reference path="MoveView.ts"/>
///<reference path="../Model/Node.ts"/>

module GTE {
    /** A class for the graphical representation of the tree. The main algorithm for drawing and repositioning
     * the tree is in this class*/
    export class TreeView {
        game: Phaser.Game;
        tree: Tree;
        //The properties field determines the horizontal and vertical offsets between each level.
        properties: TreeViewProperties;
        nodes: Array<NodeView>;
        moves: Array<MoveView>;

        constructor(game: Phaser.Game, tree: Tree, properties: TreeViewProperties) {
            this.game = game;
            this.tree = tree;
            this.properties = properties;
            this.nodes = [];
            this.moves = [];
            this.drawTree();
            this.centerGroupOnScreen()
        }

        /**This method draws the tree by recursively calling the drawNode method*/
        drawTree() {
            this.drawNode(this.tree.root, 0, 0);
            this.centerGroupOnScreen();
        }

        /** This method recursively draws the nodes depending on the structure of the tree*/
        private drawNode(node:Node, parentX: number, parentY: number) {
            let nodeView = new NodeView(this.game, node);
            this.nodes.push(nodeView);
            let finalNodeX = 0;
            let finalNodeY = 0;
            if (node.parent) {
                let nodeIndex = node.getIndexFromParent();
                let parentChildrenCount = node.parent.children.length;
                let horizontalDistance = this.properties.initialLevelDistance / (2*node.depth);
                finalNodeX = parentX - (parentChildrenCount - 1) * horizontalDistance / 2 + horizontalDistance * nodeIndex;
                finalNodeY = parentY + this.properties.levelHeight;
            }
            nodeView.setPosition(finalNodeX, finalNodeY);

            node.children.forEach(n => {
                this.drawNode(n, finalNodeX, finalNodeY);
                this.moves.push(new MoveView(this.game, nodeView, this.findNodeView(n)));
            }, this);
        }

        /** Adds a child to a specified node*/
        addChildToNode(nodeV:NodeView){
            let node = nodeV.node;
            let child = new Node();
            this.tree.addChildToNode(node,child);

            let childV = new NodeView(this.game,child);
            if(node.children.length === 1){
                 childV.setPosition(nodeV.x, nodeV.y+this.properties.levelHeight);
            }
            else {
                let currentLevelDistance = this.properties.initialLevelDistance / (2 * child.depth);

                this.nodes.forEach(n => {
                    if (n.node.parent === nodeV.node) {
                        n.setPosition(n.x - currentLevelDistance / 2, n.y);
                    }
                });
                childV.setPosition(nodeV.x+(node.children.length-1) * currentLevelDistance / 2, nodeV.y+this.properties.levelHeight);

                this.repositionMovesFromNode(nodeV);
            }

            let move = new MoveView(this.game,nodeV,childV);

            this.nodes.push(childV);
            this.moves.push(move);

            this.centerGroupOnScreen();
            return childV;
        }

        /**A method for repositioning the moves when changing nodes positions*/
        private repositionMovesFromNode(from:NodeView){
            this.moves.forEach(m=>{
                if(m.from===from){
                    m.updateMovePosition();
                }
            })
        }

        /** A helper method for finding the nodeView, given a Node*/
        private findNodeView(node: Node) {
            for (let i = 0; i < this.nodes.length; i++) {
                let nodeView = this.nodes[i];
                if (nodeView.node === node) {
                    return nodeView;
                }
            }
        }

        /**Re-centers the tree on the screen*/
        private centerGroupOnScreen() {
            let left = this.game.width * 5;
            let right = -this.game.width * 5;
            let top = this.game.height * 5;
            let bottom = -this.game.height * 5;

            this.nodes.forEach(n => {
                if (n.x < left) {
                    left = n.x;
                }
                if (n.x > right) {
                    right = n.x;
                }
                if (n.y < top) {
                    top = n.y;
                }
                if (n.y > bottom) {
                    bottom = n.y;
                }
            });

            let width = right - left;
            let height = bottom - top;

            let treeCenterX = left + width / 2;
            let treeCenterY = top + height / 2;

            let offsetX = (this.game.width / 2 - treeCenterX);
            let offsetY = (this.game.height / 2 - treeCenterY);

            this.nodes.forEach(n => {
                n.setPosition(n.x + offsetX, n.y + offsetY);
            });
        }
    }
}