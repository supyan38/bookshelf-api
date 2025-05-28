// src/handler.js
const { books } = require('./books');
const { nanoid } = require('nanoid');

const handler = (req, res) => {
  const { method, url } = req;
  const urlParts = url.split('?');
  const path = urlParts[0];
  const queryParams = new URLSearchParams(urlParts[1]);

  if (path === '/books' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
      } = JSON.parse(body);

      if (!name) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }));
      }

      if (readPage > pageCount) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }));
      }

      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount === readPage;

      const newBook = {
        id, name, year, author, summary, publisher,
        pageCount, readPage, finished, reading,
        insertedAt, updatedAt,
      };

      books.push(newBook);

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: { bookId: id },
      }));
    });

  } else if (path === '/books' && method === 'GET') {
    let filteredBooks = books;

    const name = queryParams.get('name');
    const reading = queryParams.get('reading');
    const finished = queryParams.get('finished');

    if (name) {
      filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== null) {
      filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
    }

    if (finished !== null) {
      filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
    }

    const bookList = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: 'success',
      data: { books: bookList },
    }));

  } else if (path.startsWith('/books/') && method === 'GET') {
    const id = path.split('/')[2];
    const book = books.find((b) => b.id === id);

    if (!book) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: 'success',
      data: { book },
    }));

  } else if (path.startsWith('/books/') && method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const id = path.split('/')[2];
      const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
      } = JSON.parse(body);

      const index = books.findIndex((b) => b.id === id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }));
      }

      if (!name) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }));
      }

      if (readPage > pageCount) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }));
      }

      books[index] = {
        ...books[index],
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
        finished: pageCount === readPage,
        updatedAt: new Date().toISOString(),
      };

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }));
    });

  } else if (path.startsWith('/books/') && method === 'DELETE') {
    const id = path.split('/')[2];
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      }));
    }

    books.splice(index, 1);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }));

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'fail',
      message: 'Halaman tidak ditemukan',
    }));
  }
};

module.exports = { handler };
