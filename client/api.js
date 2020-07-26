function getBooks() {
  return myFetch('/api/books')
    .then(response => response.json());
}

function getBook(id) {
  return myFetch('/api/books/'+id)
    .then(response => response.json());
}

function setChapterRead(id) {
  return myFetch(`/api/chapters/${id}/read`, { method: 'POST' })
    .then(() => undefined);
}

function setChapterUnread(id) {
  return myFetch(`/api/chapters/${id}/unread`, { method: 'POST' })
    .then(() => undefined);
}

/**
 * body = { title: string, chapters: string[] }
 */
function createBook(body) {
  return myFetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(() => undefined);
}

/**
 * Rejects upon non-2XX (fetch doesn't do this!).
 */
function myFetch(input, init) {
  return fetch(input, init)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error from server');
      }
      return response;
    })
}

