///<reference path="TreeController.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="../View/TreeView.ts"/>
module GTE {

    /**A class for handling the Undo/Redo functionality */
    export class UndoRedoController {
        treeController: TreeController;
        treesList: Array<Tree>;
        currentTreeIndex: number;

        constructor(treeController: TreeController) {
            this.treeController = treeController;
            this.treesList = [];
            this.currentTreeIndex = 0;
            this.treesList.push(treeController.tree.clone());
        }

        /**Undo-Redo method */
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

            //1. Delete the current Tree and ISets in tree controller
            this.treeController.deleteNodeHandler(this.treeController.tree.root);
            this.treeController.treeView.nodes[0].destroy();
            this.treeController.treeView.iSets.forEach((iSet:ISetView)=>{
                iSet.destroy();
            });

            //2. Change it with the corresponding one in treelist
            this.treeController.tree = this.treesList[this.currentTreeIndex].clone();
            this.treeController.treeView = new TreeView(this.treeController.game,this.treeController.tree,this.treeController.treeProperties);
            this.treeController.emptySelectedNodes();
            this.treeController.treeView.nodes.forEach(n=>{
               n.resetNodeDrawing();
            });
            this.treeController.attachHandlersToNodes();
        }

        saveNewTree() {
            this.treesList.splice(this.currentTreeIndex+1, this.treesList.length);
            this.treesList.push(this.treeController.tree.clone());
            this.currentTreeIndex++;
        }
    }
}