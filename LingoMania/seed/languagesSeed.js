require('dotenv').config();
const mongoose = require('mongoose');
const Language = require('../models/Language');

const languages = [
  { name: 'English', code: 'EN' },
  { name: 'Spanish', code: 'ES' },
  { name: 'French', code: 'FR' }
];

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Database connected successfully for seeding.'))
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

const seedLanguages = async () => {
  try {
    for (const language of languages) {
      const languageExists = await Language.findOne({ code: language.code });
      if (!languageExists) {
        await Language.create(language);
        console.log(`Language added: ${language.name}`);
      } else {
        console.log(`Language already exists: ${language.name}`);
      }
    }
    console.log('Seeding completed.');
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    console.error(error.stack);
  } finally {
    mongoose.connection.close().then(() => console.log('Database connection closed after seeding.'));
  }
};

seedLanguages();