module GTE{
    export class Player{
        id:number;
        label: string;
        color: number;

        constructor(id?:number,label?:string, color?:number){
            this.id = id || 0;
            this.label = label || "";
            this.color = color || 0x000000;
        }

        getLabel(){
            return this.label;
        }

        destroy(){
            this.label = null;
            this.id = null;
        }
    }
}