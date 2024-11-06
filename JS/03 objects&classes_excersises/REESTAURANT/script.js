class Dish {
    constructor (name, isVegetarian, isVegan, description, price, category) {
        this.name = name;
        this.isVegetarian = isVegetarian;
        this.isVegan = isVegan;
        this.description = description;
        this.price = price;
        this.category = category;
    }
}

class Cart {
    items = [];
  
    elements = {
        cartDiv: document.querySelector('#cart'),
        cartList: document.querySelector('#cartList'),
        cartCost: document.querySelector('#cartCost'),
    }
    constructor(){
        this.showItemsEvent();
    }

    addToCart = (e, dish) => {
        this.items.push(dish);
        const parent = e.target.parentElement;

        parent.querySelector('button').remove();
        const inCart = this.createElement('p', 'W koszyku');
        
        parent.append(inCart);
    }

    createElement = (selector, content, event = null) => {
        const element = document.createElement(selector);
        element.innerText = content;
        element.addEventListener('click', event);
        return element;
    }
  
    changeQuantity  = (e, price) => {
       const quantitySpan = e.target.parentElement.querySelector('span');
        let quantity = Number(quantitySpan.innerText);
        if(e.target.innerText === '-' && quantity > 1){
            quantity -= 1;
        } else if(e.target.innerText === '+'){
            quantity += 1;
        }
        quantitySpan.innerText = quantity;
        e.target.closest('li').querySelector('p').innerText = `${price * quantity} $`;

        this.totalCost();
    }

    removeProduct = (e, item) => {
        console.log(item)
        e.target.parentElement.remove();
        this.items.splice(this.items.indexOf(item), 1);
        this.totalCost();
    }

    renderItem = item => {
        const itemElement = this.createElement('li', '');
        const nameOfDish = this.createElement('h2', item.name);

        const priceOfDish = document.createElement('p');
        priceOfDish.innerText = `${item.price} $`;
        
        const quantityDiv = this.createElement('div', 'Ilość:');
        const lessBtn = this.createElement('button', '-', (e) => this.changeQuantity(e, item.price));
        const moreBton = this.createElement('button', '+', (e) => this.changeQuantity(e, item.price));
        const quantityOfProducts = this.createElement('span', '1');
        quantityDiv.append(lessBtn, quantityOfProducts, moreBton);

        const removeFromCart = this.createElement('button', 'Usuń z koszyka', (e) => this.removeProduct(e, item));

        itemElement.append(nameOfDish, quantityDiv, priceOfDish, removeFromCart);        
        this.elements.cartList.append(itemElement);        
    }
    
    totalCost = () => {
        let sum = 0;
        cartList.querySelectorAll('p').forEach(cost => sum += Number(cost.innerText.replace(' $', '')));
   
        return this.elements.cartCost.innerText = `Całkowita wartość koszyka: ${sum} $`;
    }

    showItems = () => {
        this.elements.cartList.innerHTML = '';
        this.items.forEach(item => this.renderItem(item));
        document.querySelector('#dishes').style.display = 'none';
        this.elements.cartDiv.style.display = 'block';
        this.totalCost();
    }

    showItemsEvent = () => {
        const cartButton = document.querySelector('#cartBtn');
        cartButton.addEventListener('click', this.showItems);
    }
}

class Menu {
    elements = {
        list: document.querySelector('#dishes')
    }

    cart = new Cart();

    constructor(){
        this.renderCategoriesButtons();
    }

    createElement = (selector, text = '', event = null) => {
        const htmlElement = document.createElement(selector);
        htmlElement.innerText = text; 
        htmlElement.addEventListener('click', event);
        return htmlElement;
    }
    
    renderDish = (dish) => {
        const nameElement = this.createElement('h2', dish.name); 
        const veganElement = this.createElement('p', `Is vegan: ${dish.isVegan ? 'Yes' : 'No'}`); 
        const descriptionElement = this.createElement('p', dish.description);
        const priceElement = this.createElement('h3', `${dish.price} $`);
        let addToCartElement;
        if(this.cart.items.indexOf(dish) > -1){
            addToCartElement = this.createElement('p', 'W koszyku');
        } else {
            addToCartElement = this.createElement('button', 'Add to cart', (e) => this.cart.addToCart(e, dish));
        }
        
        const liElement = this.createElement('li');
        liElement.append(nameElement, veganElement, descriptionElement, priceElement, addToCartElement);
        this.elements.list.append(liElement); 
    }
    
    renderDishes = (e) => {
        this.elements.list.style.display = 'block';
        this.elements.list.innerHTML = '';
        const dishes = menu[e.target.innerText];
        dishes.forEach(dish => this.renderDish(dish));
        document.querySelector('#cart').style.display = 'none';
    }

    renderCategoriesButtons = () => {
        const menuCategories = document.querySelector('#categories');
        Object.getOwnPropertyNames(menu).forEach(category => {           
            const menuButton = document.createElement('button');
            menuButton.innerText = category;
            menuButton.addEventListener('click', this.renderDishes);
            menuCategories.append(menuButton);
        });
    }
}

new Menu();

