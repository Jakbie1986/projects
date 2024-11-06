
class Paint {
    isPainting = false;
    startX;
    startY;
    action = "paint";

    elements = {
        color: document.querySelector('#color'),
        bgColor: document.querySelector('#bgColor'),
        pencil: document.querySelector('#paint'),
        eraserBtn: document.querySelector('#erase'),
        cleaner: document.querySelector('#cleaner'),
        size: document.querySelector('#size'),
        x: document.querySelector('#width'),
        y: document.querySelector('#height'),
        updateBtn: document.querySelector('#updateBtn'),
        canvasElement: document.querySelector('#canvas'),
        toolSize: document.querySelector('#toolSize'),
        eraser: document.querySelector('.eraser')
    }

    constructor(){
        this.ctx = this.elements.canvasElement.getContext('2d'),

        this.setCanvasSize();
        this.initEvents();
    }

    setCanvasSize = () => {
        this.elements.canvasElement.width = this.elements.x.value;
        this.elements.canvasElement.height = this.elements.y.value;
    }

    moveEraser = (e) => {
        if(e.target.id !== "canvas"){
            this.elements.eraser.style.display = 'none'
            return
        }
        
        this.elements.eraser.style.top = `${e.offsetY}px`;
        this.elements.eraser.style.left = `${e.offsetX}px`;
        this.elements.eraser.style.height = `${this.elements.size.value}px`;
        this.elements.eraser.style.width = `${this.elements.size.value}px`;
        this.elements.eraser.style.display = 'block';
    }

    setAction =(e) => {
        this.action = e.target.id;

        if(this.action === "erase"){
            window.addEventListener('mousemove', this.moveEraser);
        } else {
            this.elements.eraser.style.display = 'none';
            window.removeEventListener('mousemove', this.moveEraser);
        }
    }

    setToolsSize = () => {
        this.ctx.lineWidth = this.elements.size.value;
        this.ctx.lineCap = 'round';
        this.elements.toolSize.innerText = this.elements.size.value;
    }

    setColor = () => {
        this.ctx.strokeStyle = this.elements.color.value;
    }

    setBgColor = () => {
        this.ctx.fillStyle = this.elements.bgColor.value;
        this.ctx.fillRect(0, 0, this.elements.canvasElement.width, this.elements.canvasElement.height);
    }

    clearTable = () => {
        this.ctx.clearRect(0, 0, this.elements.canvasElement.width, this.elements.canvasElement.height);
        this.elements.bgColor.value = "#ffffff";
    }

    painting = (e) => {
        if(e.target.id !== "canvas"){
            this.startX = e.offsetX > 0 ? e.offsetX : 0;
            this.startY = e.offsetY > 0 ? e.offsetY : 0;
            return
        }

        this.ctx.beginPath();
        this.ctx.lineTo(this.startX, this.startY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
        this.ctx.closePath();
        
        this.startX = e.offsetX > 0 ? e.offsetX : 0;
        this.startY = e.offsetY > 0 ? e.offsetY : 0;
        console.log(this.startX, this.startY)
    }

    erase = (e) => {
        if(e.target.id !== "canvas"){
            this.startX = e.offsetX > 0 ? e.offsetX : 0;
            this.startY = e.offsetY > 0 ? e.offsetY : 0;
            return
        }

        this.ctx.clearRect(this.startX, this.startY, this.elements.size.value, this.elements.size.value);

        this.startX = e.offsetX > 0 ? e.offsetX : 0;
        this.startY = e.offsetY > 0 ? e.offsetY : 0;
    }

    startPainting = (e) => {
        console.log('start');
        this.isPainting = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;

        window.addEventListener('mousemove', this.action === "paint" ? this.painting : this.erase);
    }

    stopPainting = (e) => {
        this.isPainting = false;

        window.removeEventListener('mousemove', this.action === "paint" ? this.painting : this.erase);
    }


    initEvents = () => {
        this.elements.updateBtn.addEventListener('click', this.setCanvasSize);
        this.elements.pencil.addEventListener('click', this.setAction);
        this.elements.eraserBtn.addEventListener('click', this.setAction);
        this.elements.size.addEventListener('change', this.setToolsSize);
        this.elements.color.addEventListener('change', this.setColor);
        this.elements.bgColor.addEventListener('change', this.setBgColor);
        this.elements.cleaner.addEventListener('click', this.clearTable);
        this.elements.canvasElement.addEventListener('mousedown', this.startPainting);
        window.addEventListener('mouseup', this.stopPainting);
    }
}

const paint = new Paint();