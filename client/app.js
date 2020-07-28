import { getBooks, getBook, setChapterRead, setChapterUnread, createBook } from './api.js';

const homePage = {
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
  data: function () {
    return {
      books: undefined
    };
  },
  created: function () {
    getBooks()
      .then(books => {
        this.books = books;
      });
  },
};
const bookPage = {
  template: `
    <div>
      <router-link to="/">Home</router-link>
      <ul v-if="chapters">
        <li v-for="chapter in chapters" :key="chapter.id">
          {{ chapter.title }}
        </li>
      </ul>
      <ul v-else>
        <li>...</li>
      </ul>
    </div>
  `,
  data: function () {
    return {
      chapters: undefined
    };
  },
  created: function () {
    const bookId = this.$route.params.id;
    getBook(bookId)
      .then(book => {
        this.chapters = book.chapters;
      });
  },
};
const addBookPage = {
  template: `
    <div>
      <router-link to="/">Home</router-link>
    </div>
  `,
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
