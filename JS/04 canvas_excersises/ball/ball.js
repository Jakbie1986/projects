const canvasElement = document.querySelector('#canvas');
const ctx = canvasElement.getContext('2d');
const r = 10;

class Ball {
    x = Math.floor(Math.random() * (canvasElement.width - 2 * r + 1)) + r;
    y = Math.floor(Math.random() * (canvasElement.height - 2 * r + 1)) + r;
    directionX = Math.random() > 0.5 ? 1 : -1;
    directionY = Math.random() > 0.5 ? 1 : -1;

    constructor(r, color){
        this.r = r,
        this.color = color
    }
    
}

const angleToRadian = (angle) => Math.PI / 180 * angle;

const balls = [];

for(let i = 0; i < 200; i++){
    balls.push(new Ball(10, '#' + (Math.random() * 16777215).toString(16).split('.')[0]));
}

const newBallPosition = () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    balls.forEach(ball => {
        ball.directionX = ball.x <= r || ball.x >= canvasElement.width - r ? ball.directionX * (-1) : ball.directionX;
        ball.directionY = ball.y <= r || ball.y >= canvasElement.height - r ? ball.directionY * (-1) : ball.directionY;
    
        ball.x = ball.x + (1 * ball.directionX);
        ball.y = ball.y + (1 * ball.directionY);
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, angleToRadian(360));
        ctx.fill();
        ctx.closePath();
    })
    

}

setInterval(newBallPosition, 1);