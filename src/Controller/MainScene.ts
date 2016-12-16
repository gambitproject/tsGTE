module GTE {
    export class MainScene extends Phaser.State {
       treeController:TreeController;

        create() {
           this.treeController = new TreeController(this.game);

            // let move = new MoveView(this.game, <NodeView>treeView.group.children[0], <NodeView>treeView.group.children[1]);

            // this.testNode1 = new NodeView(this.game, tree.nodes[0], 200, 200);
            // this.testNode2 = new NodeView(this.game, tree.nodes[1], 1000, 800);
            // this.move = new MoveView(this.game, this.testNode1, this.testNode2)
            // this.testNode2.label.text = "B";
            // this.testNode1.inputHandler.add(function () {
            //     this.lastEventText = "Node " + <NodeView>arguments[0].label.text + " \nOperation: " + arguments[1]
            //     let node = <NodeView>arguments[0];
            //     this.setCircleBitmapData(3);
            //     node.circle.loadTexture(this.game.cache.getBitmapData("node-circle"));
            // }, this);
            // this.testNode2.inputHandler.add(function () {
            //     this.lastEventText = "Node " + <NodeView>arguments[0].label.text + " \nOperation: " + arguments[1]
            // }, this);
        }

        render() {
            // if(this.testNode1 && this.testNode2) {
            //     this.game.debug.text("Event: " + this.lastEventText, 20, 20, "#000", "26px Arial");
            // }
            // if(this.move){
            //     this.game.debug.spriteBounds(this.move);
            // }
        }
    }
}