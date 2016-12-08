module GTE{
    export class ISet{
        player: Player;
        nodes: Array<Node>;

        constructor(player:Player, nodes?:Array<Node>){
            this.player = player;
            this.nodes = nodes || [];
        }

        destroy(){
            this.player = null;
            this.nodes.forEach(n=>n.destroy());
        }

        removeNode(node:Node){
            if(this.nodes.indexOf(node)!=-1){
                this.nodes.splice(this.nodes.indexOf(node),1);
            }
        }
    }
}