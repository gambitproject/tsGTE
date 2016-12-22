/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
module GTE {
    export class KeyboardController {
        game: Phaser.Game;
        treeController: TreeController;
        shiftKey: Phaser.Key;
        nKey: Phaser.Key;
        numberKeys: Array<Phaser.Key>;
        zeroKey: Phaser.Key;
        testButton: Phaser.Key;

        constructor(game: Phaser.Game, treeController: TreeController) {
            this.game = game;
            this.treeController = treeController;
            this.numberKeys = [];

            this.addKeys();
            this.deselectNodesHandler();
            this.addNodesHandler();
            this.assignPlayerToNodeHandler();
            this.assignChancePlayerToNodeHandler();
            this.testButtonHandler();
        }

        addKeys() {
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.zeroKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
            this.testButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            let keys = [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR];
            keys.forEach(k => {
                this.numberKeys.push(this.game.input.keyboard.addKey(k));
            });
        }

        deselectNodesHandler() {
            this.game.input.onDown.add(() => {
                if (!this.shiftKey.isDown && this.treeController.selectedNodes.length > 0) {
                    this.treeController.selectedNodes.forEach(n => {
                        n.isSelected = false;
                        n.resetNodeDrawing();
                    });
                    this.treeController.selectedNodes = [];
                }
            });
        }

        addNodesHandler() {
            this.nKey.onDown.add(() => {
                if (this.treeController.selectedNodes.length > 0) {
                    this.treeController.selectedNodes.forEach(n => {
                        n.inputHandler.dispatch(n, "inputDown");
                    })
                }
            });
        }

        assignPlayerToNodeHandler() {
            this.numberKeys.forEach((k) => {
                let playerID = this.numberKeys.indexOf(k) + 1;
                k.onDown.add(() => {
                    if (this.treeController.selectedNodes.length > 0) {
                        this.treeController.selectedNodes.forEach((n) => {
                            if (playerID > this.treeController.tree.players.length-1) {
                                this.treeController.tree.addPlayer(new Player(playerID, playerID.toString(), PLAYER_COLORS[playerID - 1]));
                            }
                            n.node.convertToLabeled(this.treeController.tree.findPlayerById(playerID));
                            n.resetNodeDrawing();
                        });
                    }
                });
            });
        }

        assignChancePlayerToNodeHandler(){
            this.zeroKey.onDown.add(()=>{
               if(this.treeController.selectedNodes.length>0){
                   this.treeController.selectedNodes.forEach((n)=>{
                       n.node.convertToChance(this.treeController.tree.players[0]);
                       n.resetNodeDrawing();
                   });
               }
            });
        }

        testButtonHandler() {
            this.testButton.onDown.add(() => {
                let node = this.treeController.selectedNodes[0];
                console.log("label fill: " + node.label.fill);
                console.log("Player Color: " + node.node.owner.color);
            });
        }
    }
}