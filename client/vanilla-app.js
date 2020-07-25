showHome();

function hideAllStates() {
  document.querySelectorAll('.state').forEach(el => el.classList.add('hide'));
}

function showHome() {
  hideAllStates();
  document.querySelector('#state-home').classList.remove('hide');
  const bookList = document.querySelector('#state-home ul.books');
  bookList.innerHTML = '<li>...</li>';
  getBooks()
    .then(books => {
      bookList.innerHTML = books.map(
        book => `
          <li><a href="#" onclick="showBook(${book.id})">${book.title}</a></li>
        `
      ).join('');
    });
}

function showBook(id) {
  hideAllStates();
  document.querySelector('#state-book').classList.remove('hide');
  const chapterList = document.querySelector('#state-book ul.chapters');
  chapterList.innerHTML = '<li>...</li>';
  getBook(id)
    .then(book => {
      chapterList.innerHTML = book.chapters.map(
        chapter => `
          <li>${chapter.title} ${!!chapter.read_at}</li>
        `
      ).join('');
    });
}
