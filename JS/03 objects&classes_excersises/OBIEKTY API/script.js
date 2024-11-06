//https://jsonplaceholder.typicode.com/posts

class Search{
    static elements = {
        searchBtn: document.querySelector('#searchBtn'),
        list: document.querySelector('#list'),
        searchInput: document.querySelector('#searchInput')
    }

    static initSearch = () => {
        Search.elements.searchBtn.addEventListener('click', Search.searchClickEvent);
    }

    static searchClickEvent = () => {
        if(Search.elements.searchInput.value.length === 0){
            return;
        }

        const items = Search.elements.list.querySelectorAll('li');
        items.forEach(Search.toogleItem);
    }
    
    static toogleItem = (item) => item.style.display = item.innerText.toLowerCase().includes(searchInput.value.toLowerCase()) ? 'block' : 'none';
}

class Posts{
    elements = {
        list: document.querySelector('#list')
    }

    constructor(){
        this.createList().then(Search.initSearch);
    }


    fetchPosts = async () => {
        const request = await fetch('https://jsonplaceholder.typicode.com/posts');
        return await request.json();
    }

    create = async (post) => {
        const li = document.createElement('li');
        const title = document.createElement('h2');
        title.innerText = post.title;

        const body = document.createElement('p');
        body.innerText = post.body;

        const button = document.createElement('button');
        button.innerText = 'Usuń';
        button.addEventListener('click', this.deleteItem);

        li.append(title, body, button);

        this.elements.list.append(li);
    }

    deleteItem = (e) => e.target.parentElement.remove();
 
    createList = async () => {
        const posts = await this.fetchPosts();
        posts.forEach(post => this.create(post));
    }
}

const apiTest = new Posts()

