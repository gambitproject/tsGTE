/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="Constants.ts"/>
module GTE{
    /** A class representing the rectangle which selects vertices*/
    export class SelectionRectangle extends Phaser.Sprite{
        start:Phaser.Point;

        constructor(game:Phaser.Game){
            super(game,0,0);
            this.loadTexture(this.game.cache.getBitmapData("line"));

            this.start = new Phaser.Point();
            this.tint = SELECTION_INNER_COLOR;

            this.alpha = 0;

            //when we click and hold, we reset the rectangle.
            this.game.input.onDown.add(()=>{
                this.width = 0;
                this.height = 0;
                this.start.x = this.game.input.activePointer.position.x;
                this.start.y = this.game.input.activePointer.position.y;
                this.position = this.start;
                this.alpha = 0.3;
            },this);

            //When we release, reset the rectangle
            this.game.input.onUp.add(()=>{
                this.alpha = 0;
                this.width = 0;
                this.height = 0;
            });
            //On dragging, update the transform of the rectangle*/
            this.game.input.addMoveCallback(this.onDrag,this);
            this.game.add.existing(this);
        }
        /** The method which resizes the rectangle as we drag*/
        onDrag(){
            this.game.canvas.style.cursor = "default";
            if(this.game.input.activePointer.isDown) {
                this.height = this.game.input.activePointer.y-this.start.y;
                this.width = this.game.input.activePointer.x - this.start.x;
            }
        }
    }
}