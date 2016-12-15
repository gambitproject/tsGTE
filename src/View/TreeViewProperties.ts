module GTE{
    //All properties are given a fractions of the game width or height!
    export class TreeViewProperties{
        levelHeight:number;
        initialLevelDistance:number;

        constructor(levelHeight:number, initialLevelDistance:number){
            this.levelHeight = levelHeight;
            this.initialLevelDistance = initialLevelDistance;
        }
    }
}