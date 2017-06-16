/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Node.ts"/>

module GTE {
    /** A class for the graphical representation of the Node. The inherited sprite from Phaser.Sprite will not be visible
     * and will only detect input on the node. The private fields circle and square are the visible ones, depending on whether
     * the node (of type Node) is chance or not. */
    export class NodeView extends Phaser.Sprite {
        game: Phaser.Game;
        node: Node;

        //The input handler will fire signals when the node is pressed, hovered and unhovered on
        label: Phaser.Text;
        isSelected: boolean;
        level:number;
        private circle: Phaser.Sprite;
        private square: Phaser.Sprite;
        private previewSelected:Phaser.Sprite;
        //Horizontal offset: -1 for left, 1 for right;
        private labelHorizontalOffset: number;

        constructor(game: Phaser.Game, node: Node, x?: number, y?: number) {
            super(game, x, y, "");
            this.isSelected = false;
            this.anchor.set(0.5, 0.5);
            this.scale.set(OVERLAY_SCALE, OVERLAY_SCALE);
            this.inputEnabled = true;
            this.node = node;
            this.level = this.node.depth;
            if (this.node.owner) {
                this.tint = node.owner.color;
            }
            else {
                this.tint = 0x000000;
            }

            this.labelHorizontalOffset = 1;
            this.createSprites();
            this.attachSignals();
            this.createLabel();

            this.game.add.existing(this);
        }

        /** A method which creates the circle and square sprites*/
        private createSprites() {
            this.circle = this.game.add.sprite(this.x, this.y, this.game.cache.getBitmapData("node-circle"));
            this.circle.anchor.set(0.5, 0.5);
            this.circle.position = this.position;
            this.circle.tint = this.tint;

            this.square = this.game.add.sprite(this.x, this.y, this.game.cache.getBitmapData("line"));
            this.square.position = this.position;
            this.square.tint = 0x000000;
            this.square.width = this.circle.width;
            this.square.height = this.circle.height;
            this.square.alpha = 0;
            this.square.anchor.set(0.5, 0.5);

            this.previewSelected = this.game.add.sprite(this.x,this.y, this.game.cache.getBitmapData("node-circle"));
            this.previewSelected.scale.set(1.8,1.8);
            this.previewSelected.tint = SELECTION_INNER_COLOR;
            this.previewSelected.position = this.position;
            this.previewSelected.alpha = 0;
            this.previewSelected.anchor.set(0.5,0.5);
        }

        /** A method which attaches signals when a specific input is triggered over a node
         * The signal itself returns a reference to the triggered node and the specific action.
         * The TreeController class will listen for these signals and act accordingly.*/
        private attachSignals(){
            this.events.onInputOver.dispatch(this);
            this.events.onInputOut.dispatch(this);
            this.events.onInputDown.dispatch(this);
        }

        /** A method which creates the label for the Node*/
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

        /** A method which sets the position of the node to a specific x and y coordinate*/
        setPosition(x: number, y: number) {
            this.position.set(x, y);
            // this.updateLabelPosition();
        }

        updateLabelPosition() {
            if(this.node.parent && this.node.parent.children.indexOf(this.node)<this.node.parent.children.length/2){
                this.labelHorizontalOffset=-1;
            }
            else{
                this.labelHorizontalOffset=1;
            }
            this.label.position.set(this.x + this.labelHorizontalOffset * this.circle.width,
                this.y - this.circle.width);
        }

        /**A method which changes the colour of the circle sprite*/
        setColor(tint: number) {
            this.circle.tint = tint;
            // this.square.alpha = alpha;
        }

        /** A method which converts the node, depending on whether it is a chance, owned or default.*/
        resetNodeDrawing() {
            this.setLabelText();
            //Selected and not Chance
            if (this.isSelected && this.node.type!==NodeType.CHANCE) {
                this.circle.alpha = 1;
                this.circle.tint = NODE_SELECTED_COLOR;
                this.square.alpha = 0;
                this.previewSelected.alpha = 0.3;
            }
            // Selected and Chance
            else if(this.isSelected && this.node.type===NodeType.CHANCE){
                this.circle.alpha = 0;
                this.square.alpha = 1;
                this.square.tint = NODE_SELECTED_COLOR;
                this.previewSelected.alpha = 0.3
            }
            // Not Selected, owned and not Chance
            else if (this.node.owner && this.node.type!==NodeType.CHANCE) {
                this.circle.tint = this.node.owner.color;
                this.circle.alpha = 1;
                this.square.alpha = 0;
                this.previewSelected.alpha = 0;
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
                this.previewSelected.alpha = 0;
            }
        }

        /** A method which sets the label text as the owner label*/
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

        /** The destroy method of the node which prevents memory-leaks*/
        destroy() {
            // this.node.destroy();
            this.node = null;
            this.circle.destroy();
            this.circle = null;
            this.square.destroy();
            this.square = null;
            this.previewSelected.destroy();
            this.previewSelected = null;
            this.label.destroy();
            this.label = null;
            this.tint = null;
            this.scale = null;
            this.labelHorizontalOffset = null;
            super.destroy();
        }
    }
}