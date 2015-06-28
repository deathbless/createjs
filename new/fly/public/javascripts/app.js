
var canvas = document.getElementById("cas");
canvas.height = 923;
var ctx = canvas.getContext('2d');

var img = new Image(),
    boomDom = document.getElementById("booms"),
    missleDom = document.getElementById("missle"),
    gS = document.getElementById("gameStart"),
    gss = document.getElementById("gs-start");

window.RAF = (function(){
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {window.setTimeout(callback, 1000 / 60); };
})();

Array.prototype.foreach = function(callback){
    for(var i=0;i<this.length;i++){
        callback.apply(this[i] , [i]);
    }
}

var sprites = [],
    missles = [],
    booms = [],
    badPlanNum = 5,
    point = 0,
    player1 = null,
    player2 = null,
    eatfood = null,
    foodDate = null,
    dieNum = 0;

window.onkeydown = function(event){
    socket.emit("keydown",player,event.keyCode);
}
socket.on("keydown",function(player,code){
    switch(code){
        //case 88:player1.fire = true;
        //break;
        case 90:player=='1'?player1.rotateLeft=true:player2.rotateLeft=true;
            break;
        case 67:player=='1'?player1.rotateRight=true:player2.rotateRight=true;
            break;
        case 37:player=='1'?player1.toLeft = true:player2.toLeft = true;
            break;
        case 38:player=='1'?player1.toTop = true:player2.toTop = true;
            break;
        case 39:player=='1'?player1.toRight = true:player2.toRight = true;
            break;
        case 40:player=='1'?player1.toBottom = true:player2.toBottom = true;
            break;
    }
});

window.onkeyup = function(event){
    socket.emit("keyup",player,event.keyCode);
}
socket.on("keyup",function(player,code){
    switch(code){
        //case 88:player1.fire = false;
        //break;
        case 90:player=='1'?player1.rotateLeft=false:player2.rotateLeft=false;
            break;
        case 67:player=='1'?player1.rotateRight=false:player2.rotateRight=false;
            break;
        case 37:player=='1'?player1.toLeft = false:player2.toLeft = false;
            break;
        case 38:player=='1'?player1.toTop = false:player2.toTop = false;
            break;
        case 39:player=='1'?player1.toRight = false:player2.toRight = false;
            break;
        case 40:player=='1'?player1.toBottom = false:player2.toBottom = false;
            break;
    }
});

//document.getElementById("god").onclick = function(){
//    if(player1){
//        player1.god = true;
//        player1.fireLevel = 4;
//        player1.firePerFrame = 10;
//    }
//}
//document.getElementById("verygod").onclick = function(){
//    if(player1){
//        player1.god = true;
//        player1.fireLevel = 10;
//        player1.firePerFrame = 10;
//    }
//}
//document.getElementById("pretygod").onclick = function(){
//    if(player1){
//        player1.god = true;
//        player1.fireLevel = 40;
//        player1.firePerFrame = 50;
//    }
//}
//document.getElementById("nogod").onclick = function(){
//    if(player1){
//        player1.god = true;
//        player1.fireLevel = 40;
//        player1.firePerFrame = 5;
//    }
//}

function boom(plan){
    for(var j=0;j<booms.length;j++){
        if(!booms[j].visible){
            booms[j].left = plan.left;
            booms[j].top = plan.top;
            booms[j].visible = true;

            var audio = document.getElementsByTagName("audio");
            for(var i=0;i<audio.length;i++){
                if(audio[i].src.indexOf("boom")>=0&&(audio[i].paused||audio[i].ended)){
                    audio[i].play();
                    break;
                }
            }
            break;
        }
    }
}
var foodtype = 1;
var stage = {
    init:function(){
        var _this = this;
        this.loading = new Loading(datas , canvas , function(){
            gS.style.display = "block";
            canvas.className = "showBg"
            document.getElementById("bgm").play();
            gss.addEventListener("click" , function(){
                socket.emit("start");
            },false)
            socket.on("start",function(){
                gS.style.display = "none";
                _this.addElement();
            })
        });
    },

    addElement:function(){
        for(var i=0;i<50;i++){
            var x = tempdata.a[i]*canvas.width;
            var y = tempdata.b[i]*2*canvas.height - canvas.height;
            var star = new Sprite("star" , starPainter , starBehavior);
            star.top = y;
            star.left = x;
            sprites.push(star);
        }

        for(var i=0;i<badPlanNum;i++){
            var x = tempdata.c[i]*(canvas.width-2*planSize().w)+planSize().w;
            var y = tempdata.d[i]*canvas.height - canvas.height;
            var badPlan = new Sprite("badPlan" , badPlanPainter , badPlanBehavior);
            badPlan.top = y;
            badPlan.left = x;
            sprites.push(badPlan);
        }

        for(var i=0;i<400;i++){
            var missle = new Sprite("missle" , misslePainter , missleBehavior);
            missle.visible = false;
            missles.push(missle);
        }

        for(var i=0;i<badPlanNum;i++){
            var img = new Image();
            img.src = "/images/explosion.png";
            var boom = new Sprite("boom" , new SpriteSheetPainter(explosionCells , false , function(){
                this.visible = false;
            } , img));
            boom.visible = false;
            booms.push(boom);
        }

        eatfood = new Sprite("food" , foodPainter , foodBehavior);
        eatfood.left = 1*canvas.width-60+30;
        eatfood.top = -30;
        eatfood.visible = false;
        sprites.push(eatfood)

        img.src = "/images/ship.png"
        player1 = new Sprite("plan" , new controllSpriteSheetPainter(planCells , img) , planBehavior);
        player2 = new Sprite("plan" , new controllSpriteSheetPainter(planCells , img) , planBehavior);
        player1.left = canvas.width/3;
        player2.left = canvas.width-canvas.width/3;
        player1.top = canvas.height-(planSize().h/2+10);
        player2.top = canvas.height-(planSize().h/2+10);
        sprites.push(player1);
        sprites.push(player2);
    },

    player1Reborn:function(player1){
        setTimeout(function(){
            player1.visible = true;
            player1.left = canvas.width/3;
            player1.top = canvas.height-(planSize().h/2+10);
//						player1.fireLevel = 1;
            player1.rotateAngle=0;
            player1.god = true;
            setTimeout(function(){
                player1.god = false;
            } , 5000)
        } , 1000)
    },
    player2Reborn:function(player2){
        setTimeout(function(){
            player2.visible = true;
            player2.left = canvas.width-canvas.width/3;
            player2.top = canvas.height-(planSize().h/2+10);
//						player2.fireLevel = 1;
            player2.rotateAngle=0;
            player2.god = true;
            setTimeout(function(){
                player2.god = false;
            } , 5000)
        } , 1000)
    },

    update:function(){
        var stage = this;
        var boomnum = 0,misslenum = 0;

        this.loading.loop();
        if(this.loading.getComplete()){
            ctx.clearRect(0,0,canvas.width,canvas.height);
        }
        missles.foreach(function(){
            var missle = this;
            sprites.foreach(function(){
                var bp = this;
                if(bp.name==="badPlan"&&bp.visible&&missle.visible){
                    var juli = Math.sqrt(Math.pow(missle.left-bp.left , 2)+Math.pow(missle.top-bp.top , 2));
                    if(juli<(planSize().w/2+missle.width/2) && missle.isgood){
                        missle.visible = false;
                        bp.blood-=50;
                        if(bp.blood<=0){
                            bp.visible = false;
                            point += bp.badKind;
                            boom(bp)
                        }
                    }
                }
            });

            if(missle.visible){
                if(!missle.isgood&&player1.visible&&!player1.god){
                    var juli = Math.sqrt(Math.pow(missle.left-player1.left , 2)+Math.pow(missle.top-player1.top , 2));
                    if(juli<(planSize().w/2+3)){
                        player1.visible = false;
                        dieNum++;
                        missle.visible = false;
                        boom(player1)
                        stage.player1Reborn(player1)
                    }
                }
                if(!missle.isgood&&player2.visible&&!player2.god){
                    var juli = Math.sqrt(Math.pow(missle.left-player2.left , 2)+Math.pow(missle.top-player2.top , 2));
                    if(juli<(planSize().w/2+3)){
                        player2.visible = false;
                        dieNum++;
                        missle.visible = false;
                        boom(player2)
                        stage.player2Reborn(player2)
                    }
                }
                misslenum++;
                this.paint();
            }
        });

        booms.foreach(function(){
            if(this.visible){
                boomnum++;
                this.paint();
            }
        })

        sprites.foreach(function(){
            if(this.name==="food"&&this.visible){
                var tjuli1 = Math.sqrt(Math.pow(this.left-player1.left , 2)+Math.pow(this.top-player1.top , 2));
                if(tjuli1<(player1.width/2+this.width/2)){
                    this.visible = false;
                    switch(this.kind){
                        case "LevelUP":player1.fireLevel = player1.fireLevel>=4?player1.fireLevel:player1.fireLevel+1;
                            break;
                        case "SpeedUP":player1.firePerFrame = player1.firePerFrame<=10?10:player1.firePerFrame-10;
                            break;
                        case "God":player1.god = true;setTimeout(function(){player1.god = false} , 5000);
                            break;
                        default:break;
                    }
                }
                var tjuli2 = Math.sqrt(Math.pow(this.left-player2.left , 2)+Math.pow(this.top-player2.top , 2));
                if(tjuli2<(player2.width/2+this.width/2)){
                    this.visible = false;
                    switch(this.kind){
                        case "LevelUP":player2.fireLevel = player2.fireLevel>=4?player2.fireLevel:player2.fireLevel+1;
                            break;
                        case "SpeedUP":player2.firePerFrame = player2.firePerFrame<=10?10:player2.firePerFrame-10;
                            break;
                        case "God":player2.god = true;setTimeout(function(){player2.god = false} , 5000);
                            break;
                        default:break;
                    }
                }
            }
            if(this.name==="badPlan"&&player1.visible&&!player1.god){
                var juli = Math.sqrt(Math.pow(this.left-player1.left , 2)+Math.pow(this.top-player1.top , 2));
                if(juli<planSize().w){
                    player1.visible = false;
                    dieNum++;
                    this.visible = false;
                    boom(this)
                    boom(player1)
                    stage.player1Reborn(player1);
                }
            }
            if(this.name==="badPlan"&&player2.visible&&!player2.god){
                var juli = Math.sqrt(Math.pow(this.left-player2.left , 2)+Math.pow(this.top-player2.top , 2));
                if(juli<planSize().w){
                    player2.visible = false;
                    dieNum++;
                    this.visible = false;
                    boom(this)
                    boom(player2)
                    stage.player2Reborn(player2);
                }
            }

            this.paint();
        });

        if(player1){
            ctx.fillStyle="#FFF"
            ctx.font="18px 微软雅黑";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            if(player == 1) {
                ctx.fillText("Level:"+(player1.fireLevel===4?"Max":player1.fireLevel)+"        Speed:"+((80-player1.firePerFrame)===70?"Max":(80-player1.firePerFrame)) , 0 , canvas.height-18);
            }
            else if(player == 2){
                ctx.fillText("Level:"+(player2.fireLevel===4?"Max":player2.fireLevel)+"        Speed:"+((80-player2.firePerFrame)===70?"Max":(80-player2.firePerFrame)) , 0 , canvas.height-18);
            }

            ctx.fillText("两人总分数:"+point+"     死亡次数:"+dieNum, 0 , 18);
            ctx.textAlign = "right";
            ctx.fillText("上下左右移动 ，Z和C键旋转" , canvas.width-10 , 18);

            if(foodDate===null){
                foodDate = new Date();
            }else {
                var nowFoodDate = new Date();
                if(nowFoodDate-foodDate>100){
                    var createFood = 1;
                    if(createFood&&!eatfood.visible){
                        eatfood.left = 0.5*canvas.width-60+30;
                        eatfood.top = -30;
                        if(foodtype == 1){
                            eatfood.kind = "LevelUP";
                        }
                        else if(foodtype == 2){
                            eatfood.kind = "SpeedUP";
                        }
                        else if(foodtype == 3){
                            eatfood.kind = "God";
                        }
                        foodtype ++;
                        if(foodtype == 4){
                            foodtype = 1;
                        }
                        eatfood.visible = true;
                    }
                    foodDate = nowFoodDate;
                }
            }
        }

        boomDom.innerHTML = "爆炸使用率(已使用/存储总量):"+boomnum+"/"+booms.length;
        missleDom.innerHTML = "子弹使用率(已使用/存储总量):"+misslenum+"/"+missles.length;
    },

    loop:function(){
        var _this = this;
        this.update();
        RAF(function(){
            _this.loop();
        });
    },

    start:function(){
        this.init();
        this.loop();
    }
}

stage.start();
