var stage = new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick",stage);

var gameView = new createjs.Container();
gameView.x = 30;
gameView.y = 30;
temp = 1;
stage.addChild(gameView);

var circleArr = [[],[],[],[],[],[],[],[],[]];
var currentCat;

function circleClicked(event){
    if(event.target.getCircleType()!=3) {
        event.target.setCircleType(2);
    }

    var leftCircle = circleArr[currentCat.x - 1][currentCat.y];

    if(leftCircle.getCircleType() == 1){
        leftCircle.setCircleType(3);
        currentCat.setCircleType(1);
        currentCat = leftCircle;
    }
}
function move(event){
    if(event.keyCode===37){

    }
}

function addCircles(){
    for(var indexY=0;indexY<9;indexY++){
        for(var indexX=0;indexX<9;indexX++){
            var c = new Circle();
            gameView.addChild(c);
            circleArr[indexX][indexY] = c;
            c.x = indexY%2?indexX*55+25:indexX*55;
            c.y = indexY*55;

            if(indexX==4&&indexY==4){
                c.setCircleType(3)
                currentCat = c;
            }
            c.addEventListener("click",circleClicked);

        }
    }
    window.addEventListener("keydown",move);
}
addCircles();
