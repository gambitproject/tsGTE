/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
module GTE{
    export class KeyboardController{
        game:Phaser.Game;
        treeController:TreeController;
        shiftKey:Phaser.Key;
        nKey:Phaser.Key;

        constructor(game:Phaser.Game, treeController:TreeController){
            this.game = game;
            this.treeController = treeController;

            this.addKeys();
            this.deselectNodesHandler();
            this.addNodesHandler();
        }

        addKeys(){
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
        }

        deselectNodesHandler(){
            this.game.input.onDown.add(()=>{
                if(!this.shiftKey.isDown && this.treeController.selectedNodes.length>0){
                    this.treeController.selectedNodes.forEach(n=>{
                        n.isSelected = false;
                        n.resetColor();
                    });
                    this.treeController.selectedNodes = [];
                }
            });
        }

        addNodesHandler(){
            this.nKey.onDown.add(()=>{
                if(this.treeController.selectedNodes.length>0){
                    this.treeController.selectedNodes.forEach(n=>{
                        n.inputHandler.dispatch(n,"inputDown");
                    })
                }
            });
        }
    }
}