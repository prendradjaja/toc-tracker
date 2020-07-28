import { getBooks } from './api.js';

const homePage = {
  data: function () {
    return {
      books: undefined
    };
  },
  template: `
    <div>
      <router-link to="/add">Add a book</router-link>
      <ul v-if="books">
        <li v-for="book in books" :key="book.id">
          <router-link :to="'/book/' + book.id">
            {{ book.title }}
          </router-link>
        </li>
      </ul>
      <ul v-else>
        <li>...</li>
      </ul>
    </div>
  `,
  created: function () {
    getBooks()
      .then(books => {
        this.books = books;
      });
  }
};
const bookPage = {template: `
  <div>book {{ $route.params.id }}</div>
`};
const addBookPage = {
  template: `<div>add</div>`
};


const routes = [
  { path: '/', component: homePage },
  { path: '/book/:id', component: bookPage },
  { path: '/add', component: addBookPage },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

const app = new Vue({
  router,
  el: '#app'
})
