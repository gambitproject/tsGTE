module GTE {
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

        removeChild(node: Node) {
            if (this.children.indexOf(node) != -1) {
                this.children.splice(this.children.indexOf(node), 1);
                node.destroy();
            }
        }

        convertToDefault() {
            this.type = NodeType.DEFAULT;
            this.owner = null;
            this.payoff = null;
            if(this.iSet){
                this.iSet.removeNode(this);
            }

            this.childrenMoves.forEach(c => c.convertToDefault());
        }

        convertToLabeled(player: Player) {
            this.type = NodeType.OWNED;
            this.payoff = null;
            this.owner = player;

            this.childrenMoves.forEach(c => c.convertToLabeled());
        }

        convertToLeaf(payoff: Payoff) {
            this.type = NodeType.LEAF;
            this.payoff = payoff;
            this.owner = null;
            if(this.iSet){
                this.iSet.removeNode(this);
            }
        }

        convertToChance(probabilities?: Array<number>) {
            this.type = NodeType.CHANCE;
            this.payoff = null;
            this.owner = null;

            if(this.iSet){
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

        destroy() {
            this.type = null;
            this.depth = null;
            this.owner = null;
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

            this.parentMove.destroy();
        }
    }
}