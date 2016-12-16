module GTE {
    export class NodeView extends Phaser.Sprite {
        game: Phaser.Game;
        node: Node;

        inputHandler: Phaser.Signal;
        label: Phaser.Text;
        private circle: Phaser.Sprite;
        private square: Phaser.Sprite;
        //Horizontal offset: -1 for left, 1 for right;
        private labelHorizontalOffset: number;

        constructor(game: Phaser.Game, node: Node, x?: number, y?: number) {
            super(game, x, y, "");
            this.anchor.set(0.5, 0.5);
            this.scale.set(OVERLAY_SCALE, OVERLAY_SCALE);
            this.inputEnabled = true;
            this.node = node;
            if (this.node.owner) {
                this.tint = Phaser.Color.hexToRGB(node.owner.color);
            }
            else {
                this.tint = Phaser.Color.hexToRGB("#000");
            }
            this.labelHorizontalOffset = 1;

            this.createSprites();
            this.createLabel();

            this.inputHandler = new Phaser.Signal();
            this.game.add.existing(this);
        }

        private createSprites() {
            this.circle = this.game.add.sprite(this.x, this.y, this.game.cache.getBitmapData("node-circle"));
            this.square = this.game.add.sprite(this.x, this.y, this.game.cache.getBitmapData("node-square"));
            this.circle.position = this.position;
            this.square.position = this.position;
            this.circle.tint = this.tint;
            this.square.tint = this.tint;
            this.square.alpha = 0;
            this.circle.anchor.set(0.5, 0.5);
            this.square.anchor.set(0.5, 0.5);
            this.circle.smoothed = true;

            this.events.onInputOver.add(() => this.inputHandler.dispatch(this, "inputOver"));
            this.events.onInputOut.add(() => this.inputHandler.dispatch(this, "inputOut"));
            this.events.onInputDown.add(() => this.inputHandler.dispatch(this, "inputDown"));
        }

        private createLabel() {
            this.label = this.game.add.text(this.x + this.labelHorizontalOffset * this.circle.width,
                this.y - this.circle.width, "", null);
            if (this.node.owner) {
                this.label.text = this.node.owner.label;
            }
            else {
                this.label.text = "A";
            }
            // this.label.position = this.position.add(this.labelHorizontalOffset*this.circle.width,this.y-this.circle.width);
            this.label.fontSize = this.circle.width * LABEL_SIZE;
            this.label.fill = this.tint;
            this.label.anchor.set(0.5, 0.5);
        }

        setPosition(x:number,y:number){
            this.position.set(x,y);
            this.label.position.set(this.x + this.labelHorizontalOffset * this.circle.width,
                this.y - this.circle.width);
        }

        setAlpha(alpha:number){
            this.circle.alpha = alpha;
            // this.square.alpha = alpha;
            this.label.alpha = alpha;
        }

        setLabelOffset(){
            //TODO: Implement this
        }

        destroy() {
            this.node.destroy();
            this.node=null;
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