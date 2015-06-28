/**
 * Created by deathbless on 2015/6/28 0028.
 */
var stage=new createjs.Stage("gameView");
var image=new createjs.Bitmap("image/bg1.jpg");

stage.addChild(image);
var fps = new createjs.Text("fps","36px Arial","#FFF");
var shape = new createjs.Sprite(boomsheet,"boom");
var plan = new createjs.Sprite(plansheet,"fire");
var plan1 = new createjs.Sprite(plansheet,"fire");
var name = new createjs.Text("test","36px Arial","#FFF");
plan.x = 100;plan.y = 100;
plan1.x = 200;plan1.y = 200;
stage.update();
stage.addChild(fps);
stage.addChild(shape);
stage.addChild(plan);
stage.addChild(plan1);

function tick(event){
    fps.text = Math.round(createjs.Ticker.getMeasuredFPS())+" fps";
    stage.update();
}
//

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick",tick);


//stage.addEventListener("click",function(event){
//    alert(event.stageX+','+event.stageY);
//})
/*
createjs.SpriteSheetUtils.addFlippedFrames(mansheet, true, false, false);
var fps = new createjs.Text("fuck you","36px Arial","#000");
fps.x = 0;
fps.y = 20;


stage.addChild(fps);
var shape = new createjs.Sprite(mansheet,"run");
shape.play();

shape.x = 0;
shape.y = 0;
shape.toleft = false;
shape.toright = false;
shape.toup = false;
shape.todown = false;
shape.goleft = false;
shape.goright = false;
shape.vx = 5;
shape.vy = 5;
//shape.graphics.beginFill("red").drawRect(0,0,50,50);
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick",tick);
window.addEventListener("keydown",keydown);
window.addEventListener("keyup",keyup);
function keydown(event){
    event = event||window.event;

    switch(event.keyCode){
        case 37:shape.toleft = true;shape.goleft = true;
            if(shape.goright){
                shape.x += 64;
                shape.goright = false;
            }
            shape.gotoAndPlay("run_h");
            break;
        case 38:shape.toup = true;
            break;
        case 39:shape.toright = true;shape.goright = true;
            if(shape.goleft){
                shape.x -= 64;
                shape.goleft = false;
            }
            shape.gotoAndPlay("run");
            break;
        case 40:shape.todown = true;
            break;
    }
    stage.update();
}
function keyup(event){
    event = event||window.event;
    switch(event.keyCode){
        case 37:shape.toleft = false;
            break;
        case 38:shape.toup = false;
            break;
        case 39:shape.toright = false;
            break;
        case 40:shape.todown = false;
            break;
    }
    stage.update();
}
function tick(event){
    fps.text = Math.round(createjs.Ticker.getMeasuredFPS())+" fps";
    if(shape.x>stage.canvas.width){
        shape.x=0;
    }
    if(shape.y>stage.canvas.height){
        shape.y=0;
    }
    if(shape.x < 0){
        shape.x=stage.canvas.width;
    }
    if(shape.y < 0){
        shape.y=stage.canvas.height;
    }

    if(shape.toleft){
        shape.x -= shape.vx;
    }
    if(shape.toright){
        shape.x += shape.vx;
    }
    if(shape.toup){
        shape.y -= shape.vy;
    }
    if(shape.todown){
        shape.y += shape.vy;
    }
    stage.update();
}
stage.addChild(shape);
stage.update();
*/