
module GTE{
    /**The class Payoff which is an array of numbers*/
    export class Payoffs{

        outcomes:Array<number>;
        private playersCount:number;

        constructor(payoffs?:Array<number>){
            this.outcomes = [];
            this.playersCount = 2;

            if(payoffs){
                this.outcomes = payoffs.slice(0);
            }
            else{
                this.outcomes = [0,0,0,0];
            }
        }

        loadFromString(payoffs:string){
            let payoffsAsStringArray = payoffs.split(" ");
            for (let i = 0; i < payoffsAsStringArray.length; i++) {
                if(i>3){
                    return;
                }
                let currentPayoff = parseInt(payoffsAsStringArray[i]);
                if(currentPayoff){
                    this.outcomes[i] = currentPayoff;
                }
            }
        }
        setPlayersCount(playersCount:number){
            this.playersCount = playersCount;
        }

        toString(){
            let numbersToShow = [];
            for (let i = 0; i < this.playersCount; i++) {
                numbersToShow.push(this.outcomes[i]);
            }
            return numbersToShow.join(" ");
        }

        destroy(){
            this.outcomes = null;
        }
    }
}