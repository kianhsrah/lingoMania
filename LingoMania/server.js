// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const lessonRoutes = require('./routes/lessonRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const userProgressRoutes = require('./routes/userProgressRoutes');
const userRoutes = require('./routes/userRoutes'); // Added user routes
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const quizRoutes = require('./routes/quizRoutes'); // Import quiz routes
const fs = require('fs').promises;
const path = require('path');
const acceptLanguageParser = require('accept-language-parser');

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Lesson Routes
app.use(lessonRoutes);

// Exercise Routes
app.use(exerciseRoutes);

// User Progress Routes
app.use(userProgressRoutes);

// User Routes - For profile and preferences
app.use(userRoutes); // Registering the user routes

// Post Routes - For creating, reading, updating, and deleting posts
app.use(postRoutes);

// Comment Routes - For creating, reading, updating, and deleting comments
app.use(commentRoutes);

// Quiz Routes - For creating, taking and evaluating quizzes
app.use(quizRoutes);

// Root path response
app.get("/", async (req, res) => {
  const preferredLanguages = acceptLanguageParser.parse(req.headers['accept-language']);
  let preferredLanguage = 'en'; // Default to English
  if(preferredLanguages.length > 0) {
    // Find the highest quality language supported by the app
    const supportedLanguages = ['en', 'es', 'fr']; // List of supported languages
    preferredLanguage = preferredLanguages
      .map(lang => lang.code)
      .find(lang => supportedLanguages.includes(lang)) || 'en';
  }
  const filePath = path.join(__dirname, 'public', 'locales', preferredLanguage, 'translation.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const messages = JSON.parse(data);
    res.render("index", { welcomeMessage: messages.welcome });
  } catch (err) {
    console.error(`Error reading localization file: ${err.message}`, err.stack);
    // Fallback to English if there's an error reading the preferred language file
    const fallbackPath = path.join(__dirname, 'public', 'locales', 'en', 'translation.json');
    try {
      const fallbackData = await fs.readFile(fallbackPath, 'utf8');
      const messages = JSON.parse(fallbackData);
      res.render("index", { welcomeMessage: messages.welcome });
    } catch (fallbackErr) {
      console.error(`Error reading fallback localization file: ${fallbackErr.message}`, fallbackErr.stack);
      res.status(500).send("Error loading the page.");
    }
  }
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
