/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="KeyboardController.ts"/>
///<reference path="UserActionController.ts"/>
module GTE {
    /**A class for the main part of the software. This is the starting point of the core software*/
    export class MainScene extends Phaser.State {
        // The Tree Controller handles everything related to the tree
       treeController:TreeController;
        // User Action Controller handles actions from the user. These actions will be called whenever a keyboard key
        // or a button is pressed. Abstracts the logic of user actions and removes unnecessary code repetition.
        userActionController:UserActionController;
        // The Keyboard Controller handles input and sends signals and executes methods from the treeController
        keyboardController:KeyboardController;

        create() {
           this.treeController = new TreeController(this.game);
           this.userActionController = new UserActionController(this.game,this.treeController)

           this.keyboardController = new KeyboardController(this.game, this.userActionController);
           // The line below is used for fps testing purposes
           this.game.time.advancedTiming = true;

        }

        /** The update method is built-into the engine for every state. It executes at most 60 times a second*/
        update(){
          this.treeController.update();
        }

        /** This is used for testing purposes - displays a text 60 times a second in the app*/
        render() {
            this.game.debug.text(this.game.time.fps.toString(), 20,20, "#000000", "26px Arial");
            if(this.treeController) {
                this.game.debug.text("iSetsInView: "+this.treeController.treeView.iSets.length.toString(),20,50,"#000000","26px Arial");
                this.game.debug.text("iSetsInModel: "+this.treeController.tree.iSets.length.toString(),20,80,"#000000","26px Arial");
            }
        }
    }
}