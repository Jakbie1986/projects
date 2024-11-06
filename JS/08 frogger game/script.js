
class Frog{
    size = 50;
    onLine = 6;
    
    constructor(canvasWidth, canvasHeight, ctx){
        this.x = canvasWidth / 2 - this.size / 2;
        this.y = canvasHeight - this.size;
        this.ctx = ctx;
        this.height = canvasHeight;
        this.width = canvasWidth;
        this.initEvents();
    }

    moveFrog = (e) => {
        if(e.key === 'ArrowUp' && this.y !== 0){
            this.y -= this.size;
            this.onLine -= 1
        } else if(e.key === 'ArrowDown' && this.y !== this.height - this.size){
            this.y += this.size;
            this.onLine += 1
        } else if(e.key === 'ArrowLeft' && this.x !== 0){
            this.x -= this.size;
        } else if(e.key === 'ArrowRight' && this.x !== this.width - 50) {
            this.x += this.size;
        }
    }

    drawFrog = () => {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    
    initEvents = () => {
        window.addEventListener('keydown', this.moveFrog);
    }
}

class Car {
    carHeight = 50;
    carWidth = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    spaceBehind = Math.floor(Math.random() *(250 - 150 + 1)) + 150;

    constructor(line, direction, ctx, speed = 3){
        this.ctx = ctx;
        this.line = line;
        this.direction = direction;
        this.speed = speed;
        this.startPosition = direction === -1 ? 550 : 0 - this.carWidth;
        this.renderCar();
    }

    renderCar = () => { 
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.startPosition, this.line, this.carWidth, this.carHeight);
    }    

    rideCar = (speed) => {
        this.startPosition += (speed * this.direction); 
        this.renderCar();  
    }
}

class Line {
    cars = [];
    
    constructor(line, direction){
        this.line = line;
        this.direction = direction;
    }
    deleteCar = () => {
        if(this.cars[0].startPosition + this.cars[0].carWidth < 0
            || this.cars[0].startPosition > 550
        ){
            this.cars.splice(0,1);
        }
    }
    createCar = (ctx, speed) => {
        if(this.cars.length === 0 
            || (this.direction === -1 && 550 - (this.cars.at(-1).startPosition + this.cars.at(-1).carWidth + this.cars.at(-1).spaceBehind) >= 0)
            || (this.direction === 1 && this.cars.at(-1).startPosition >= this.cars.at(-1).spaceBehind)){
            this.cars.push(new Car(this.line, this.direction, ctx));
        }
        this.cars.forEach(car => car.rideCar(speed)); 
        
        this.deleteCar(); 
    }
}

class Game {
    canvasElement = document.querySelector('#canvas');
    lines = {
        l1: new Line(50, 1),
        l2: new Line(100, -1),
        l3: new Line(150, 1),
        l4: new Line(200, -1),
        l5: new Line(250, 1),
        l6: new Line(300, -1),
    }
    interval;
    score = 0;
    speed = 3;

    constructor(){
        this.ctx = this.canvasElement.getContext('2d');
        this.frog = new Frog(this.canvasElement.width, this.canvasElement.height, this.ctx);

        this.initGame();
    } 
    
    drawLine = (x1, y1, x2, y2) => {
        this.ctx.beginPath();
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawBorderLine = () => {
        this.drawLine(0, 50, this.canvasElement.width, 50);
        this.drawLine(0, this.canvasElement.height - 50, this.canvasElement.width, canvas.height - 50);
    }

    addCars = () => {
        for(const prop in this.lines){
            this.lines[prop].createCar(this.ctx, this.speed)
        }
    } 

    resetGame = () => {
        this.frog = new Frog(this.canvasElement.width, this.canvasElement.height, this.ctx);
        this.score = 0;
        this.speed = 3;
        this.lines = {
            l1: new Line(50, 1),
            l2: new Line(100, -1),
            l3: new Line(150, 1),
            l4: new Line(200, -1),
            l5: new Line(250, 1),
            l6: new Line(300, -1),
        }

        this.initGame();
    }

    checkFrogPosition = () => {
        if((Object.values(this.lines)[this.frog.onLine]).cars.some(car => car.startPosition <= this.frog.x + this.frog.size && car.startPosition + car.carWidth >= this.frog.x)){
            clearInterval(this.interval);  
            this.resetGame(); 
        }
    }  

    nextLevel = () => {
        clearInterval(this.interval)
        this.score += 1;
        this.frog = new Frog(this.canvasElement.width, this.canvasElement.height, this.ctx);

        this.lines = {
            l1: new Line(50, 1),
            l2: new Line(100, -1),
            l3: new Line(150, 1),
            l4: new Line(200, -1),
            l5: new Line(250, 1),
            l6: new Line(300, -1),
        }

        this.initGame();
    }

    drawElementsInterval = () => {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.drawBorderLine();
        this.frog.drawFrog();
        this.addCars();
        if(this.frog.onLine >= 0 && this.frog.onLine <= 5){
            this.checkFrogPosition();
        } else if(this.frog.onLine < 0){
            this.nextLevel();
        }
    }

    gamingInterval = () => setInterval(this.drawElementsInterval, 100);

    initGame = () => {
        this.drawElementsInterval();
        this.interval = this.gamingInterval();
    }
}
new Game();

