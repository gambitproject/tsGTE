module GTE {
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

        convertToLabeled(label?:string){
            this.type = MoveType.LABELED;
            this.label = label || null;
            this.probability = null;
        }

        convertToChance(probability?){
            this.type = MoveType.CHANCE;
            this.probability = probability || 0;
            this.label = null;
        }

        convertToDefault(){
            this.type = MoveType.DEFAULT;
            this.probability = null;
            this.label = null;
        }

        destroy(){
            this.type = null;
            this.label = null;
            this.probability = null;
        }
    }
}