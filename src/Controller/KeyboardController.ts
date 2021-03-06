/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="UserActionController.ts"/>
///<reference path="../Utils/Constants.ts"/>
module GTE {
    /** A class for controlling the input of the application. If there is a confusion over the functionality of each button
     * you can check the attachHandlersToKeysMethod*/

    export class KeyboardController {
        game: Phaser.Game;
        // There is a reference to the User , so that whenever a key is pressed we can call the corresponding method
        userActionController: UserActionController;
        shiftKey: Phaser.Key;
        controlKey: Phaser.Key;
        altKey: Phaser.Key;
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
        sKey: Phaser.Key;
        tabKey: Phaser.Key;
        enterKey: Phaser.Key;
        escapeKey: Phaser.Key;
        upKey: Phaser.Key;
        downKey: Phaser.Key;
        leftKey: Phaser.Key;
        rightKey: Phaser.Key;

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
            this.altKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ALT);
            this.nKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.zeroKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
            this.iKey = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
            this.testButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.uKey = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
            this.cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.tabKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
            this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

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
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.S);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ZERO);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.FOUR);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.CONTROL);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SHIFT);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ALT);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DELETE);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
            this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);


        }

        /**A method which assigns action to each key via the UserActionController*/
        attachHandlersToKeys() {
            // Children and new file
            this.nKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    if (!this.controlKey.isDown && !this.altKey.isDown) {
                        this.userActionController.addNodesHandler();
                    }
                    else if (!this.controlKey.isDown && this.altKey.isDown) {
                        this.userActionController.createNewTree();
                    }
                }
            });
            // Delete nodes
            this.deleteKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    this.userActionController.deleteNodeHandler();
                }
            });
            this.dKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    this.userActionController.deleteNodeHandler();
                }
            });

            // Assigning players
            this.playersKeys.forEach((k) => {
                if (!this.userActionController.treeController.labelInput.active) {
                    let playerID = this.playersKeys.indexOf(k) + 1;
                    k.onDown.add(() => {
                        this.userActionController.assignPlayerToNodeHandler(playerID);
                    });
                }
            });
            this.zeroKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    this.userActionController.assignChancePlayerToNodeHandler();
                }
            });

            // Create an information set
            this.iKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    if (!this.controlKey.isDown && !this.altKey.isDown) {
                        this.userActionController.createISetHandler();
                    }
                    else if (!this.controlKey.isDown && this.altKey.isDown) {
                        this.userActionController.saveTreeToImage();
                    }
                }
            });

            // Undo and redo
            this.zKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    if (this.controlKey.isDown && !this.shiftKey.isDown) {
                        this.userActionController.undoRedoHandler(true);
                    }
                    if (this.controlKey.isDown && this.shiftKey.isDown) {
                        this.userActionController.undoRedoHandler(false);
                    }
                }
            });

            // Remove information set
            this.uKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    this.userActionController.removeISetsByNodesHandler();
                }
            });

            // Cut information set
            this.cKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    let distinctISetsSelected = this.userActionController.treeController.getDistinctISetsFromNodes(this.userActionController.selectedNodes);
                    if (distinctISetsSelected.length === 1) {
                        this.userActionController.initiateCutSpriteHandler(this.userActionController.treeController.treeView.findISetView(distinctISetsSelected[0]));
                    }
                }
            });

            // Change to the next label
            this.tabKey.onDown.add(() => {
                if (this.userActionController.treeController.labelInput.active) {
                    if (this.shiftKey.isDown) {
                        this.userActionController.activateLabelField(false);
                    }
                    else {
                        this.userActionController.activateLabelField(true);
                    }
                }
            });

            // Enter value in label
            this.enterKey.onDown.add(() => {
                if (this.userActionController.treeController.labelInput.active) {
                    this.userActionController.changeLabel();
                }
            });

            // Exit label
            this.escapeKey.onDown.add(() => {
                if (this.userActionController.treeController.labelInput.active) {
                    this.userActionController.hideInputLabel();
                }
            });

            // Save to File
            this.sKey.onDown.add(() => {
                if (!this.controlKey.isDown && this.altKey.isDown) {
                    this.userActionController.saveTreeToFile();
                }
            });


            // Arrow Keys Moving nodes
            this.upKey.onUp.add(()=>{
                this.userActionController.undoRedoController.saveNewTree(true);
            });

            this.downKey.onUp.add(()=>{
                this.userActionController.undoRedoController.saveNewTree(true);
            });

            this.leftKey.onUp.add(()=>{
                this.userActionController.undoRedoController.saveNewTree(true);
            });

            this.rightKey.onUp.add(()=>{
                this.userActionController.undoRedoController.saveNewTree(true);
            });


            this.upKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    let verticalDistance = this.userActionController.treeController.treeViewProperties.levelHeight * NODES_VERTICAL_STEP_POSITIONING;

                    if (!this.controlKey.isDown) {
                        this.userActionController.moveNodeManually(0, -1, verticalDistance);
                    }
                }
            });

            this.downKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    let verticalDistance = this.userActionController.treeController.treeViewProperties.levelHeight * NODES_VERTICAL_STEP_POSITIONING;

                    if (!this.controlKey.isDown) {
                        this.userActionController.moveNodeManually(0, 1, verticalDistance);
                    }
                }
            });

            this.leftKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    let horizontalDistance = this.userActionController.treeController.treeViewProperties.treeWidth / this.userActionController.treeController.tree.getLeaves().length * NODES_HORIZONTAL_STEP_POSITIONING;

                    if (!this.controlKey.isDown) {
                        this.userActionController.moveNodeManually(-1, 0, horizontalDistance);
                    }
                }
            });
            this.rightKey.onDown.add(() => {
                if (!this.userActionController.treeController.labelInput.active) {
                    let horizontalDistance = this.userActionController.treeController.treeViewProperties.treeWidth / this.userActionController.treeController.tree.getLeaves().length * NODES_HORIZONTAL_STEP_POSITIONING;

                    if (!this.controlKey.isDown) {
                        this.userActionController.moveNodeManually(1, 0, horizontalDistance);
                    }
                }
            });

            this.upKey.onHoldCallback = function () {
                if (this.controlKey.isDown && !this.userActionController.treeController.labelInput.active) {
                    this.userActionController.moveNodeManually(0, -1, 1);
                }
            };

            this.downKey.onHoldCallback = function () {
                if (this.controlKey.isDown && !this.userActionController.treeController.labelInput.active) {
                    this.userActionController.moveNodeManually(0, 1, 1);
                }
            };

            this.leftKey.onHoldCallback = function () {
                if (this.controlKey.isDown && !this.userActionController.treeController.labelInput.active) {
                    this.userActionController.moveNodeManually(-1, 0, 1);
                }
            };

            this.rightKey.onHoldCallback = function () {
                if (this.controlKey.isDown && !this.userActionController.treeController.labelInput.active) {
                    this.userActionController.moveNodeManually(1, 0, 1);
                }
            };

            this.upKey.onHoldContext = this;
            this.downKey.onHoldContext = this;
            this.leftKey.onHoldContext = this;
            this.rightKey.onHoldContext = this;


            this.testButton.onDown.add(() => {
            });
        }
    }
}