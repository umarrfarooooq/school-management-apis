const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
  publicationYear: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  copies: {
    type: Number,
    required: true,
    default: 1,
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1,
  },
  issuedBooks: [
    {
      issuedTo: { type: Schema.Types.ObjectId, ref: 'Student' },
      issuedDate: { type: Date, default: Date.now },
      returnDate: { type: Date },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;