/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="UserActionController.ts"/>
module GTE {
    /** A class for controlling the input of the application*/
    export class KeyboardController {
        game: Phaser.Game;
        // There is a reference to the tree controller, so that whenever a key is pressed we can call the corresponding method
        userActionController: UserActionController;
        shiftKey: Phaser.Key;
        controlKey:Phaser.Key;
        nKey: Phaser.Key;
        playersKeys: Array<Phaser.Key>;
        zeroKey: Phaser.Key;
        deleteKey: Phaser.Key;
        dKey: Phaser.Key;
        testButton: Phaser.Key;
        zButton:Phaser.Key;
        iKey:Phaser.Key;

        constructor(game: Phaser.Game, userActionController: UserActionController) {
            this.game = game;
            this.userActionController = userActionController;
            this.playersKeys = [];

            this.addKeys();
            this.attachHandlersToKeys();
            this.deselectNodesHandler();
        }

        /**Assigning all keys to the corresponding properties in the class*/
        addKeys() {
            this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.controlKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.zeroKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
            this.iKey = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
            this.testButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.zButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            let keys = [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR];

            keys.forEach(k => {
                this.playersKeys.push(this.game.input.keyboard.addKey(k));
            });

            this.deleteKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DELETE);
        }

        /**A method which assigns action to each key via the UserActionController*/
        attachHandlersToKeys(){
            this.nKey.onDown.add(() => {
                this.userActionController.addNodesHandler();
            });
            this.deleteKey.onDown.add(()=>{
                this.userActionController.deleteNodeHandler();
            });
            this.dKey.onDown.add(()=>{
                this.userActionController.deleteNodeHandler();
            });
            this.playersKeys.forEach((k) => {
                let playerID = this.playersKeys.indexOf(k) + 1;
                k.onDown.add(()=>{
                    this.userActionController.assignPlayerToNodeHandler(playerID);
                });
            });
            this.zeroKey.onDown.add(() => {
                this.userActionController.assignChancePlayerToNodeHandler();
            });
            this.iKey.onDown.add(()=>{
                this.userActionController.createISetHandler();
            });
            this.zButton.onDown.add(()=>{
                if(this.controlKey.isDown && !this.shiftKey.isDown){
                    this.userActionController.undoRedoHandler(true);
                }
                if(this.controlKey.isDown && this.shiftKey.isDown){
                    this.userActionController.undoRedoHandler(false);
                }
            });

        }

        /**A method for deselecting nodes. This method should not be here and will be moved to a new class.*/
        //TODO: Move to a new class (maybe a more abstract InputController which will have mouse and keyboard handlers?)
        deselectNodesHandler() {
            this.game.input.onDown.add(() => {
                if (!this.shiftKey.isDown) {
                    this.userActionController.deselectNodesHandler();
                }
            });
        }
    }
}