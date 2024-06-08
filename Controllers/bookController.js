const Book = require('../Models/Book');

exports.createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      genre,
      description,
      copies,
    } = req.body;

    const newBook = new Book({
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      genre,
      description,
      copies,
      availableCopies: copies,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter) {
      query.genre = filter;
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.issueBook = async (req, res) => {
  try {
    const { bookId, studentId, returnDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.availableCopies === 0) {
      return res.status(400).json({ error: 'No copies available for issue' });
    }

    book.availableCopies--;
    book.issuedBooks.push({ issuedTo: studentId, returnDate });
    await book.save();

    res.json({ message: 'Book issued successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { bookId, studentId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const issuedBookIndex = book.issuedBooks.findIndex(
      (issuedBook) => issuedBook.issuedTo.toString() === studentId
    );

    if (issuedBookIndex === -1) {
      return res.status(400).json({ error: 'Book not issued to the student' });
    }

    book.availableCopies++;
    book.issuedBooks.splice(issuedBookIndex, 1);
    await book.save();

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};