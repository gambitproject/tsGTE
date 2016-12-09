module GTE {
    export class Tree {
        root: Node;
        nodes: Array<Node>;
        moves: Array<Move>;
        iSets: Array<ISet>;
        players: Array<Player>;
        strategicForm: StrategicForm;

        constructor() {

        }

        addPlayer(player:Player){
            if(this.players.indexOf(player)===-1){
                this.players.push(player);
            }
        }

        removePlayer(player:Player){
            if(this.players.indexOf(player)!==-1){
                this.players.splice(this.players.indexOf(player),1);
                this.nodes.forEach(n=>{
                   if(n.owner === player){
                       n.convertToDefault();
                   }
                });
                this.iSets.forEach(iSet=>{
                    if(iSet.player === player){
                        iSet.emptyISet();
                    }
                });
            }
        }

        addISet(player:Player, nodes?:Array<Node>){
            let iSet = new ISet(player,nodes);
            this.iSets.push(iSet);
        }

        removeISet(iSet:ISet){
            if(this.iSets.indexOf(iSet)!==-1){
                this.iSets.splice(this.iSets.indexOf(iSet),1);
                iSet.emptyISet();
            }
        }

        addNodeToISet(iSet:ISet, node:Node){
            if(this.iSets.indexOf(iSet)!==-1){
                iSet.addNode(node);
            }
        }

        addNode(node?:Node) {
            node = node || new Node();
            if (this.nodes.length == 0) {
                node.depth = 0;
                this.root = node;
            }

            this.nodes.push(node);
        }

        addChildToNode(node: Node, child?: Node) {

            if(this.nodes.indexOf(node)===-1){
                throw new Error("Node not found in tree");
            }

            child = child || new Node();
            node.addChild(child);
            this.nodes.push(child);
            this.moves.push(child.parentMove);
        }
    }
}