module GTE {
    export class MoveView extends Phaser.Sprite {
        game:Phaser.Game;
        from: NodeView;
        to: NodeView;

        constructor(game: Phaser.Game, from: NodeView, to: NodeView) {
            super(game,from.x,from.y,game.cache.getBitmapData("move-line"));
            this.game = game;
            this.from = from;
            this.to = to;

            this.tint = 0x000000;
            this.anchor.set(0.5,0);

            this.rotation = Phaser.Point.angle(this.from.position,this.to.position) + Math.PI/2;
            this.height = Phaser.Point.distance(this.from.position,this.to.position);

            this.game.add.existing(this);
        }
    }
}