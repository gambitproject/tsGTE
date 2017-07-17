/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/StrategicForm.ts"/>
///<reference path="../Utils/SCell.ts"/>
///<reference path="../Utils/Constants.ts"/>
module GTE {
    export class StrategicFormView {
        game: Phaser.Game;

        strategicForm: StrategicForm;
        rows: Array<String>;
        cols: Array<String>;

        group: Phaser.Group;
        cells: Array<SCell>;
        diagonalLine: Phaser.Sprite;
        p1Text: Phaser.Text;
        p2Text: Phaser.Text;

        constructor(game: Phaser.Game, strategicForm: StrategicForm) {
            this.game = game;
            this.strategicForm = strategicForm;

            this.group = this.game.add.group();
            this.rows = strategicForm.strategies[0];
            this.cols = strategicForm.strategies[1];
            this.cells = [];


            this.group.scale.set(0.35);
            this.group.position.set(this.game.width * 0.75, this.game.height * 0.1);

            let cellWidth = this.game.width * CELL_WIDTH;
            let cellStroke = cellWidth * CELL_STROKE_WIDTH;

            this.generateGrid(cellWidth, cellStroke);
            this.drawDiagonalLine(cellWidth, cellStroke);
            this.createPlayerTexts(cellWidth);
            this.createStrategiesTexts(cellWidth);
        }

        generateGrid(cellWidth: number, cellStroke: number) {
            for (let i = 0; i < this.rows.length; i++) {
                for (let j = 0; j < this.cols.length; j++) {
                    this.cells.push(new SCell(this.game, j * (cellWidth - 0.5 * cellStroke), i * (cellWidth - 0.5 * cellStroke), this.group));
                }
            }
        }

        drawDiagonalLine(cellWidth: number, cellStroke: number) {
            this.diagonalLine = this.game.add.sprite(0, 0, this.game.cache.getBitmapData("line"), null, this.group);
            this.diagonalLine.scale.set(cellWidth * 0.75, cellStroke * 0.5);
            this.diagonalLine.anchor.set(CELL_STROKE_WIDTH, 0.5);
            this.diagonalLine.tint = 0x000000;
            this.diagonalLine.rotation = -Math.PI * 0.75;
        }

        createPlayerTexts(cellWidth: number) {
            let diagonalWidth = cellWidth * 0.75;
            let lineWidth = diagonalWidth / Math.sqrt(2);
            console.log(lineWidth);
            this.p1Text = this.game.add.text(-0.75 * lineWidth, -0.25 * lineWidth, this.strategicForm.tree.players[1].label, null, this.group);
            this.p1Text.anchor.set(0.5, 0.5);
            this.p1Text.fontSize = diagonalWidth*PLAYER_TEXT_SIZE;
            this.p1Text.fill = Phaser.Color.getWebRGB(PLAYER_COLORS[0]);

            this.p2Text = this.game.add.text(-1 / 4 * lineWidth, -3 / 4 * lineWidth, this.strategicForm.tree.players[2].label, null, this.group);
            this.p2Text.anchor.set(0.5, 0.5);
            this.p2Text.fontSize = diagonalWidth*PLAYER_TEXT_SIZE;
            this.p2Text.fill = Phaser.Color.getWebRGB(PLAYER_COLORS[1]);
        }

        createStrategiesTexts(cellWidth:number){

        }
    }
}