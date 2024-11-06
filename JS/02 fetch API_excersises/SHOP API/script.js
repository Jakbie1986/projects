//https://api.escuelajs.co/api/v1/products

const createHTMLElement = (tag, text, classes = []) => {
    const element = document.createElement(tag);
    element.innerText = text;
    classes.forEach(item => element.classList.add(item))
    return element;
}

const createProducts = (products) => {
    const productsContainer = document.querySelector('#products_container');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productBox = createHTMLElement('article','', ['product']);
        
        const imgContainer = createHTMLElement('div', '', );
        product.images.forEach(el => {
            const image = createHTMLElement('img','',['img_width']);
            image.setAttribute('src', el);
            imgContainer.appendChild(image);
        });

        productBox.append(
            imgContainer,
            createHTMLElement('h3', product.title, ['title-text']), 
            createHTMLElement('p', product.description), 
            createHTMLElement('p', product.price + ' PLN'), 
            createHTMLElement('p', product.category.name),
        );

        productsContainer.appendChild(productBox);
    });
    productsContainer.innerHTML === '' ? productsContainer.innerText = 'Brak produktów spełniających kryteria': '';
}

const categoriesSelectInput = document.querySelector('#categoriesSelect');

const shop = async () => {
    const price_min = document.querySelector('#price_min').value;
    const price_max = document.querySelector('#price_max').value;
    
    let filters = '';
    if(price_min !== '' && price_max !== ''){
        filters = `?price_min=${price_min}&price_max=${price_max}`;
    }

    if(categoriesSelectInput.value !== '-1'){
        filters += (filters === '' ? '?' : '&') + 'categoryId=' + categoriesSelectInput.value;
    }

    const request = await fetch('https://api.escuelajs.co/api/v1/products' + filters);
    const products = await request.json();

    createProducts(products);
}

shop();

//https://api.escuelajs.co/api/v1/categories


const categories = async () => {
    const conectCategories = await fetch('https://api.escuelajs.co/api/v1/categories');
    const getCategories = await conectCategories.json();


    getCategories.forEach(category => {
        const selectOption = document.createElement('option');
        selectOption.setAttribute('value', category.id);
        selectOption.innerText = category.name;

        categoriesSelectInput.appendChild(selectOption);
    })
}

categories();

categoriesSelectInput.addEventListener('change', shop);

const filterBtn = document.querySelector('#filterBtn');
filterBtn.addEventListener('click', shop);