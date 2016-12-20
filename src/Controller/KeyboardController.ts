/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
module GTE{
    export class KeyboardController{
        game:Phaser.Game;
        treeController:TreeController;
        shiftKey:Phaser.Key;
        nKey:Phaser.Key;
        oneKey:Phaser.Key;
        twoKey:Phaser.Key;

        constructor(game:Phaser.Game, treeController:TreeController){
            this.game = game;
            this.treeController = treeController;

            this.addKeys();
            this.deselectNodesHandler();
            this.addNodesHandler();
            this.assignPlayerToNodeHandler();
        }

        addKeys(){
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
            this.twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
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

        assignPlayerToNodeHandler(){
            this.oneKey.onDown.add(()=>{
               if(this.treeController.selectedNodes.length>0){
                   this.treeController.selectedNodes.forEach((n)=>{
                      n.node.convertToLabeled(this.treeController.tree.findPlayerById(1));
                      n.setLabelText();
                      n.resetColor();
                       console.log(n.node.owner.label);
                       console.log(n.label.text);
                   });
               }
            });
            this.twoKey.onDown.add(()=>{
                console.log("mhm");
               let player = this.treeController.tree.findPlayerById(1);
               player.color = 0x00ff00;
               player.label = "2";
            });
        }
    }
}