module GTE{
    export class MainScene extends Phaser.State{
        testNode1:NodeView;
        testNode2:NodeView;
        lastEventText:string;

        create(){
            let tree = new Tree();
            tree.addNode();
            tree.addNode();
            this.testNode1 = new NodeView(this.game,tree.nodes[0],200,200);
            this.testNode2 = new NodeView(this.game,tree.nodes[1],400,200);
            this.testNode2.label.text = "B";
            this.testNode1.inputHandler.add(function(){
                this.lastEventText = "Node "+<NodeView>arguments[0].label.text+" \nOperation: "+arguments[1]
            },this);
            this.testNode2.inputHandler.add(function(){
                this.lastEventText = "Node "+<NodeView>arguments[0].label.text+" \nOperation: "+arguments[1]
            },this);
        }

        render(){
            if(this.testNode1 && this.testNode2) {
                this.game.debug.text("Rotation: " + this.lastEventText, 20, 20, "#000", "26px Arial");
            }
        }

    }
}