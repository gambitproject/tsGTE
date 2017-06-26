///<reference path="../Model/Tree.ts"/>
///<reference path="../Model/Move.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="../Model/ISet.ts"/>
///<reference path="../Model/Player.ts"/>
///<reference path="../Model/Payoff.ts"/>
module GTE {
    export class TreeParser {

        private copyWithoutCircularReferences(tree: Tree) {
            let strippedTree = {
                players: [],
                nodes: [],
                iSets: [],
                moves: [],
                nodePlayerPair: []
            };

            //Copy players
            tree.players.forEach(p => {
                strippedTree.players.push(new Player(p.id, p.label, p.color));
            });

            // Copy the nodes without any connection to other nodes
            tree.nodes.forEach(n => {
                let node = new Node();
                node.type = n.type;
                node.depth = n.depth;
                if (node.type === NodeType.OWNED) {
                    let ownerIndex = tree.players.indexOf(n.owner);
                    strippedTree.nodePlayerPair.push({nodeIndex:tree.nodes.indexOf(n),playerIndex:ownerIndex});
                }
                if (n.payoff) {
                    let players = [];
                    let payoffs = [];
                    n.payoff.playerPayoffPairs.forEach(pair => {
                        let playerIndex = tree.players.indexOf(pair.player);
                        players.push(strippedTree.players[playerIndex]);
                        payoffs.push(pair.payoff);
                    });
                    node.payoff = new Payoff(players, payoffs);
                }

                strippedTree.nodes.push(node);
            });

            //Copy moves
            tree.moves.forEach(m => {
                let move = {
                    type: null,
                    fromIndex: null,
                    toIndex: null,
                    label: null,
                    probability: null
                };
                move.type = m.type;
                if (m.type === MoveType.LABELED) {
                    move.label = m.label;
                }
                if (m.type === MoveType.CHANCE) {
                    move.probability = m.probability;
                }
                move.fromIndex = tree.nodes.indexOf(m.from);
                move.toIndex = tree.nodes.indexOf(m.to);

                strippedTree.moves.push(move);
            });

            //Copy iSets
            tree.iSets.forEach(is => {
                let iSet = {
                    label: null,
                    nodeIndexes: []
                };
                iSet.label = is.label;
                is.nodes.forEach((n) => {
                    iSet.nodeIndexes.push(tree.nodes.indexOf(n));
                });
                strippedTree.iSets.push(iSet);
            });

            return strippedTree;
        }


        stringify(tree: Tree) {
            let decircularTree = this.copyWithoutCircularReferences(tree);

            return JSON.stringify(decircularTree);
        }

        parse(jsonTree: string) {
            let strippedTree = JSON.parse(jsonTree);

            let clonedTree = new Tree();
            strippedTree.players.forEach((pl: Player) => {
                clonedTree.players.push(new Player(pl.id, pl.label, pl.color));
            });

            strippedTree.nodes.forEach((n: Node) => {
                let node = new Node();
                node.type = n.type;
                node.depth = n.depth;
                node.payoff = n.payoff;
                clonedTree.nodes.push(node);

            });

            strippedTree.nodePlayerPair.forEach(pair=>{
               clonedTree.nodes[pair.nodeIndex].owner = clonedTree.players[pair.playerIndex];
            });

            strippedTree.iSets.forEach(is => {
                let iSet = new ISet();
                iSet.label = is.label;
                is.nodeIndexes.forEach(i => {
                    iSet.nodes.push(clonedTree.nodes[i]);
                });
                iSet.player = iSet.nodes[0].owner;
                clonedTree.iSets.push(iSet);
            });

            strippedTree.moves.forEach(m => {
                let move = new Move();
                move.type = m.type;
                move.label = m.label;
                move.probability = m.probability;
                move.from = clonedTree.nodes[m.fromIndex];
                move.to = clonedTree.nodes[m.toIndex];


                move.from.children.push(move.to);
                move.to.parent = move.from;
                move.from.childrenMoves.push(move);
                move.to.parentMove = move;
                clonedTree.moves.push(move);
            });

            clonedTree.root = clonedTree.nodes[0];
            clonedTree.getLeaves();

            return clonedTree;
        }
    }
}