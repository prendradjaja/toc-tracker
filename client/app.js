import { getMe, getBooks, getBook, setChapterRead, setChapterUnread, createBook } from './api.js';

const homePage = {
  template: `
    <div v-if="userLoading">
      Loading...
    </div>
    <div v-else-if="user">
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
    <div v-else>
      <a href="/login/facebook">Log in with Facebook</a>
    </div>
  `,
  data: function () {
    return {
      books: undefined,
      userLoading: true,
      user: undefined,
    };
  },
  created: async function () {
    let me;
    try {
      me = await getMe();
      this.user = me;
    } catch (error) {}
    this.userLoading = false;

    if (me) {
      this.books = await getBooks();
    }
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
      const funcName = chapter.read_at ? 'UNREAD' : 'READ';

      const yes = window.confirm(`Mark chapter "${chapter.title}" as ${funcName}?`);
      if (!yes) {
        return;
      }

      this.loading[chapter.id] = true;
      await setChapterState(chapter.id);
      await this.load();
      this.loading[chapter.id] = false;
    },
  },
};
const addBookPage = {
  template: `
    <div class="add-book-page">
      <router-link to="/">Home</router-link>
      <div>
        Title: <input v-model.trim="title">
      </div>
      <textarea v-model.trim="chapters"></textarea>
      <div>
        <button
          @click="submit()"
          :disabled="submitting"
        >
          Add book
        </button>
      </div>
    </div>
  `,
  data: function () {
    return {
      title: '',
      chapters: '',
      submitting: false,
    }
  },
  methods: {
    submit: function () {
      this.submitting = true;
      createBook({
        title: this.title,
        chapters: this.chapters.split('\n')
      })
        .then(() => {
          window.alert("Success!");
          this.$router.push('/');
        })
        .catch(() => {
          window.alert("Failed.");
          this.submitting = false;
        })
    }
  }
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
