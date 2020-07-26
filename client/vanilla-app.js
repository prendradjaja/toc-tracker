const globals = {
  chapters: [],
};

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
      globals.chapters = book.chapters;
      chapterList.innerHTML = book.chapters.map(
        chapter => `
          <li id="${makeChapterElementId(chapter.id)}">
            <button
              class="
                read-toggle
                ${!!chapter.read_at ? 'read' : ''}
              "
              onclick="toggleRead(${chapter.id})"
            ></button>
            ${chapter.title}
          </li>
        `
      ).join('');
    });
}

function showAdd() {
  hideAllStates();
  document.querySelector('#state-add').classList.remove('hide');
}

function toggleRead(chapterId) {
  const chapterElement = document.querySelector('#' + makeChapterElementId(chapterId));
  const button = chapterElement.querySelector('button.read-toggle')
  const wasRead = button.classList.contains('read');
  const func = wasRead ? setChapterUnread : setChapterRead;
  const funcName = wasRead ? 'UNREAD' : 'READ';
  const chapterTitle = globals.chapters.find(c => c.id === chapterId)?.title;

  const yes = window.confirm(`Mark chapter "${chapterTitle}" as ${funcName}?`);

  if (!yes) {
    return;
  }

  button.disabled = true;
  func(chapterId)
    .then(() => {
      if (wasRead) {
        button.classList.remove('read');
      } else {
        button.classList.add('read');
      }
    })
    .finally(() => { button.disabled = false; });
}

function makeChapterElementId(chapterId) {
  return 'chapter-' + chapterId;
}

function submitNewBook() {
  const title = (
    document.querySelector('#state-add input').value || ''
  ).trim();
  const chapters = (
    document.querySelector('#state-add textarea').value || ''
  ).trim().split('\n');
  const button = document.querySelector('#state-add button').disabled = true;
  createBook({ title, chapters })
    .then(() => { window.alert("Success!"); })
    .catch(() => { window.alert("Failed."); })
    .finally(() => { showHome(); });
}
