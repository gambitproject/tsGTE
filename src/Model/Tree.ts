///<reference path="Node.ts"/>
///<reference path="Move.ts"/>
///<reference path="ISet.ts"/>
///<reference path="Player.ts"/>
///<reference path="StrategicForm.ts"/>
///<reference path="../Utils/ObjectCloner.ts"/>
///<reference path="../Utils/Constants.ts"/>

module GTE {
    /**The class which stores all the needed information for the tree - lists of nodes, moves, isets, players and the root */
    export class Tree {
        root: Node;
        nodes: Array<Node>;
        moves: Array<Move>;
        iSets: Array<ISet>;
        players: Array<Player>;
        strategicForm: StrategicForm;
        private leaves;

        constructor() {
            this.nodes = [];
            this.moves = [];
            this.iSets = [];
            this.players = [];
        }

        /** Adds a player to the list of players*/
        addPlayer(player: Player) {
            if (this.players.indexOf(player) === -1) {
                this.players.push(player);
            }
        }

        /** Removes a given player from the list, also removes all instances of the player from nodes and isets. */
        removePlayer(player: Player) {
            if (this.players.indexOf(player) !== -1) {
                this.players.splice(this.players.indexOf(player), 1);
                this.nodes.forEach(n => {
                    if (n.owner === player) {
                        n.convertToDefault();
                    }
                });
                this.iSets.forEach(iSet => {
                    if (iSet.player === player) {
                        iSet.destroy();
                    }
                });
            }
        }

        /** Finds and returns the player by ID*/
        findPlayerById(id: number) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id) {
                    return this.players[i];
                }
            }
            console.log("Player not found! ");
        }

        /** Adds an iSet to the list of isets */
        addISet(player: Player, nodes?: Array<Node>) {
            let iSet = new ISet(player, nodes);
            this.iSets.push(iSet);
        }

        /** Removes an iSet from the list of isets*/
        removeISet(iSet: ISet) {
            if (this.iSets.indexOf(iSet) !== -1) {
                this.iSets.splice(this.iSets.indexOf(iSet), 1);
                iSet.destroy();
            }
        }

        /** Adds a given node to a given iset */
        addNodeToISet(iSet: ISet, node: Node) {
            if (this.iSets.indexOf(iSet) !== -1) {
                iSet.addNode(node);
            }
        }

        /** Adds node to the tree and checks if it should be the root*/
        addNode(node?: Node) {
            node = node || new Node();
            if (this.nodes.length == 0) {
                node.depth = 0;
                this.root = node;
            }

            this.nodes.push(node);
        }

        removeNode(node:Node){
            
        }

        /** Adds a child to a given node*/
        addChildToNode(node: Node, child?: Node) {

            if (this.nodes.indexOf(node) === -1) {
                throw new Error("Node not found in tree");
            }

            child = child || new Node();
            node.addChild(child);
            this.nodes.push(child);
            this.moves.push(child.parentMove);
        }

        /**Returns the number of leaves in the tree.*/
        getLeaves() {
            this.leaves = [];
            this.leavesDFS(this.root);
            return this.leaves;
        }

        /**Recursive call to determine the number of leaves in the tree*/
        private leavesDFS(node: Node) {
            if (node.children.length !== 0) {
                node.children.forEach(n => this.leavesDFS(n));
            }
            else {
                this.leaves.push(node);
            }
        }

        /**A method which checks whether an information set can be created from a list of nodes.
         * If not, throws errors which are handled in the controller. Uses 4 helper methods.*/
        canCreateISet(nodes:Array<Node>){
            if(!this.checkIfNodesHavePlayers(nodes)){
                throw new Error(NODES_MISSING_PLAYERS_ERROR_TEXT);
            }

            if(!this.checkNumberOfChildren(nodes)){
                throw new Error(NODES_NUMBER_OF_CHILDREN_ERROR_TEXT);
            }

            if(!this.checkIfNodesHaveTheSamePlayer(nodes)){
                throw new Error(NODES_DIFFERENT_PLAYERS_ERROR_TEXT);
            }

            if(this.checkIfNodesSharePathToRoot(nodes)) {
                throw new Error(SAME_PATH_ON_ROOT_ERROR_TEXT);
            }
        }


        private checkNumberOfChildren(nodes:Array<Node>):boolean{
            for (let i = 0; i < nodes.length-1; i++) {
                if(nodes[i].children.length!==nodes[i+1].children.length){
                    return false;
                }
            }
            return true;
        }

        /**Checks if selected nodes have the same player assigned*/
        private checkIfNodesHaveTheSamePlayer(nodes:Array<Node>):boolean{
            let players = [];
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                if(players.indexOf(node.owner)===-1){
                    players.push(node.owner);
                }
            }
            return players.length===1;
        }

        /**Checks if selected nodes have assigned players*/
        private checkIfNodesHavePlayers(nodes:Array<Node>):boolean{
            for (let i = 0; i < nodes.length; i++) {
                let node = <Node>nodes[i];
                if(node.owner===null){
                    return false;
                }
            }
            return true;
        }

        /**Checks whether any 2 nodes of an array share a path to the root.*/
        private checkIfNodesSharePathToRoot(nodes:Array<Node>):boolean{
            for (let i = 0; i < nodes.length; i++) {
                let n1 = nodes[i];
                let path1 = n1.getPathToRoot();
                for (let j = i+1; j < nodes.length; j++) {
                    let n2 = nodes[j];
                    let path2 = n2.getPathToRoot();
                    if(path1.indexOf(n2)!==-1 || path2.indexOf(n1)!==-1){
                        return true;
                    }
                }
            }
            return false;
        }

        /**Clones the tree using an external library - given in utils */
        clone() {
            let objectCloner = new ObjectCloner();
            return objectCloner.clone(this,true);
        }
    }
}