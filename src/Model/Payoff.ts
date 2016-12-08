module GTE{
    export class Payoff{

        playerPayoffPairs: Array<{player:Player, payoff:number}>;

        constructor(players:Array<Player>, payoffs?:Array<number>){
            this.playerPayoffPairs = [];

            if(payoffs && payoffs.length!==players.length){
                throw new SyntaxError("Payoff number should be the same as the number of players.");
            }

            for (var i = 0; i < players.length; i++) {
                if(payoffs && payoffs[i]){
                    this.playerPayoffPairs.push({player:players[i],payoff:payoffs[i]});
                } else{
                    this.playerPayoffPairs.push({player:players[i],payoff:0});
                }

            }
        }

        destroy(){
            this.playerPayoffPairs = null;
        }
    }
}