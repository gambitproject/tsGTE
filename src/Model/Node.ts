///<reference path="Move.ts"/>
///<reference path="ISet.ts"/>
///<reference path="Player.ts"/>
///<reference path="Payoff.ts"/>
module GTE {
    /**The types of Node. If a node does not have type, it can be deleted */
    export enum NodeType {DEFAULT=1, CHANCE, OWNED, LEAF}

    /**The class Node. Each Node has a type, parent, parentMove, children, childrenMoves, iSet, owner, depth and payoff */
    export class Node {
        type: NodeType;
        parent: Node;
        parentMove: Move;
        children: Array<Node>;
        childrenMoves: Array<Move>;
        iSet: ISet;
        owner: Player;
        depth: number;
        payoff: Payoff;

        constructor(depth?: number, type?: NodeType, parent?: Node) {
            this.depth = depth || 0;
            this.type = type || NodeType.DEFAULT;
            this.parent = parent || null;
            this.children = [];
            this.childrenMoves = [];
            this.owner = null;
        }
        /**The method adds a child to the current Node. */
        addChild(node?: Node) {
            let child = node || new Node();

            child.parent = this;
            child.type = NodeType.DEFAULT;
            child.depth = this.depth + 1;

            this.children.push(child);
            let move = new Move(this, child);
            child.parentMove = move;
            this.childrenMoves.push(move);
        }
        /**The method removes a given child from the Node */
        removeChild(node: Node) {
            if (this.children.indexOf(node) !== -1) {
                this.children.splice(this.children.indexOf(node), 1);
                node.destroy();
            }
        }
        /**The method gets the index of the node, from the children of the parent */
        getIndexFromParent(){
            return this.parent.children.indexOf(this);
        }
        /**Converts the current Node to a default Node */
        convertToDefault() {
            this.type = NodeType.DEFAULT;
            this.owner = null;
            this.payoff = null;
            if (this.iSet) {
                this.iSet.removeNode(this);
            }

            this.childrenMoves.forEach(c => c.convertToDefault());
        }
        /**Converts the current Node to a labeled, by setting an owner */
        convertToLabeled(player: Player) {
            if (this.children.length>0) {
                this.type = NodeType.OWNED;
                this.payoff = null;
                this.owner = player;

                this.childrenMoves.forEach(c => c.convertToLabeled());
            }
        }
        /**Converts the current Node to a leaf node, by setting payoffs */
        convertToLeaf(payoff: Payoff) {
            this.type = NodeType.LEAF;
            this.payoff = payoff;
            this.owner = null;
            if (this.iSet) {
                this.iSet.removeNode(this);
            }
        }
        /**Converts the current Node to a chance Node, setting the owner to the chancePlayer and assigning probabilities to children moves*/
        convertToChance(chancePlayer:Player, probabilities?: Array<number>, ) {
            this.type = NodeType.CHANCE;
            this.payoff = null;

            if(chancePlayer.id===0) {
                this.owner = chancePlayer;
            }
            else{
                throw new Error("Given player is not a chance player");
            }

            if (this.iSet) {
                this.iSet.removeNode(this);
            }

            if (probabilities && this.childrenMoves.length === probabilities.length) {
                for (let i = 0; i < this.childrenMoves.length; i++) {
                    this.childrenMoves[i].convertToChance(1 / probabilities[i]);
                }
            }
            else if (probabilities && this.childrenMoves.length !== probabilities.length) {
                throw new SyntaxError("Number of probabilities does not match number of moves!")
            } else {
                this.childrenMoves.forEach(c => c.convertToChance(1 / this.childrenMoves.length));
            }
        }

        /**A method which returns the path from a given node to the root*/
        getPathToRoot(){
            let path = [];
            let node = <Node>this;
            while(node.parent!==null){
                path.push(node.parent);
                node=node.parent;
            }
            return path;
        }

        /**Destroy ensures that there are no memory-leaks. */
        destroy() {
            this.type = null;
            this.depth = null;
            this.owner = null;
            if(this.parent){
                this.parent.children.splice(this.parent.children.indexOf(this),1);
            }
            if (this.iSet) {
                this.iSet.removeNode(this);
            }
            if (this.payoff) {
                this.payoff.destroy();
            }
            if (this.children.length > 0) {
                this.children.forEach((c) => c.destroy());
            }
            if (this.childrenMoves.length > 0) {
                this.childrenMoves.forEach((m) => {
                    m.destroy()
                });
            }
        }
    }
}