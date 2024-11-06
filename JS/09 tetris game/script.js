
class Block {
    size = 25;
    bottomPosition = 75;
    direction = 'vertical';

    constructor(ctx, width, height, speed){
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    recalculateCorners = () => this.corners = this.corners.map(el => [this.centerPoint.x + el[0], this.centerPoint.y + el[1]]);
    
    drawBlock = () => {
        this.corners.forEach(corner => {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.centerPoint.x + corner[0], this.centerPoint.y + corner[1], this.size, this.size)
        });
    }

    setLeftPosition = () => this.corners.some(corner => this.centerPoint.x + corner[0] === 0);

    setRightPosition = () => this.corners.some(corner => this.centerPoint.x + corner[0] === this.width - this.size);
  
    setBottomPosition = () => {
        const lowestCorner = this.corners.map(el => el[1]).sort((a,b) => b - a)[0];
        this.bottomPosition = this.centerPoint.y + lowestCorner + this.size;
    }

    newPosition = () => {
        if(this.bottomPosition >= this.height){
            return
        }
        this.centerPoint.y += this.size;
        this.setBottomPosition();
    }

    moveBlock = (speed = this.speed) => {
        this.interval = setInterval(this.newPosition, speed);
    }

    stopMovingBlock = () => {
        clearInterval(this.interval);
    }

    turnUp = () => {
        if(this.centerPoint.x === 12.5){
            this.centerPoint.x += this.size;
        } else if(this.width - this.centerPoint.x === 12.5){
            this.centerPoint.x -= this.size;
        }

        this.corners.forEach((corner, index) => {
            this.corners[index] = [-(corner[1] + this.size), corner[0]];
        });
        this.direction = this.direction === 'vertical' ? 'horizontal' : 'vertical';
        this.setBottomPosition();
        this.drawBlock();
    }

    turnRight = () => {
        if(this.setRightPosition()){
            return
        }
        this.centerPoint.x += this.size;
        this.drawBlock();
    }

    turnLeft = () => {
        if(this.setLeftPosition()){
            return
        }
        this.centerPoint.x -= this.size;
        this.drawBlock();
    }

    initEvents = () => {
        this.moveBlock();
    }
}


class LeftL extends Block {
    centerPoint = {x: 187.5, y: 1.5 * this.size};
    color = 'blue';
    corners = [
        [-0.5 * this.size, -1.5 * this.size],
        [-0.5 * this.size, -0.5 * this.size],
        [-0.5 * this.size, 0.5 * this.size],
        [-1.5 * this.size, 0.5 * this.size]
    ]; 

    constructor(ctx, width, height, speed){
        super(ctx, width, height, speed);
        this.initEvents();
    }
}

class RightL extends Block {
    centerPoint = {x: 162.5, y: 1.5 * this.size};
    color = 'green';
    corners = [
        [-0.5 * this.size, -1.5 * this.size],
        [-0.5 * this.size, -0.5 * this.size],
        [-0.5 * this.size, 0.5 * this.size],
        [0.5 * this.size, 0.5 * this.size]
    ]; 

    constructor(ctx, width, height, speed){
        super(ctx, width, height, speed);
        this.initEvents();
    }
}

class Line extends Block {
    centerPoint = {x: 175, y: 2 * this.size};
    color = 'yellow';
    corners = [
        [0, -2 * this.size],
        [0, -1 * this.size],
        [0, 0],
        [0, this.size]
    ]; 

    constructor(ctx, width, height, speed){
        super(ctx, width, height, speed);
        this.initEvents();
    }
}

class Square extends Block {
    centerPoint = {x: 175, y: this.size};
    color = 'red';
    corners = [
        [-this.size, -this.size],
        [0, -this.size],
        [-this.size, 0],
        [0, 0]
    ]; 

    constructor(ctx, width, height, speed){
        super(ctx, width, height, speed);
        this.initEvents();
    }
}

class LeftZ extends Block {
    centerPoint = {x: 162.5, y: 1.5 * this.size};
    color = 'grey';
    corners = [
        [0.5 * this.size, -1.5 * this.size],
        [0.5 * this.size, -0.5 * this.size],
        [-0.5 * this.size, -0.5 * this.size ],
        [-0.5 * this.size, 0.5 * this.size]
    ]; 

    constructor(ctx, width, height, speed){
        super(ctx, width, height, speed);
        this.initEvents();
    }
}

class RightZ extends Block {
    centerPoint = {x: 187.5, y: 1.5 * this.size};
    color = 'pink';
    corners = [
        [-1.5 * this.size, -1.5 * this.size],
        [-1.5 * this.size, -0.5 * this.size],
        [-0.5 * this.size, -0.5 * this.size ],
        [-0.5 * this.size, 0.5 * this.size]
    ]; 

    constructor(ctx, width, height, speed){
        super(ctx, width, height, speed);
        this.initEvents();
    }
}

class Game {
    canvasElement = document.querySelector('#tetris');
    blocks = [];
    score = 0;
    level = 1;
    arrangedLines = 0;
    speed = 800;

    constructor() {
        this.ctx = this.canvasElement.getContext('2d');
        this.initEvents();
    }

    checkAddingIsNotPossible = (chosenBlock) => {
        return chosenBlock.corners.some(corner => {            
            return (this.blocks.map(el => el.corners).flat().some(item => item[0] === chosenBlock.centerPoint.x + corner[0]  && item[1] === chosenBlock.centerPoint.y + corner[1]))
        });
    }

    putTheLastBlock = (chosenBlock) => {

        if(this.blocks.at(-1).corners.some(corner => corner[1] === 0)){
            clearInterval(this.intervalMode);
            window.removeEventListener('keydown', this.setAction);
            setTimeout(()=>this.summaryGame(), 2000);
            return;
        }

        chosenBlock.centerPoint.y -= 25;
        this.checkAddingIsNotPossible(chosenBlock) ? this.putTheLastBlock(chosenBlock) : this.stopGame(chosenBlock);
    }

    summaryGame = () => {
        if(confirm(`Gra zakończona. Twój wynik to ${this.score}. Kliknij OK aby zagrać ponownie`)){
            this.blocks = [];
            this.score = 0;
            this.level = 1;
            this.arrangedLines = 0;
            this.speed = 800;
            this.initEvents();    
        }
    }

    stopGame = (chosenBlock) => {
        clearInterval(this.intervalMode);
        window.removeEventListener('keydown', this.setAction);
        this.block = chosenBlock;
        this.block.drawBlock()
        setTimeout(()=>this.summaryGame(), 2000);
    }

    drawNewBlock = () => {
        const blocksToRandom = [LeftL, RightL, Square, Line, LeftZ, RightZ];
        const chosenBlock = new blocksToRandom[Math.floor(Math.random() * blocksToRandom.length)](this.ctx, this.canvasElement.width, this.canvasElement.height, this.speed);
 
        if(!this.checkAddingIsNotPossible(chosenBlock)){
            this.block = chosenBlock;
        } else {
            this.putTheLastBlock(chosenBlock);
        }
    }

    drawAllBlock = () => {
        this.blocks.forEach(block => {
            block.corners.forEach(corner =>{
                this.ctx.fillStyle = block.color;
                this.ctx.fillRect(corner[0], corner[1], 25, 25);
            });
        })
    }

    moveDownBlocks = (line) => {
        this.blocks.forEach(item => item.corners.map(corner => {
            if(corner[1] < line){
                corner[1] += 25; 
            }
        }));
    }

    checkLine = () => {
        const arrayOfLinesPosition = (this.blocks.at(-1).corners.map(el=>el[1]).flat().filter((item, index, self) => self.indexOf(item) === index)); //określa które linie są brane pod uwagę
        let lines = [];

        arrayOfLinesPosition.forEach((el) => {
            const blocksInLine = this.blocks.filter(obiekt => obiekt.corners.some(item => item[1] === el));
            if(blocksInLine.map(element => element.corners.filter(item => item[1] === el)).flat().length === 14){
                blocksInLine.forEach(blockInLine => blockInLine.corners = blockInLine.corners.filter(item => item[1] !== el));

                lines.push(el);
            }
        });

        if(lines.length > 0){
            this.calculateScore(lines.length);
            lines.sort((a,b) => b-a).forEach((line, index) => this.moveDownBlocks(line + index * 25));
        }
    }

    stopBlock = () => {
        this.block.stopMovingBlock();
        this.block.recalculateCorners();
        this.blocks.push(this.block);
        this.checkLine();

        this.drawNewBlock();
    }
    addToScore = (score) => {
        this.score += score;
    }

    calculateScore = (quantity) => {
        console.log('calculateScore')
        if(quantity === 1){
            this.addToScore(50);
        } else if(quantity === 2){
            this.addToScore(150)
        } else if(quantity === 3){
            this.addToScore(300)
        } else if(quantity === 4){
            this.addToScore(600)
        }

        this.arrangedLines += quantity;   
        if(this.arrangedLines / 25 >= this.level){
            this.level += 1;
            this.speed -= 50;
        }

    }

    checkEndingPositionOfBlock = () => {
        if( this.block.bottomPosition === this.canvasElement.height){
            this.addToScore(5);
            return this.stopBlock();
        };

        this.block.corners.forEach(corner => {
            if(this.blocks.map(el=>el.corners).flat().find(item => item[0] === this.block.centerPoint.x + corner[0] && item[1] ===  this.block.centerPoint.y + corner[1] + this.block.size)){
                this.stopBlock()
            }
        });
    } 

    setAction = (e) => {
        if(e.key === 'ArrowDown'){
            this.block.newPosition();
            return this.checkEndingPositionOfBlock();
        } else if(e.key === ' '){
            this.block.stopMovingBlock();
            this.block.moveBlock(10);
            return this.checkEndingPositionOfBlock();
        }

        const cannotMove = this.block.corners.some(corner => {
            let addToX = 0;
            let addToY = 0;
            if(e.key === 'ArrowUp' && this.block.direction === 'vertical'){
                addToX = - (corner[1] + this.block.size);
                addToY = corner[0];
            } else if(e.key === 'ArrowRight') {
                addToX = corner[0] + this.block.size;
                addToY = corner[1];
            } else if(e.key === 'ArrowLeft'){
                addToX = corner[0] - this.block.size;
                addToY = corner[1];
            } 
            
            if(this.blocks.map(el => el.corners).flat().some(item => item[0] === this.block.centerPoint.x + addToX && item[1] === this.block.centerPoint.y + addToY)){
                return true;
            }
        });

        if(cannotMove){
            return
        }

        this.block[`${e.key.replace('Arrow', 'turn')}`]();
    }

    updatingGame = () => {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.clientHeight );
        this.block.drawBlock();
        this.checkEndingPositionOfBlock();
        this.drawAllBlock();
    }

    gamingInterval = () => {
       this.intervalMode = setInterval(this.updatingGame, 10); 
    }

    initEvents = () => {
        this.drawNewBlock();
        window.addEventListener('keydown', this.setAction);
        this.gamingInterval();
    }
}
new Game;
