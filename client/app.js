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
          <my-checkbox
            :read="!!chapter.read_at"
            :disabled="loading[chapter.id]"
            @toggle="toggle(chapter)"
          ></my-checkbox>
          {{ chapter.title }} loading: {{ loading[chapter.id] }}
        </li>
      </ul>
      <ul v-else>
        <li>...</li>
      </ul>
    </div>
  `,
  data: function () {
    return {
      chapters: undefined,
      loading: undefined,
    };
  },
  created: function () {
    this.load();
  },
  methods: {
    load: function () {
    const bookId = this.$route.params.id;
      getBook(bookId)
        .then(book => {
          this.chapters = book.chapters;
          this.loading = Object.fromEntries(
            this.chapters.map(
              chapter => [chapter.id, false]
            )
          );
        });
    },
    toggle: async function (chapter) {
      const setChapterState = chapter.read_at ? setChapterUnread : setChapterRead;
      this.loading[chapter.id] = true;
      await setChapterState(chapter.id);
      await this.load();
      this.loading[chapter.id] = false;
    },
  },
};
const addBookPage = {
  template: `
    <div>
      <router-link to="/">Home</router-link>
    </div>
  `,
};

Vue.component('my-checkbox', {
  props: ['read', 'disabled'],
  template: `
    <button
      class="read-toggle"
      :class="{ read }"
      :disabled="disabled"
      @click="$emit('toggle')"
    ></button>
  `
});


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
