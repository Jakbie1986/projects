class LetterButtons {
    elements = {
        lettersDiv: document.querySelector('#letters')
    }

    getAsciCode = (checkMethod) => {
        for(let i = 65; i <= 90; i++){
            const letterButton = document.createElement('button');
            letterButton.addEventListener('click', checkMethod);
            letterButton.innerText = String.fromCharCode(i);
            this.elements.lettersDiv.append(letterButton);
        }
    }
    
    cleanLettersDiv = () => this.elements.lettersDiv.innerHTML = '';

    disabledLetttersButtons = () => this.elements.lettersDiv.querySelectorAll('button').forEach(btn => btn.disabled = true);
}

class Clue {
    items = ['JAKUB', 'MICHAL', 'AUTOBUS', 'DRZEWO', 'CHOINKA', 'LUTY', 'SZUBIENICA', 'BANANY', 'OWOCE', 'MALINY', 'MARCHEWKA', 'POMIDORY', 'WARSZAWA', 'HIPOPOTAM']

    elements = {
        clueDiv: document.querySelector('#clue')
    }

    chooseItems = () => {
        this.clue = this.items[Math.floor(Math.random() * this.items.length)]
        this.elements.clueDiv.innerText = ''.padStart(this.clue.length, '_');
    }
}

class Game {
    elements = {
        startBtn: document.querySelector('#startGame'),
        chanceNumber: document.querySelector('#chance')
    }
    constructor () {
        this.renderLetters = new LetterButtons();
        this.clue = new Clue();
        this.newGame();      
    }

    isFinish = () => {
        this.elements.chanceNumber.innerText = 'Gra zakończona';
        this.clue.elements.clueDiv.innerText = this.clue.clue;
        this.elements.startBtn.style.display = 'block';
        this.renderLetters.disabledLetttersButtons();
    } 

    goodLetter = (e) => {
        this.clue.elements.clueDiv.innerText = this.clue.clue.split('').map((item, index) => item === e.target.innerText ? item : this.clue.elements.clueDiv.innerText[index]).join('');
        e.target.disabled = true; 
        this.clue.elements.clueDiv.innerText === this.clue.clue ? this.isFinish() : '';
    }

    wrongLetter = (e) => {
        e.target.disabled = true;
        this.elements.chanceNumber.innerText --;
        this.elements.chanceNumber.innerText == 0 ? this.isFinish() : '';
    }
    
    checkLetter = (e) =>  this.clue.clue.includes(e.target.innerText) ? this.goodLetter(e) : this.wrongLetter(e);

    start = () => {
        this.renderLetters.cleanLettersDiv();
        this.elements.startBtn.style.display = 'none';
        this.renderLetters.getAsciCode(this.checkLetter);
        this.clue.chooseItems();
        this.elements.chanceNumber.innerText = 5;
    }

    newGame = () => this.elements.startBtn.addEventListener('click', this.start)
}

const startGameClass = new Game;

