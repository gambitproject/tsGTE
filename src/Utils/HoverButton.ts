/// <reference path = "../../lib/phaser.d.ts"/>"/>
module GTE {
    export class HoverButton extends Phaser.Sprite {
        private circle: Phaser.Sprite;
        private icon: Phaser.Sprite;
        private inputHandler: Phaser.Signal;
        active: boolean;
        buttonKey: string;
        hovered:boolean;

        constructor(game: Phaser.Game, group:Phaser.Group, key: string, circleColor: number, iconColor?: number) {
            super(game, 0, 0, "");
            this.anchor.set(0.5,0.5);
            this.width = 400;
            this.height = 400;
            this.scale.set(1,1);

            this.active = false;
            this.hovered = false;
            this.buttonKey = key;
            this.inputEnabled = true;
            this.inputHandler = new Phaser.Signal();

            this.circle = this.game.add.sprite(0, 0, this.game.cache.getBitmapData("hover-circle"));
            this.circle.position=this.position;
            this.circle.tint = circleColor;
            this.circle.anchor.set(0.5,0.5);
            this.circle.scale = this.scale;

            this.icon = this.game.add.sprite(0, 0, key);
            this.icon.anchor.set(0.5, 0.5);
            this.icon.position = this.position;
            this.icon.scale = this.scale;
            if (iconColor) {
                this.icon.tint = iconColor;
            }
            this.events.onInputDown.add(() => {
                if (this.active) {
                    this.inputHandler.dispatch(this, "hoverButtonClicked");
                    console.log("dispatched");
                }
            });
            this.events.onInputOver.add(()=>{
                this.hovered = true;
            });
            this.events.onInputOut.add(()=>{
               this.hovered = false;
            });

            // this.setHidden();

            group.add(this);
            group.add(this.circle);
            group.add(this.icon);
            this.bringToTop();
        }

        setInactive() {
            this.active = false;
            this.circle.alpha = 0.2;
            this.icon.alpha = 1;
        }

        setActive() {
            this.active = true;
            this.circle.alpha = 1;
            this.icon.alpha = 1;
        }

        setHidden(){
            this.active = false;
            this.circle.alpha = 0;
            this.icon.alpha = 0;
        }

        destroy(){
            this.circle.destroy();
            this.circle = null;
            this.icon.destroy();
            this.icon = null;
            super.destroy();
        }
    }
}