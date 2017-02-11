///<reference path="TreeController.ts"/>
///<reference path="../Model/Tree.ts"/>
module GTE {

    /**A class for handling the Undo/Redo functionality */
    export class UndoRedoController {
        treeController: TreeController;
        treesList: Array<Tree>;
        currentTreeIndex: number;

        constructor(treeController: TreeController) {
            this.treeController = treeController;
            this.treesList = [];
            this.treesList.push(treeController.tree);
            this.currentTreeIndex = 0;
        }

        changeTreeInController(undo: boolean) {
            if (undo && this.currentTreeIndex - 1 >= 0) {
                this.currentTreeIndex--;
            }
            else if(!undo && this.currentTreeIndex+1<this.treesList.length){
                this.currentTreeIndex++;
            }
            else{
                return;
            }

            //1. Delete the current Tree in tree controller
            //2. Change it with the corresponding one in treelist
            //3. Redraw
        }

        saveNewTree() {
            //1. Clone the current tree from the controller into the class.
            // TODO: Implement clone logic in tree,node,move etc...
        }
    }
}