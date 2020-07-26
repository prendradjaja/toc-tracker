import * as express from "express";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/toc_tracker';
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.static('../client'));

const pgPool = new Pool({
  connectionString: DATABASE_URL,
  // TODO Use SSL in production?
});

configureRoutes();

app.listen(PORT, () => console.log('Example app listening at http://localhost:'+PORT))

function configureRoutes() {
  app.get('/api/books', async (req, res) => {
    try {
      await fakeNetworkDelay();
      const { rows: books } = await pgPool.query(`
        SELECT *
        FROM book
        ORDER BY id DESC
      `);
      res.send(books);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  });

  app.get('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await fakeNetworkDelay();
      const title = (await pgPool.query(`
        SELECT title
        FROM book
        WHERE id = $1
      `, [id])).rows[0].title;
      const { rows: chapters } = await pgPool.query(`
        SELECT *
        FROM chapter
        WHERE book_id = $1
        ORDER BY id ASC
      `, [id]);
      res.send({ title, chapters });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  });

  app.post('/api/books', async (req, res) => {
    const { title, chapters } = req.body;
    await fakeNetworkDelay();
    const pgClient = await pgPool.connect();
    try {
      await pgClient.query('BEGIN');
      const bookId = (await pgClient.query('INSERT INTO book(title) VALUES ($1) RETURNING id', [title])).rows[0].id;
      // TODO Do this loop as one query?
      for (let chapter of chapters) {
        await pgClient.query('INSERT INTO chapter(book_id, title) VALUES ($1, $2)', [bookId, chapter]);
      }
      await pgClient.query('COMMIT')
      res.send('{}')
    } catch (err) {
      await pgClient.query('ROLLBACK')
      console.error(err);
      res.status(500).send("Error " + err);
    } finally {
      pgClient.release();
    }
  });

  app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    await fakeNetworkDelay();
    const pgClient = await pgPool.connect();
    try {
      await pgClient.query('BEGIN');
      await pgClient.query('DELETE FROM chapter WHERE book_id = $1', [id]);
      await pgClient.query('DELETE FROM book WHERE id = $1', [id]);
      await pgClient.query('COMMIT')
      res.send('{}')
    } catch (err) {
      await pgClient.query('ROLLBACK')
      console.error(err);
      res.status(500).send("Error " + err);
    } finally {
      pgClient.release();
    }
  })

  app.post('/api/chapters/:id/read', async (req, res) => {
    try {
      await fakeNetworkDelay();
      const { id } = req.params;
      const queryResult = await pgPool.query(`
        UPDATE chapter
        SET read_at = current_timestamp
        WHERE id = $1
      `, [id]);
      if (!queryResult.rowCount) {
        throw new Error("Chapter not found: ID " + id)
      }
      res.send('{}')
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  })

  app.post('/api/chapters/:id/unread', async (req, res) => {
    try {
      await fakeNetworkDelay();
      const { id } = req.params;
      const queryResult = await pgPool.query(`
        UPDATE chapter
        SET read_at = NULL
        WHERE id = $1
      `, [id]);
      if (!queryResult.rowCount) {
        throw new Error("Chapter not found: ID " + id)
      }
      res.send('{}')
    } catch (err) {
      console.error(err);
      res.status(500).send("Error " + err);
    }
  })
}

function fakeNetworkDelay() {
  return wait(200);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
