class Square {
    squaresElement = document.querySelector('#squares');

    constructor(){
        this.render();
    }

    render = () => {
        this.squareElement = document.createElement('div');
        this.squareElement.classList.add('square');
        this.squaresElement.append(this.squareElement);
    }
}

class Game {
    chance = 3;
    score = 0;
    time = 60;
    squares = [];
    drawnSquare;
    isClicked = false;
    intervalTime = 3000;

    elements = {
        chanceElement: document.querySelector('#chance'),
        scoreElement: document.querySelector('#score'),
        timeElement: document.querySelector('#time'),
        startBtn: document.querySelector("#start"),
        resetBtn: document.querySelector('#reset')
    }

    constructor(){
        this.renderBoard();
        this.setData();
        this.initEvents();
    }

    setData = () => {
        this.setTime();
        this.setScore();
        this.setChance();
    }

    setTime = () => this.elements.timeElement.innerText = this.time;
    setScore = () => this.elements.scoreElement.innerText = this.score;
    setChance = () => this.elements.chanceElement.innerText = this.chance;

    renderBoard = () => {
        for(let i = 0; i <= 24; i++){
            this.squares.push(new Square());
        }
    }
    
    drawSquare = () => {
        const chairsArray = ['a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const choosenElement = this.squares[Math.floor(Math.random() * this.squares.length)];
        if(choosenElement === this.drawnSquare){
            return this.drawSquare();
        }
        let color = '#';
        for(let i = 0; i <= 5; i++){
            color += chairsArray[Math.floor(Math.random() * chairsArray.length)];
        }

        this.drawnSquare = choosenElement;
        this.drawnSquare.squareElement.style.backgroundColor = color;
    }

    stopGame = (message) => {
        alert(message);
        this.resetGame();
    }

    runTimer = () => {
        this.time --;
        this.setTime();
        if(this.time <= 0) {
           this.stopGame('Gra zakończona - koniec czasu');
        }
    };

    timer = () => this.runTimerInteval = setInterval(this.runTimer, 1000);
    
    runDrawingInterval = () => {
        setTimeout(() => this.drawnSquare.squareElement.removeAttribute('style'), this.intervalTime - 1000);

        this.drawSquareInterval = setInterval(() => {
            this.drawnSquare.squareElement.removeAttribute('style');
            this.isClicked = false;
            this.drawSquare();

            setTimeout(() => this.drawnSquare.squareElement.removeAttribute('style'), this.intervalTime - 1000);

        }, this.intervalTime);               
    }
 
    resetInterval = () => {
        clearInterval(this.drawSquareInterval);
        this.intervalTime -= 300;
        this.runDrawingInterval();
    }

    checkClickedSquare = (e) => {
        if(this.isClicked === true){
            return
        }
        if(e.target === this.drawnSquare.squareElement){
            this.score++;
            this.setScore();
            this.time++;
            
            if(this.score > 0 && this.score % 2 === 0){
                this.resetInterval()
            }
        } else {
            this.chance--;

            if(this.chance === 0){
                this.stopGame('Koniec gry - liczba żyć wynosi 0');
            }

            this.setChance();
        }    

        this.isClicked = true;
    }

    startGame = () => {
        this.elements.startBtn.removeEventListener('click', this.startGame);  
        this.elements.startBtn.disabled = true;
        this.drawSquare();
        this.runDrawingInterval();
        this.timer();
        this.squares.forEach(el => el.squareElement.addEventListener('click', this.checkClickedSquare))
    }

    resetGame = () => {
        clearInterval(this.drawSquareInterval);
        clearInterval(this.runTimerInteval);

        this.squares.forEach(el => el.squareElement.removeEventListener('click', this.checkClickedSquare))

        this.chance = 3;
        this.score = 0;
        this.time = 60;
        this.isClicked = false;
        this.intervalTime = 3000;


        this.drawnSquare.squareElement.removeAttribute('style');
        this.setData();   
        this.elements.startBtn.disabled = false;
        this.elements.startBtn.addEventListener('click', this.startGame); 
    }

    initEvents = () => {
        this.elements.startBtn.addEventListener('click', this.startGame);
        this.elements.resetBtn.addEventListener('click', this.resetGame);
    }
}

new Game();
