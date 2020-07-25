function getBooks() {
  return myFetch('/api/books')
    .then(response => response.json());
}

function getBook(id) {
  return myFetch('/api/books/'+id)
    .then(response => response.json());
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

