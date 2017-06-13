/// <reference path = "../../lib/phaser.d.ts"/>"/>
///<reference path="../Controller/UserActionController.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="HoverButton.ts"/>

// add, remove, link, unlink, cut, players
module GTE {

    export class HoverMenuManager {
        game: Phaser.Game;
        userActionController: UserActionController;

        plusButton: HoverButton;
        minusButton: HoverButton;
        linkButton: HoverButton;
        unlinkButton: HoverButton;
        cutButton: HoverButton;
        player1Button: HoverButton;
        player2Button: HoverButton;
        player3Button: HoverButton;
        player4Button: HoverButton;

        buttonsGroup: Phaser.Group;
        buttonsArray: Array<HoverButton>;
        alphaTween:Phaser.Tween;
        positionTween:Phaser.Tween;

        constructor(game: Phaser.Game, userActionController: UserActionController) {
            this.game = game;
            this.userActionController = userActionController;
            this.buttonsGroup = this.game.add.group();
            this.createButtonSprites(this.game);
            this.buttonsGroup.position.set(this.game.width / 2, this.game.height / 2);
            let nodeWidth = this.userActionController.treeController.treeView.nodes[0].width;
            this.repositionButtonSprites(nodeWidth);

            this.alphaTween = this.game.add.tween(this.buttonsGroup);
            this.positionTween = this.game.add.tween(this.buttonsGroup);
            this.buttonsGroup.alpha = 0;

            this.game.time.events.add(500,()=>{
                this.triggerMenu([this.userActionController.treeController.treeView.nodes[1]]);
            });
            // this.userActionController.treeController.
        }

        createButtonSprites(game: Phaser.Game) {
            this.plusButton = new HoverButton(game, this.buttonsGroup, "plus", PLUS_BUTTON_COLOR);
            this.minusButton = new HoverButton(game, this.buttonsGroup, "minus", MINUS_BUTTON_COLOR);
            this.linkButton = new HoverButton(game, this.buttonsGroup, "link", LINK_BUTTON_COLOR);
            this.unlinkButton = new HoverButton(game, this.buttonsGroup, "unlink", UNLINK_BUTTON_COLOR);
            this.cutButton = new HoverButton(game, this.buttonsGroup, "scissors", CUT_BUTTON_COLOR);
            this.player1Button = new HoverButton(game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[0]);
            this.player2Button = new HoverButton(game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[1]);
            this.player3Button = new HoverButton(game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[2]);
            this.player4Button = new HoverButton(game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[3]);

            this.buttonsArray = [this.plusButton, this.minusButton, this.linkButton, this.unlinkButton,
                this.cutButton, this.player1Button, this.player2Button, this.player3Button, this.player4Button];
        }

        repositionButtonSprites(width: number) {
            let buttonsScale = width * 0.0015;
            this.buttonsGroup.scale.set(buttonsScale);
            let buttonWidth = 320;
            this.plusButton.position.set(-2 * buttonWidth, 0);
            this.minusButton.position.set(-buttonWidth, 0);
            this.unlinkButton.position.set(buttonWidth, 0);
            this.cutButton.position.set(2 * buttonWidth, 0);
            this.player1Button.position.set(-1.5 * buttonWidth, buttonWidth);
            this.player2Button.position.set(-0.5 * buttonWidth, buttonWidth);
            this.player3Button.position.set(0.5 * buttonWidth, buttonWidth);
            this.player4Button.position.set(1.5 * buttonWidth, buttonWidth);
        }

        triggerMenu(sprites: Array<Phaser.Sprite>, keyX?:number, keyY?:number) {
            if(this.positionTween.isRunning){
                this.positionTween.yoyo(true);
                this.alphaTween.yoyo(true);
                this.positionTween.onComplete.add(()=>this.handleMenuCases(sprites,keyX,keyY));
            }
            else{
                this.handleMenuCases(sprites,keyX,keyY)
            }

        }

        private handleMenuCases(sprites: Array<Phaser.Sprite>, keyX?, keyY?){
            let startPosition = sprites[0].position;
            this.buttonsGroup.position.x = startPosition.x;
            this.buttonsGroup.position.y = startPosition.y;
            this.buttonsArray.forEach((button:HoverButton)=> button.setActive());
            if (sprites.length === 1 && sprites[0] instanceof NodeView) {
                this.unlinkButton.setInactive();
                this.linkButton.setInactive();

                this.cutButton.setInactive();
            }
            console.log("tween triggered!");
            this.alphaTween.to({alpha:1},500,Phaser.Easing.Default,true);
            this.positionTween.to({y:this.buttonsGroup.position.y+50},500,Phaser.Easing.Default,true);
        }
    }
}