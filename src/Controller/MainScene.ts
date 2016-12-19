module GTE {
    export class MainScene extends Phaser.State {
       treeController:TreeController;

        create() {
           this.treeController = new TreeController(this.game);
           this.game.time.advancedTiming = true;

        }

        update(){
            if(this.game.input.activePointer.isDown){
                this.treeController.treeView.nodes.forEach((n:NodeView)=>{
                    if(this.treeController.selectionRectangle.overlap(n)){
                        n.setColor(0xff0000);
                    }
                });
            }
        }

        render() {
            this.game.debug.text(this.game.time.fps.toString(), 20,20, "#000000", "26px Arial");
        }
    }
}