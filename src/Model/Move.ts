///<reference path="Node.ts"/>
module GTE {
    /**Enumeration for the different types of Moves */
    export enum MoveType{DEFAULT=1, CHANCE, LABELED}
    /**The class Move which has type, from, to, label and probability */
    export class Move {
        type:MoveType;
        from:Node;
        to:Node;
        label:string;
        probability:number;

        constructor(from?:Node, to?:Node){
            this.type = MoveType.DEFAULT;
            this.from = from;
            this.to = to;
        }
        /**Converts the Move to a labeled Move */
        convertToLabeled(label?:string){
            this.type = MoveType.LABELED;
            this.label = label || null;
            this.probability = null;
        }
        /**Converts to a chance move with given probabilities */
        convertToChance(probability?:number){
            this.type = MoveType.CHANCE;
            this.probability = probability || 0;
            this.label = null;
        }
        /**Resets the move */
        convertToDefault(){
            this.type = MoveType.DEFAULT;
            this.probability = null;
            this.label = null;
        }
        /**Destroy method ensures there are no memory-leaks */
        destroy(){
            this.type = null;
            this.label = null;
            this.probability = null;
        }
    }
}