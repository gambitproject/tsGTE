module GTE {
    export class Boot extends Phaser.State {
        bmd: Phaser.BitmapData;
        logoGroup:Phaser.Group;
        point1: Phaser.Sprite;
        point2: Phaser.Sprite;
        point3: Phaser.Sprite;
        line1:Phaser.Sprite;
        line2:Phaser.Sprite;
        text:Phaser.Text;
        distance:number;
        radius:number;

        create() {
            this.radius = this.game.height*0.018;
            this.distance = this.game.height*0.15;
            this.createPoint();
            this.createLine();
            this.game.stage.backgroundColor = "#fff";

            this.logoGroup = this.game.add.group();
            this.logoGroup.x = this.game.width/2 - 3*this.distance;
            this.logoGroup.y = this.game.height/2 - this.distance;

            this.point1 = this.game.add.sprite(this.distance+this.radius,this.radius,this.game.cache.getBitmapData("point"),null,this.logoGroup);
            this.point2 = this.game.add.sprite(this.point1.x-this.distance,this.point1.y+this.distance,this.game.cache.getBitmapData("point"),null,this.logoGroup);
            this.point3 = this.game.add.sprite(this.point1.x+this.distance,this.point1.y+this.distance,this.game.cache.getBitmapData("point"),null,this.logoGroup);

            this.point1.anchor.set(0.5,0.5);
            this.point2.anchor.set(0.5,0.5);
            this.point3.anchor.set(0.5,0.5);
            this.point1.scale.set(0,0);
            this.point2.scale.set(0,0);
            this.point3.scale.set(0,0);

            this.line1 = this.game.add.sprite(this.point2.x,this.point2.y,this.game.cache.getBitmapData("line"),null,this.logoGroup);
            this.line1.anchor.set(0,0.5);
            this.line2 = this.game.add.sprite(this.point1.x,this.point1.y,this.game.cache.getBitmapData("line"),null,this.logoGroup);
            this.line2.anchor.set(0,0.5);
            this.line1.scale.set(0,5);
            this.line2.scale.set(0,5);
            this.line1.rotation = -Math.PI*0.25;
            this.line2.rotation = Math.PI*0.25;

            this.text = this.game.add.text(this.point1.x+this.distance*3,this.point1.y+this.distance/2,"GTE", {font: "26px Arial"},this.logoGroup);
            this.text.addColor("#f00",1);
            this.text.addColor("#00f",2);
            this.text.fontWeight = "bolder";
            this.text.fontSize = this.game.height*0.15;
            this.text.anchor.set(0.5,0.5);
            this.text.alpha = 0;

            this.game.add.tween(this.text).to({alpha:1},400,Phaser.Easing.Default,true);
            this.game.add.tween(this.point1.scale).to({x:1,y:1},400,Phaser.Easing.Back.Out,true,400+Math.random()*400);
            this.game.add.tween(this.point2.scale).to({x:1,y:1},400,Phaser.Easing.Back.Out,true,400+Math.random()*400);
            this.game.add.tween(this.point3.scale).to({x:1,y:1},400,Phaser.Easing.Back.Out,true,400+Math.random()*400);
            this.game.add.tween(this.line1.scale).to({x:this.distance*1.44},400,Phaser.Easing.Default,true,1000);
            this.game.add.tween(this.line2.scale).to({x:this.distance*1.44},400,Phaser.Easing.Default,true,1400);
        }

        createPoint() {
            this.bmd = this.game.make.bitmapData(this.game.height*0.04,this.game.height*0.04, "point", true);
            this.bmd.ctx.fillStyle = "#000000";
            this.bmd.ctx.arc(this.bmd.width/2,this.bmd.height/2,this.radius,0,Math.PI*2);
            this.bmd.ctx.fill();
        }


        createLine(){
            this.bmd = this.game.make.bitmapData(1,1, "line", true);
            this.bmd.ctx.fillStyle = "#000000";
            this.bmd.ctx.fillRect(0,0,1,1);
        }
    }
}