///<reference path="Tree.ts"/>
///<reference path="Node.ts"/>
module GTE {
    /**The class which will calculate the strategic form from the given tree */
    export class StrategicForm {
        tree: Tree;

        strategies: Array<Array<string>>;

        constructor(tree: Tree) {
            this.tree = tree;
            this.strategies = [];
            this.strategies[0] = [];
            this.strategies[1] = [];

            this.generateStrategicForm();
        }

        generateStrategicForm() {
            let leaves = this.tree.getLeaves();

            let visited = [];
            leaves.forEach((n: Node) => {
                let p1String = "";
                let p2String = "";

                let current = n;
                while (current.parent) {
                    if (current.parent.owner === this.tree.players[1] && visited.indexOf(current)===-1) {
                        p1String += current.parentMove.label;
                    }
                    else if (current.parent.owner === this.tree.players[2] && visited.indexOf(current)===-1) {
                        p2String += current.parentMove.label;
                    }

                    if(visited.indexOf(current)===-1){
                        visited.push(current);
                    }
                    current = current.parent;
                }

                if(p1String!==""){
                    this.strategies[0].push(p1String.split("").reverse().join(""));
                }

                if (p2String!=="") {
                    this.strategies[1].push(p2String.split("").reverse().join(""));
                }
            });
        }
    }
}
