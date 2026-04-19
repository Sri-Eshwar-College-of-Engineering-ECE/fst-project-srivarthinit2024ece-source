import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './server/models/Movie.js';
import User from './server/models/User.js';
import Blog from './server/models/Blog.js';

dotenv.config();

const movies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "/images/inception_poster.png",
    genre: "Sci-Fi",
    year: 2010,
    director: "Christopher Nolan",
    rating: 8.8,
    duration: "2h 28m"
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "/images/dark_knight_poster.png",
    genre: "Action",
    year: 2008,
    director: "Christopher Nolan",
    rating: 9.0,
    duration: "2h 32m"
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterUrl: "/images/interstellar_poster.png",
    genre: "Adventure",
    year: 2014,
    director: "Christopher Nolan",
    rating: 8.7,
    duration: "2h 49m"
  },
  {
    title: "Vikram",
    description: "A high-octane action thriller where a special ops team is sent to track down a mysterious gang of masked men who have been eliminating several high-ranking officials.",
    posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=1000",
    genre: "Action/Thriller",
    year: 2022,
    director: "Lokesh Kanagaraj",
    rating: 8.3,
    duration: "2h 55m"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cineblog');
    
    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});
    await Blog.deleteMany({});

    // Insert Movies
    const createdMovies = await Movie.insertMany(movies);
    const inception = createdMovies.find(m => m.title === "Inception");
    const darkKnight = createdMovies.find(m => m.title === "The Dark Knight");

    // Create a Dummy User
    const dummyUser = new User({
      username: "Sri",
      email: "varthini997@gmail.com",
      password: "password123" // Will be hashed by pre-save middleware
    });
    await dummyUser.save();

    // Insert Blogs
    const blogs = [
      {
        title: "Inception: Understanding the Ending",
        content: "<h2>The Totem Debate</h2><p>For years, fans have debated whether Cobb was still dreaming at the end of Inception. The spinning top is the key, but maybe not the way you think...</p><p>Christopher Nolan's masterpiece explores the deep layers of the human subconscious and the blurred lines between reality and dreams. The use of 'totems' — personal objects that allow characters to distinguish between the two — is central to the film's logic.</p>",
        movieTitle: "Inception",
        movieId: inception._id,
        category: "Analysis",
        author: dummyUser._id,
        coverImage: "/images/inception.png"
      },
      {
        title: "Why The Joker is the Best Villain Ever",
        content: "<h2>Chaos vs Order</h2><p>Heath Ledger's performance as the Joker in The Dark Knight redefined what a movie villain could be. It wasn't just about the scars; it was about the philosophy.</p><p>Unlike other villains who want money or power, the Joker wants to prove that everyone is as corruptible as he is. He is an agent of chaos in a world trying desperately to maintain order.</p>",
        movieTitle: "The Dark Knight",
        movieId: darkKnight._id,
        category: "Review",
        author: dummyUser._id,
        coverImage: "/images/joker.png"
      },
      {
        title: "Top 5 Sci-Fi Movies of the Decade",
        content: "<h2>The Golden Age of Sci-Fi</h2><p>From Interstellar to Arrival, we are living in a new golden age of intelligent science fiction. Here are our top picks...</p><ul><li>1. Interstellar</li><li>2. Inception</li><li>3. Blade Runner 2049</li><li>4. Arrival</li><li>5. Ex Machina</li></ul>",
        category: "List",
        author: dummyUser._id,
        coverImage: "/images/scifi.png"
      }
    ];

    await Blog.insertMany(blogs);

    console.log("✅ Database seeded with Movies, Users, and Blogs successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
