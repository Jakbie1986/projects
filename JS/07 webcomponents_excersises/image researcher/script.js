//Stworz wyszukiwarkę zdjęć w oparciu o API pixabay
//Wyszukiwarka ma składać się z trzech komponentów:
//SearchComponent - komponent w którym znajduje się input oraz przycisk do szukania (komponent wywołany w body)
//SearchResults - komponent w którym znajduje się lista wyszukanych obrazków lub błąd jeśli nie zostanie
//znaleziony żaden obrazek spełniający warunek (komponent wywołany w body)
//SearchResult - komponent w którym wyświetlone będzie pojedyńcze znalezione zdjęcie (wyświetlamy obrazek i nazwę autora,
// komponent wyświetlany wewnątrz SearchResults)

//Dokumentacja API: https://pixabay.com/api/docs/
//API-Key: 21079566-6ab3ea15a2cffc0110cdf35cc

class SearchComponent extends HTMLElement{
    numberOfPage = 1;
    totalPages = 0;

    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        this._shadowRoot.appendChild(document.querySelector('#search').content.cloneNode(true));
    }

    fetchFromApi = async () => {
        const inputElement = this._shadowRoot.querySelector('input');
        const key = '21079566-6ab3ea15a2cffc0110cdf35cc';

        const request = await fetch(`https://pixabay.com/api/?key=${key}&q=${inputElement.value}&page=${this.numberOfPage}`);
        const response = await request.text();
        
        document.querySelector('#all-items').setAttribute('text', response);

        this.totalPages = Math.ceil(JSON.parse(response).totalHits / 20);
        if(JSON.parse(response).totalHits < 20){
            return;
        }

        this._shadowRoot.querySelector('#setPages').style.display = 'block';
        this._shadowRoot.querySelector('#currentPage').innerText = `Strona ${this.numberOfPage} z ${this.totalPages}`
        this._shadowRoot.querySelector('#previousPage').disabled = this.numberOfPage === 1 ? true : false;
        this._shadowRoot.querySelector('#nextPage').disabled = this.numberOfPage === this.totalPages ? true : false;

       
    }

    searchElements = () => {
        this.numberOfPage = 1;
        this.fetchFromApi();
    }


    setNumberOfPage = (e) => {
        if(e.target.id === 'previousPage' && this.numberOfPage > 1) {
            this.numberOfPage--;
            console.log(this.numberOfPage)
        }else if(e.target.id === 'nextPage' && this.numberOfPage < this.totalPages) {
            this.numberOfPage++;
        }
        this.fetchFromApi();
    }
    
    initEvent = () => {
        const buttonElement = this._shadowRoot.querySelector('#searchButton');
        buttonElement.addEventListener('click', this.searchElements);

        const previousPageBtn = this._shadowRoot.querySelector('#previousPage');
        previousPageBtn.addEventListener('click', this.setNumberOfPage);

        const nextPageBtn = this._shadowRoot.querySelector('#nextPage');
        nextPageBtn.addEventListener('click', this.setNumberOfPage);
    }

    connectedCallback(){
        this.initEvent();
    }
}

class SearchResults extends HTMLElement{
    static get observedAttributes(){
        return ['text'];
    }

    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        
        this._shadowRoot.appendChild(document.querySelector('#results').content.cloneNode(true));
    }

    renderItem = (item) => {
        const itemElement = document.createElement('item-element');
        itemElement.setAttribute('imageUrl', item.previewURL);
        itemElement.setAttribute('userName', item.user);

        this._shadowRoot.querySelector('ul').append(itemElement);
    }

    changeToJson = () => {
        this._shadowRoot.querySelector('ul').innerHTML = '';

        const items = JSON.parse(this.getAttribute('text'));

        console.log(items)

        if(items.total === 0){
            this._shadowRoot.querySelector('#not-results').style.display = 'block';
        } else {
            this._shadowRoot.querySelector('#not-results').style.display = 'none';
            items.hits.forEach(item => this.renderItem(item));
        }
    }

    connectedCallback(){
        
    }

    attributeChangedCallback(name, oldValue, newValue){
        this.changeToJson();
    }
}

class SearchResult extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        this._shadowRoot.appendChild(document.querySelector('#item').content.cloneNode(true));
    }

    renderItemDetails = () => {
        const liElement = document.createElement('li');

        const imageElement = document.createElement('img');
        imageElement.setAttribute('src', this.getAttribute('imageUrl'));

        const userNameElement = document.createElement('p');
        userNameElement.innerText = this.getAttribute('userName');
    
        liElement.append(imageElement, userNameElement);

        this._shadowRoot.append(liElement);
    }

    connectedCallback(){


        this.renderItemDetails();
    }
}

window.customElements.define('search-elements', SearchComponent);
window.customElements.define('all-items', SearchResults);
window.customElements.define('item-element', SearchResult);