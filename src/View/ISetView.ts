///<reference path="../Model/ISet.ts"/>
///<reference path="NodeView.ts"/>
///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../Utils/Constants.ts"/>
module GTE {
    /**A class for drawing the iSet */
    export class ISetView {
        game: Phaser.Game;
        bmd: Phaser.BitmapData;
        iSet: ISet;
        iSetSprite: Phaser.Sprite;
        nodes: Array<NodeView>;
        lineWidth: number;

        constructor(game: Phaser.Game, iSet: ISet, nodes: Array<NodeView>) {
            this.game = game;
            this.iSet = iSet;
            this.nodes = nodes;
            this.sortNodesLeftToRight();
            this.createSimpleISet();

        }

        /**Sorts the nodes left to right before drawing*/
        private sortNodesLeftToRight() {
            this.nodes.sort((n1, n2) => {
                return n1.x <= n2.x ? -1 : 1;
            });
        }

        /**Create e very thick line that goes through all the points*/
        private createSimpleISet() {
            this.bmd = this.game.make.bitmapData(this.game.width, this.game.height);
            this.bmd.ctx.lineWidth = this.game.height*ISET_LINE_WIDTH;
            this.bmd.ctx.lineCap= "round";
            this.bmd.ctx.lineJoin = "round";
            this.bmd.ctx.strokeStyle = "#ffffff";
            this.bmd.ctx.beginPath();
            this.bmd.ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
            for (let i = 1; i < this.nodes.length; i++) {
                this.bmd.ctx.lineTo(this.nodes[i].x, this.nodes[i].y);
            }

            this.bmd.ctx.stroke();

            this.iSetSprite = this.game.add.sprite(0,0,this.bmd);
            this.iSetSprite.tint = this.iSet.player.color;
            this.iSetSprite.alpha = 0.15;
        }


        destroy() {
            this.bmd.destroy();
            this.bmd = null;
            this.iSetSprite.destroy();
            this.iSetSprite = null;
        }
    }

}