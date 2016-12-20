/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="KeyboardController.ts"/>
module GTE {
    export class MainScene extends Phaser.State {
       treeController:TreeController;
       keyboardController:KeyboardController;

        create() {
           this.treeController = new TreeController(this.game);
           this.keyboardController = new KeyboardController(this.game, this.treeController);
           this.game.time.advancedTiming = true;

        }

        update(){
          this.treeController.update();
        }

        render() {
            this.game.debug.text(this.game.time.fps.toString(), 20,20, "#000000", "26px Arial");
            if(this.treeController) {
                this.game.debug.text("Selected: "+this.treeController.selectedNodes.length.toString(),20,40,"#000000","26px Arial");
            }
        }
    }
}