const canvasElement = document.querySelector('#canvas');
const ctx = canvasElement.getContext('2d');

class SnakePart {
    previuosPositionX;
    previuosPositionY;

    constructor(x, y, size) {
        this.x = x,
        this.y = y
        this.size = size;
    }

    drawElement = () => ctx.fillRect(this.x, this.y, this.size, this.size);
    
    changePosition = (head, parts) => {
        this.previuosPositionX = this.x;
        this.previuosPositionY = this.y;

        const partIndex = parts.indexOf(this);

        if(partIndex === 0){
            parts[partIndex].x = head.x;
            parts[partIndex].y = head.y;
        }
        else{
            this.x = parts[partIndex - 1].previuosPositionX;
            this.y = parts[partIndex - 1].previuosPositionY;    
        }

        
        this.drawElement();
    }
}

class SnakeHead extends SnakePart {
    direction = 'right';

    constructor(x, y, size) {
        super(x,y, size)
    }

    checkHeadPosition = () => {
        if(this.x > canvasElement.width - this.size){
            this.x = this.x - canvasElement.width;
        }
        else if(this.x < 0){
            this.x = this.x + canvasElement.width;
        }

        if(this.y > canvasElement.height - this.size){
            this.y = this.y - canvasElement.height;
        }
        else if(this.y < 0){
            this.y = this.y + canvasElement.height
        } 
    }

    setPosition = () => {
        if(this.direction === 'up'){
            this.y = this.y - this.size;
        } else if (this.direction === 'right'){
            this.x = this.x + this.size;
        } else if(this.direction === 'down'){
            this.y = this.y + this.size;
        } else if (this.direction === 'left'){
            this.x = this.x - this.size;
        } 

        this.drawElement();
    }

    changeDirection = (e) => { 
        if(e.key.includes('Arrow')){
            const newDirection = e.key.replace('Arrow', "").toLowerCase();

            if((newDirection === 'left' || newDirection === 'right') && this.direction !== 'left' && this.direction !== 'right'){
                this.direction = newDirection;
            }else if ((newDirection === 'up' || newDirection === 'down') && this.direction !== 'up' && this.direction !== 'down'){
                this.direction = newDirection;
            }
        }
    }
}

class SnakeFood {
    constructor (size) {
        this.size = size;

        this.rows = canvas.width / size;
        this.columns = canvas.height / size;

        this.getRandomFoodPosition();
    }

    
    getRandomFoodPosition = () => {
        this.x = (Math.floor(Math.random() * (this.columns - 1)) + 1) * this.size;
        this.y = (Math.floor(Math.random() * (this.rows - 1)) + 1) * this.size;
    }

    drawFood = () => ctx.fillRect(this.x, this.y, this.size, this.size);  
}

class Game{
    size = 10;
    head = new SnakeHead(300, 200, 10);
    parts = [new SnakePart(290,200, 10), new SnakePart(280,200, 10)];
    food = new SnakeFood(10);

    constructor(){
        this.initEvents();

        this.parts.forEach(element => element.drawElement());
        this.food.drawFood();
    }

    gameInterval = () => {
        this.eatFood();
        this.eatSelf();
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        this.parts.forEach(element => element.changePosition(this.head, this.parts));

        this.head.setPosition();
        this.head.checkHeadPosition();
        this.food.drawFood();
    }

    eatFood = () => {
        if(this.food.x === this.head.x && this.food.y === this.head.y){
            this.parts.push(new SnakePart(this.parts[this.parts.length-1].x, this.parts[this.parts.length-1].y, this.size));
            this.food.getRandomFoodPosition();
        }
    }

    initEvents = () => {
        setInterval(this.gameInterval, 300);
        window.addEventListener('keydown', this.head.changeDirection);
    }

    eatSelf = () => {
        if(this.parts.some(element => element.x === this.head.x && element.y === this.head.y)){
            this.parts = [new SnakePart(290,200, 10), new SnakePart(280,200, 10)];
            // this.initEvents();
        }
    }
}

const game = new Game();
document.querySelector('#test').addEventListener('click', game.gameInterval);