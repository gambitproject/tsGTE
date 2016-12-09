module GTE{
    export class ISet{
        player: Player;
        nodes: Array<Node>;
        label:string;

        constructor(player:Player, nodes?:Array<Node>){
            this.player = player;
            this.nodes = [];
            this.label = "";
            if(nodes) {
                nodes.forEach(n => this.addNode(n));
            }
        }

        addNode(node:Node){
            if(node.owner !== this.player){
                throw new Error("ISet player is different from node owner!");
            }
            if(this.nodes.indexOf(node)===-1){
                this.nodes.push(node);
                node.iSet=this;
            }
        }

        removeNode(node:Node){
            if(this.nodes.indexOf(node)!==-1){
                this.nodes.splice(this.nodes.indexOf(node),1);
                node.iSet = null;
            }
        }

        emptyISet(){
            this.nodes.forEach(n=>{
                this.removeNode(n);
                n.iSet =null;
            });
        }

        addLabel(label:string){
            this.label = label;
        }

        removeLabel(){
            this.label = "";
        }

        destroy(){
            this.player = null;
            this.nodes.forEach(n=>n.destroy());
        }


    }
}