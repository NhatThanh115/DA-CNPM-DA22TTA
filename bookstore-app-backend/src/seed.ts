import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Book from './models/Book.js';
// Using the same book data from the frontend for consistency
const booksData = [
  {
    id: "1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman's act of violence against her husband and her subsequent silence.",
    price: 12.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1668782119i/40097951.jpg",
    category: "mystery",
    rating: 4.5,
    featured: true,
    inStock: true,
    publicationDate: "2019-02-05",
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    price: 15.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
    category: "sci-fi",
    rating: 4.8,
    featured: true,
    inStock: true,
    publicationDate: "1965-08-01",
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    price: 14.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
    category: "self-help",
    rating: 4.7,
    featured: true,
    inStock: true,
    publicationDate: "2018-10-16",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "The classic tale of the spirited Elizabeth Bennet and the proud Mr. Darcy navigating social conventions in Regency-era England.",
    price: 9.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630460746i/1885.jpg",
    category: "romance",
    rating: 4.6,
    featured: false,
    inStock: true,
    publicationDate: "1813-01-28",
  },
  {
    id: "5",
    title: "Becoming",
    author: "Michelle Obama",
    description: "An intimate, powerful, and inspiring memoir by the former First Lady of the United States.",
    price: 18.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528206996i/38746485.jpg",
    category: "biography",
    rating: 4.9,
    featured: true,
    inStock: true,
    publicationDate: "2018-11-13",
  },
  {
    id: "6",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A fable about following your dreams and finding your true purpose in life.",
    price: 11.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
    category: "fiction",
    rating: 4.6,
    featured: false,
    inStock: true,
    publicationDate: "1988-01-01",
  },
  {
    id: "7",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "A book that explores the history and impact of Homo sapiens on the world.",
    price: 16.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595674533i/23692271.jpg",
    category: "history",
    rating: 4.7,
    featured: true,
    inStock: true,
    publicationDate: "2011-05-15",
  },
  {
    id: "8",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A novel that depicts the lavish and decadent lifestyle of the wealthy elite in the 1920s.",
    price: 10.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    category: "fiction",
    rating: 4.4,
    featured: false,
    inStock: true,
    publicationDate: "1925-04-10",
  },
  {
    id: "9",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description: "A novel about an abandoned girl who raises herself in the marshes of North Carolina.",
    price: 13.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582135294i/36809135.jpg",
    category: "fiction",
    rating: 4.8,
    featured: true,
    inStock: true,
    publicationDate: "2018-08-14",
  },
  {
    id: "10",
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a woman who leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    price: 15.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg",
    category: "biography",
    rating: 4.7,
    featured: false,
    inStock: true,
    publicationDate: "2018-02-20",
  },
  {
    id: "11",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the adventures of Bilbo Baggins, a hobbit who is reluctantly swept into an epic quest.",
    price: 12.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
    category: "fiction",
    rating: 4.7,
    featured: false,
    inStock: true,
    publicationDate: "1937-09-21",
  },
  {
    id: "12",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    description: "A self-help book that outlines a principle-centered approach for solving personal and professional problems.",
    price: 14.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421842784i/36072.jpg",
    category: "self-help",
    rating: 4.5,
    featured: false,
    inStock: true,
    publicationDate: "1989-08-15",
  }
];

dotenv.config();

const seedDB = async () => {
  await connectDB();

  try {

    await Book.deleteMany({});
    console.log('Old books removed.');

   
    const booksToInsert = booksData.map(book => {
      const { id, ...restOfBook } = book; 
      return restOfBook;
    });

    await Book.insertMany(booksToInsert);
    console.log('Books seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedDB();
