module GTE{
    export class TreeView{
        game:Phaser.Game;
        tree:Tree;
        group:Phaser.Group;

        constructor(game:Phaser.Game,tree:Tree){
            this.game = game;
            this.tree = tree;
        }
    }
}