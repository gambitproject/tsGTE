///<reference path="../Model/ISet.ts"/>
///<reference path="NodeView.ts"/>
///<reference path="../../lib/phaser.d.ts"/>
module GTE{
    /**A class for drawing the iSet */
    export class ISetView{
        game:Phaser.Game;
        iSet:ISet;
        nodes:Array<NodeView>;
        lineWidth:number;
        circleRadius:number;


        constructor(game:Phaser.Game, iSet:ISet, nodes:Array<NodeView>){
            this.game= game;
            this.iSet = iSet;
            this.nodes = nodes;

            this.sortNodesLeftToRight();
        }

        private sortNodesLeftToRight(){
            this.nodes.sort((n1,n2)=>{
                return n1.x<=n2.x?-1:1;
            });
        }
        destroy(){

        }
    }
}