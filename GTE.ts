/// <reference path = "Lib/phaser.d.ts"/>
module GTE {

    class GTE extends Phaser.Game {
        game: Phaser.Game;

        constructor(width?: number, height?: number) {
            var dpr = devicePixelRatio || 1;

            if (!width) {
                width = screen.width * dpr;
            }
            if (!height) {
                height = screen.height * dpr;
            }

            super(width, height, Phaser.CANVAS, 'phaser-div');
            this.game = this;
            this.game.state.add("Boot", Boot, false);
            this.game.state.add("MainScene", MainScene, false);
            this.game.state.start("Boot");
        }
    }

    window.onload = () => {
        new GTE(window.innerWidth * 0.9, window.innerHeight * 0.9);
    }
}