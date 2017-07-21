///<reference path="Tree.ts"/>
///<reference path="Node.ts"/>
///<reference path="Move.ts"/>
module GTE {
    /**The class which will calculate the strategic form from the given tree */
    export class StrategicForm {
        tree: Tree;

        strategies: Array<Array<string>>;
        p1Strategies:Array<Array<Move>>;
        p2Strategies:Array<Array<Move>>;

        constructor(tree: Tree) {
            this.tree = tree;
            this.strategies = [];
            this.strategies[0] = [];
            this.strategies[1] = [];

            this.generateStrategicForm();
        }

        generateStrategicForm() {
            this.checkStrategicFormPossible();

            let nodes = this.tree.BFSOnTree();
            let p1InfoSets = [];
            let p2InfoSets = [];

            //Get all P1 and P2 information sets and singletons separated from the DFS order.
            nodes.forEach(n => {
                if (n.owner === this.tree.players[1]) {
                    if (n.iSet && p1InfoSets.indexOf(n.iSet) === -1) {
                        p1InfoSets.push(n.iSet);
                    }
                    else {
                        p1InfoSets.push(n);
                    }
                }
                else if (n.owner === this.tree.players[2]) {
                    if (n.iSet && p1InfoSets.indexOf(n.iSet) === -1) {
                        p2InfoSets.push(n.iSet);
                    }
                    else {
                        p2InfoSets.push(n);
                    }
                }
            });

            this.generateStrategies(p1InfoSets);
            this.generateStrategies(p2InfoSets);
        }

        generateStrategies(infoSets:Array<any>){
            this.p1Strategies = [];
            let currentStrategy = [];
            this.recurseStrategies(infoSets,0,currentStrategy);
        }

        private recurseStrategies(infoSets,index, strategy){
            for (let i = 0; i < infoSets[index].length; i++) {
                let obj = infoSets[index][i];

            }
        }

        // From is the "lower" (in terms of the tree) move
        isReachable(from: Array<Node>, to: Array<Node>) {
            let reacheable = false;
            for (let i = 0; i < from.length; i++) {
                let fromNode = from[i];
                for (let j = 0; j < to.length; j++) {
                    let toNode = to[j];
                    if (this.checkTwoNodesReachable(fromNode, toNode)) {
                        return true;
                    }
                }
            }
            return false;
        }

        private checkTwoNodesReachable(from: Node, to: Node) {
            // current is the node of the move we start from
            let current: Node = from;
            while (current.parent) {
                if (current.parent === to) {
                    return true;
                }
                current = current.parent;
            }
            return false;
        }

        checkStrategicFormPossible() {
            if (this.tree.players.length !== 3) {
                throw new Error("Strategic form only available for 2 players!");
            }
            //TODO: Perfect recall check
        }
    }
}
