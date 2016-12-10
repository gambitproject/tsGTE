module GTE {
    export class NodeView {
        game: Phaser.Game;
        node: Node;
        x: number;
        y: number;

        //The overlay is used to detect actions on the sprite
        overlay:Phaser.Sprite;
        circle: Phaser.Sprite;
        square: Phaser.Sprite;
        label: Phaser.Text;
        //Horizontal offset: -1 for left, 1 for right;
        labelHorizontalOffset:number;
        tint: number;
        scale: number;

        inputHandler:Phaser.Signal;

        signal: Phaser.Signal;

        constructor(game: Phaser.Game, node: Node, x?: number, y?: number) {
            this.game = game;
            this.node = node;
            this.x = x || 0;
            this.y = y || 0;
            if(this.node.owner) {
                this.tint = Phaser.Color.hexToRGB(node.owner.color);
            }
            else{
                this.tint = Phaser.Color.hexToRGB("#000");
            }
            this.labelHorizontalOffset = -1;

            this.createSprites();
            this.createLabel();

            this.inputHandler = new Phaser.Signal();
        }

        private createSprites(){
            this.circle = this.game.add.sprite(this.x,this.y,this.game.cache.getBitmapData("node-circle"));
            this.square = this.game.add.sprite(this.x,this.y,this.game.cache.getBitmapData("node-square"));
            this.circle.tint = this.tint;
            this.square.tint = this.tint;
            this.square.alpha = 0;
            this.circle.anchor.set(0.5,0.5);
            this.square.anchor.set(0.5,0.5);
            this.circle.scale.set(1/NODE_SCALE,1/NODE_SCALE);
            this.square.anchor.set(1/NODE_SCALE,1/NODE_SCALE);

            this.overlay = this.game.add.sprite(this.x,this.y,"");
            this.overlay.width = this.circle.width*OVERLAY_SCALE;
            this.overlay.height = this.circle.width*OVERLAY_SCALE;
            this.overlay.anchor.set(0.5,0.5);
            this.overlay.inputEnabled = true;

            this.overlay.events.onInputOver.add(()=>this.inputHandler.dispatch(this,"inputOver"));
            this.overlay.events.onInputOut.add(()=>this.inputHandler.dispatch(this,"inputOut"));
            this.overlay.events.onInputDown.add(()=>this.inputHandler.dispatch(this,"inputDown"));
        }

        private createLabel(){
            this.label = this.game.add.text(this.x+this.labelHorizontalOffset*this.circle.width,
                this.y-this.circle.width, "",null);
            if(this.node.owner){
                this.label.text = this.node.owner.label;
            }
            else{
                this.label.text = "A";
            }
            this.label.fontSize = this.circle.width*LABEL_SIZE;
            this.label.fill = this.tint;
            this.label.anchor.set(0.5,0.5);
        }

        destroy(){
            this.node.destroy();
            this.circle.destroy();
            this.square.destroy();
            this.label.destroy();
            this.x=null;
            this.y=null;
            this.tint=null;
            this.scale=null;
            this.labelHorizontalOffset=null;
        }
    }
}