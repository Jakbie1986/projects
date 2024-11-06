//https://fakestoreapi.com/products

//Komponenty
// AllProducts - wyswietla wszystkie produkty
// Product - wyswietla pojedynczy produkt
// ProductTitle - wyswietla nazwe produktu
// ProductPrice - wyswietla cene produktu
// ProductImage - wyswietla zdjecie produktu

class AllProducts extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        this._shadowRoot.appendChild(document.querySelector('#template').content.cloneNode(true));
    }

    renderProduct = product => {
        const productElement = document.createElement('product-item');
        productElement.setAttribute('title', product.title);
        productElement.setAttribute('price', product.price);
        productElement.setAttribute('image', product.image);

        this._shadowRoot.querySelector('ul').append(productElement);
    }

    getProducts = async () => {
        const request = await fetch('https://fakestoreapi.com/products');
        const response = await request.json();
        response.forEach(product => this.renderProduct(product));
        
    }

    connectedCallback(){
       this.getProducts();
    }
}

class Product extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        this._shadowRoot.appendChild(document.querySelector('#product').content.cloneNode(true));
    }

    renderDetails = () => {
    
        const titleElement = document.createElement('product-title');
        titleElement.setAttribute('title', this.getAttribute('title'));
        
        const priceElement = document.createElement('product-price');
        priceElement.setAttribute('price', this.getAttribute('price'));
        
        const imageElement = document.createElement('product-image');
        imageElement.setAttribute('image', this.getAttribute('image'));
        
        this._shadowRoot.querySelector('li').append(titleElement, priceElement, imageElement);


    }
    connectedCallback(){
        this.renderDetails();
    }
}


class ProductTitle extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        this._shadowRoot.appendChild(document.querySelector('#productTitle').content.cloneNode(true));
    }

    connectedCallback(){
        this._shadowRoot.querySelector('h2').innerText = this.getAttribute('title');
    }
}


class ProductPrice extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        this._shadowRoot.appendChild(document.querySelector('#productPrice').content.cloneNode(true));
    }

    connectedCallback(){
        console.log('sss')
        this._shadowRoot.querySelector('h3').innerText = this.getAttribute('price');
    }
}

class ProductImage extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open',
        });
        this._shadowRoot.appendChild(document.querySelector('#productImage').content.cloneNode(true));
    }

    connectedCallback(){
        this._shadowRoot.querySelector('img').src = this.getAttribute('image');
    }
}

window.customElements.define('product-title', ProductTitle);
window.customElements.define('product-price', ProductPrice);
window.customElements.define('product-image', ProductImage);
window.customElements.define('product-item', Product);
window.customElements.define('all-products', AllProducts);
