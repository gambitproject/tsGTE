module GTE {
    export class MoveView extends Phaser.Sprite {
        game: Phaser.Game;
        from: NodeView;
        to: NodeView;
        label:Phaser.Text;
        labelHorizontalOffset;

        constructor(game: Phaser.Game, from: NodeView, to: NodeView) {
            super(game, from.x, from.y, game.cache.getBitmapData("move-line"));

            this.game = game;
            this.from = from;
            this.to = to;

            this.position = this.from.position;
            this.tint = 0x000000;
            this.anchor.set(0.5, 0);

            this.rotation = Phaser.Point.angle(this.from.position, this.to.position) + Math.PI / 2;
            this.height = Phaser.Point.distance(this.from.position, this.to.position);
            //TODO: Add label

            this.game.add.existing(this);
            this.game.world.sendToBack(this);
        }

        updateMovePosition(){
            this.rotation = Phaser.Point.angle(this.from.position, this.to.position) + Math.PI / 2;
            this.height = Phaser.Point.distance(this.from.position, this.to.position);
        }

        destroy() {
            this.from = null;
            this.to = null;
            // this.label.destroy();
            super.destroy();
        }
    }
}