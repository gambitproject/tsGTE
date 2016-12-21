/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="../View/TreeView.ts"/>
///<reference path="../View/TreeViewProperties.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/MoveView.ts"/>
///<reference path="../Utils/SelectionRectangle.ts"/>
///<reference path="../Utils/Constants.ts"/>
module GTE{
    import Keyboard = Phaser.Keyboard;
    export class TreeController{
        game:Phaser.Game;
        bmd:Phaser.BitmapData;
        tree:Tree;
        treeView:TreeView;
        treeProperties:TreeViewProperties;
        dummyNodes:Array<NodeView>;
        dummyMoves:Array<MoveView>;
        selectionRectangle:SelectionRectangle;
        selectedNodes:Array<NodeView>;

        constructor(game:Phaser.Game){
            this.game = game;
            this.setCircleBitmapData(1);

            this.dummyMoves = [];
            this.dummyNodes = [];
            this.selectedNodes = [];
            this.selectionRectangle = new SelectionRectangle(this.game);

            this.tree = new Tree();
            this.tree.addNode();
            this.tree.addChildToNode(this.tree.nodes[0]);
            this.tree.addChildToNode(this.tree.nodes[0]);
            this.tree.addPlayer(new Player(1,"1",PLAYER_COLORS[0]));
            this.tree.addPlayer(new Player(2,"2",PLAYER_COLORS[1]));
            this.treeProperties = new TreeViewProperties(250,1000);

            this.treeView = new TreeView(this.game,this.tree,this.treeProperties);
            this.treeView.nodes[0].label.text="A";
            this.treeView.nodes[1].label.text="B";
            this.treeView.nodes[2].label.text="C";

            this.attachHandlersToNodes();
        }

        update(){
            if(this.game.input.activePointer.isDown){
                this.treeView.nodes.forEach((n:NodeView)=>{
                    if(this.selectionRectangle.overlap(n) && this.selectedNodes.indexOf(n)===-1){
                        n.setColor(NODE_SELECTED_COLOR);
                        n.isSelected = true;
                        this.selectedNodes.push(n);
                    }
                    if(!this.selectionRectangle.overlap(n) && this.selectedNodes.indexOf(n)!==-1 &&
                        !this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){

                        n.isSelected = false;
                        n.resetColor();
                        this.selectedNodes.splice(this.selectedNodes.indexOf(n),1);
                    }
                });
            }
        }

        setCircleBitmapData(scale: number) {
            this.bmd = this.game.make.bitmapData(this.game.height * NODE_RADIUS * scale, this.game.height * NODE_RADIUS * scale, "node-circle", true);
            this.bmd.ctx.fillStyle = "#ffffff";
            this.bmd.ctx.beginPath();
            this.bmd.ctx.arc(this.bmd.width / 2, this.bmd.width / 2, this.bmd.width * 0.45, 0, Math.PI * 2);
            this.bmd.ctx.fill();
        }

        private attachHandlersToNodes() {
            this.treeView.nodes.forEach(n => {
                this.attachHandlersToNode(n);
            });
        }

        private attachHandlersToNode(n:NodeView){
            n.inputHandler.add(function () {
                let node = <NodeView>arguments[0];
                let handlerText = arguments[1];
                switch(handlerText){
                    case "inputOver":this.handleInputOver(node);break;
                    case "inputOut":this.handleInputOut(node);break;
                    case "inputDown":this.handleInputDown(node);break;
                    default:break;
                }
            },this)
        }

        private handleInputOver(nodeV:NodeView){
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

                    this.dummyNodes.push(nodeV1);
                    this.dummyNodes.push(nodeV2);
                    this.dummyMoves.push(move1);
                    this.dummyMoves.push(move2);
                }
                else {
                    let nodeV1 = new NodeView(this.game, new Node());
                    let move1 = new MoveView(this.game, nodeV, nodeV1);

                    nodeV1.setPosition(nodeV.x + horizontalDistance / 2, nodeV.y);
                    nodeV1.setColor(HOVER_CHILDREN_COLOR);
                    move1.updateMovePosition();
                    move1.tint = HOVER_CHILDREN_COLOR;
                    this.dummyNodes.push(nodeV1);
                    this.dummyMoves.push(move1);
                }
            }
        }

        private handleInputOut(nodeV?:NodeView){
            if (nodeV) {
                nodeV.resetColor();
            }
            this.dummyNodes.forEach(n=>{
                n.destroy();
                n=null;
            });
            this.dummyNodes = [];

            this.dummyMoves.forEach(m=>{
                m.destroy();
                m=null;
            });
            this.dummyMoves = [];
        }

        private handleInputDown(nodeV:NodeView){
            this.handleInputOut();
            if(nodeV.node.children.length===0){
                let child1 = this.treeView.addChildToNode(nodeV);
                let child2 = this.treeView.addChildToNode(nodeV);
                this.attachHandlersToNode(child1);
                this.attachHandlersToNode(child2);
            }
            else{
                let child1 = this.treeView.addChildToNode(nodeV);
                this.attachHandlersToNode(child1);
            }
        }
    }
}