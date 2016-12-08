module GTE{
    export class Player{
        id:number;
        label: string;

        constructor(id?:number,label?:string){
            this.id = id || 0;
            this.label = label || "";
        }

        destroy(){
            this.label = null;
            this.id = null;
        }
    }
}