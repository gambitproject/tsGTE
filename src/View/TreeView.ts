module GTE {
    export class TreeView {
        game: Phaser.Game;
        tree: Tree;
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
            console.log("x1: "+this.nodes[0].x+" y1: "+this.nodes[0].y);
            console.log("x2: "+this.nodes[1].x+" y2: "+this.nodes[1].y);
            console.log("x3: "+this.nodes[2].x+" y3: "+this.nodes[2].y);
            this.centerGroupOnScreen()
        }

        drawTree() {
            this.drawNode(this.tree.root, 0, 0);
            // this.group.addMultiple(this.nodes);
            // this.group.addMultiple(this.moves);
        }

        private drawNode(node, parentX: number, parentY: number) {
            let nodeView = new NodeView(this.game, node);
            this.nodes.push(nodeView);
            let finalNodeX = 0;
            let finalNodeY = 0;
            if (!node.parent) {
                finalNodeX = 500;
                finalNodeY = 1250;
            }
            else {
                let nodeIndex = node.getIndexFromParent();
                let parentChildrenCount = node.parent.children.length;
                let horizontalDistance = this.properties.initialLevelDistance / Math.pow(1.5, node.depth);
                finalNodeX = parentX - (parentChildrenCount - 1) * horizontalDistance / 2 + horizontalDistance * nodeIndex;
                finalNodeY = parentY + this.properties.levelHeight;
            }
            nodeView.setPosition(finalNodeX, finalNodeY);

            node.children.forEach(n => {
                this.drawNode(n, finalNodeX, finalNodeY);
                this.moves.push(new MoveView(this.game, nodeView, this.findNodeView(n)));
            }, this);
        }

        private findNodeView(node: Node) {
            for (let i = 0; i < this.nodes.length; i++) {
                let nodeView = this.nodes[i];
                if (nodeView.node === node) {
                    return nodeView;
                }
            }
        }

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

            console.log("left: " + left);
            console.log("right: " + right);
            console.log("top: " + top);
            console.log("bottom: " + bottom);

            let width = right - left;
            let height = bottom - top;

            console.log("width: " + width);
            console.log("height: " + height);

            let treeCenterX = left + width / 2;
            let treeCenterY = top + height / 2;

            console.log("cX: "+treeCenterX);
            console.log("cY: "+treeCenterY);

            let offsetX = (this.game.width / 2 - treeCenterX);
            let offsetY = (this.game.height / 2 - treeCenterY);
            console.log("Offx: " + offsetX);
            console.log("Offy: " + offsetY);
            this.nodes.forEach(n => {
                n.setPosition(n.x + offsetX, n.y + offsetY);
            });

            console.log("KO? " + this.game.width);
            console.log("KO?" + this.game.height);

        }
    }
}