/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="UserActionController.ts"/>
module GTE {
    /** A class for controlling the input of the application. If there is a confusion over the functionality of each button
     * you can check the attachHandlersToKeysMethod*/
    export class KeyboardController {
        game: Phaser.Game;
        // There is a reference to the User , so that whenever a key is pressed we can call the corresponding method
        userActionController: UserActionController;
        shiftKey: Phaser.Key;
        controlKey: Phaser.Key;
        nKey: Phaser.Key;
        playersKeys: Array<Phaser.Key>;
        zeroKey: Phaser.Key;
        deleteKey: Phaser.Key;
        dKey: Phaser.Key;
        testButton: Phaser.Key;
        zKey: Phaser.Key;
        iKey: Phaser.Key;
        uKey: Phaser.Key;
        cKey: Phaser.Key;
        tabKey: Phaser.Key;
        enterKey: Phaser.Key;
        escapeKey: Phaser.Key;

        constructor(game: Phaser.Game, userActionController: UserActionController) {
            this.game = game;
            this.userActionController = userActionController;

            this.playersKeys = [];

            this.addKeys();
            this.attachHandlersToKeys();
            // this.deselectNodesHandler();
        }

        /**Assigning all keys to the corresponding properties in the class*/
        addKeys() {
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.controlKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.zeroKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
            this.iKey = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
            this.testButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.uKey = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
            this.cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.tabKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

            let keys = [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR];

            keys.forEach(k => {
                this.playersKeys.push(this.game.input.keyboard.addKey(k));
            });

            this.deleteKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DELETE);

            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.C);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.N);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.I);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.Z);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.D);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.U);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ZERO);
        }

        /**A method which assigns action to each key via the UserActionController*/
        attachHandlersToKeys() {
            this.nKey.onDown.add(() => {
                this.userActionController.addNodesHandler();
            });
            this.deleteKey.onDown.add(() => {
                this.userActionController.deleteNodeHandler();
            });
            this.dKey.onDown.add(() => {
                this.userActionController.deleteNodeHandler();
            });
            this.playersKeys.forEach((k) => {
                let playerID = this.playersKeys.indexOf(k) + 1;
                k.onDown.add(() => {
                    this.userActionController.assignPlayerToNodeHandler(playerID);
                });
            });
            this.zeroKey.onDown.add(() => {
                this.userActionController.assignChancePlayerToNodeHandler();
            });
            this.iKey.onDown.add(() => {
                this.userActionController.createISetHandler();
            });
            this.zKey.onDown.add(() => {
                if (this.controlKey.isDown && !this.shiftKey.isDown) {
                    this.userActionController.undoRedoHandler(true);
                }
                if (this.controlKey.isDown && this.shiftKey.isDown) {
                    this.userActionController.undoRedoHandler(false);
                }
            });
            this.uKey.onDown.add(() => {
                this.userActionController.removeISetsByNodesHandler();
            });

            this.cKey.onDown.add(() => {
                let distinctISetsSelected = this.userActionController.treeController.getSelectedISets();
                if (distinctISetsSelected.length === 1) {
                    this.userActionController.initiateCutSpriteHandler(this.userActionController.treeController.treeView.findISetView(distinctISetsSelected[0]));
                }
            });

            this.tabKey.onDown.add(() => {
                if(this.shiftKey.isDown) {
                    this.userActionController.activateLabel(false);
                }
                else{
                    this.userActionController.activateLabel(true);
                }
            });

            this.enterKey.onDown.add(()=>{
                this.userActionController.changeLabel();
            });

            this.escapeKey.onDown.add(()=>{
                this.userActionController.hideInputLabel();
            })
        }
    }
}