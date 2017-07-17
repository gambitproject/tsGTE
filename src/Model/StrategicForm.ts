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

            leaves.forEach((n: Node) => {
                let p1String = "";
                let p2String = "";

                let current = n;
                while (current.parent) {
                    if (current.parent.owner === this.tree.players[1]) {
                        p1String += current.parentMove.label;
                    }
                    else if (current.parent.owner === this.tree.players[2]) {
                        p2String += current.parentMove.label;
                    }
                    current = current.parent;
                }

                this.strategies[0].push(p1String.split("").reverse().join(""));
                this.strategies[1].push(p2String.split("").reverse().join(""));
            });
        }
    }
}
