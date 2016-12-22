/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>

module GTE {
    export class NodeView extends Phaser.Sprite {
        game: Phaser.Game;
        node: Node;

        inputHandler: Phaser.Signal;
        label: Phaser.Text;
        isSelected: boolean;
        private circle: Phaser.Sprite;
        private square: Phaser.Sprite;
        //Horizontal offset: -1 for left, 1 for right;
        private labelHorizontalOffset: number;

        constructor(game: Phaser.Game, node: Node, x?: number, y?: number) {
            super(game, x, y, "");
            this.isSelected = false;
            this.anchor.set(0.5, 0.5);
            this.scale.set(OVERLAY_SCALE, OVERLAY_SCALE);
            this.inputEnabled = true;
            this.node = node;
            if (this.node.owner) {
                this.tint = node.owner.color;
            }
            else {
                this.tint = 0x000000;
            }

            this.labelHorizontalOffset = 1;
            this.createSprites();
            this.createLabel();

            this.inputHandler = new Phaser.Signal();
            this.game.add.existing(this);
        }

        private createSprites() {
            this.circle = this.game.add.sprite(this.x, this.y, this.game.cache.getBitmapData("node-circle"));
            this.square = this.game.add.sprite(this.x, this.y, this.game.cache.getBitmapData("line"));
            this.circle.position = this.position;
            this.square.position = this.position;
            this.circle.tint = this.tint;
            this.square.tint = 0x000000;
            this.square.width = this.circle.width;
            this.square.height = this.circle.height;
            this.square.alpha = 0;
            this.circle.anchor.set(0.5, 0.5);
            this.square.anchor.set(0.5, 0.5);

            this.events.onInputOver.add(() => this.inputHandler.dispatch(this, "inputOver"));
            this.events.onInputOut.add(() => this.inputHandler.dispatch(this, "inputOut"));
            this.events.onInputDown.add(() => this.inputHandler.dispatch(this, "inputDown"));
        }

        private createLabel() {
            this.label = this.game.add.text(this.x + this.labelHorizontalOffset * this.circle.width,
                this.y - this.circle.width, "", null);

            if (this.node.owner) {
                this.label.setText(this.node.owner.getLabel(),true);
            }
            else {
                this.label.text = "";
            }

            // this.label.position = this.position.add(this.labelHorizontalOffset*this.circle.width,this.y-this.circle.width);
            this.label.fontSize = this.circle.width * LABEL_SIZE;
            this.label.fill = this.tint;
            this.label.anchor.set(0.5, 0.5);
        }

        setPosition(x: number, y: number) {
            this.position.set(x, y);
            this.label.position.set(this.x + this.labelHorizontalOffset * this.circle.width,
                this.y - this.circle.width);
        }

        setColor(tint: number) {
            this.circle.tint = tint;
            // this.square.alpha = alpha;
        }

        resetNodeDrawing() {
            this.setLabelText();
            //Selected and not Chance
            if (this.isSelected && this.node.type!==NodeType.CHANCE) {
                this.circle.alpha = 1;
                this.circle.tint = NODE_SELECTED_COLOR;
                this.square.alpha = 0;
            }
            // Selected and Chance
            else if(this.isSelected && this.node.type===NodeType.CHANCE){
                this.circle.alpha = 0;
                this.square.alpha = 1;
                this.square.tint = NODE_SELECTED_COLOR;
            }
            // Not Selected, owned and not Chance
            else if (this.node.owner && this.node.type!==NodeType.CHANCE) {
                this.circle.tint = this.node.owner.color;
                this.circle.alpha = 1;
                this.square.alpha = 0;
            }
            // Not selected, owned and chance
            else if(this.node.owner && this.node.type===NodeType.CHANCE){
                this.square.tint = 0x000000;
                this.square.alpha = 1;
                this.circle.alpha = 0;
            }
            // All other cases
            else {
                this.circle.tint = 0x000000;
                this.square.alpha = 0;
                this.circle.alpha = 1;
            }
        }

        setLabelText() {
            if (this.node.owner && this.node.type!==NodeType.CHANCE) {
                this.label.alpha = 1;
                this.label.setText(this.node.owner.getLabel(), true);
                let colorRGB = Phaser.Color.getRGB(this.node.owner.color);
                this.label.fill = Phaser.Color.RGBtoString(colorRGB.r,colorRGB.g,colorRGB.b);
            }
            else{
                this.label.alpha = 0;
            }
        }

        setLabelOffset() {
            //TODO: Implement this
        }

        destroy() {
            this.node.destroy();
            this.node = null;
            this.circle.destroy();
            this.circle = null;
            this.square.destroy();
            this.square = null;
            this.label.destroy();
            this.label = null;
            this.tint = null;
            this.scale = null;
            this.labelHorizontalOffset = null;
            this.inputHandler.dispose();
            this.inputHandler = null;
            super.destroy();
        }
    }
}