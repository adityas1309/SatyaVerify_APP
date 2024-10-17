const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

// Replace with your actual MongoDB URI and News API key
const mongoURI = 'mongodb+srv://techjourney1309:Ss96TB34D0fwoM1d@satyaverify.cvbqs.mongodb.net/?retryWrites=true&w=majority&appName=SatyaVerify';  
const newsApiKey = '18a6e6207c07441f92238a4b29dae11c';  

const app = express();
app.use(cors({
  origin: '*', // Allow all origins or specify your React Native app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define a Satisfaction Schema
const satisfactionSchema = new mongoose.Schema({
  response: { type: String, required: true }, // 'yes' or 'no'
  createdAt: { type: Date, default: Date.now }
});

const Satisfaction = mongoose.model('Satisfaction', satisfactionSchema);

// Trusted and blacklisted sources
const trustedSources = [
  'bbc.co.uk', 'nytimes.com', 'reuters.com', 'cnn.com', 'theguardian.com',
  'washingtonpost.com', 'forbes.com', 'bloomberg.com'
];

const blacklistedSources = [
  'fake-news-site.com', 'misleading-news.net', 'notarealnews.org'
];

// Function to check domain credibility
const checkDomainCredibility = (domain) => {
  if (trustedSources.includes(domain)) {
    return { score: 90, message: "This is a highly trusted source." };
  } else if (blacklistedSources.includes(domain)) {
    return { score: 10, message: "This source is known for misinformation." };
  } else {
    return { score: 50, message: "Source credibility is uncertain. Proceed with caution." };
  }
};

// Function to calculate credibility score based on articles and their sources
const calculateCredibilityScore = (articles) => {
  if (articles.length === 0) {
    return { score: 0, message: "No articles found, unable to verify credibility." };
  }

  let totalScore = 0;
  articles.forEach(article => {
    const articleDomain = new URL(article.url).hostname.replace('www.', '');
    const domainCredibility = checkDomainCredibility(articleDomain);
    totalScore += domainCredibility.score;
  });

  const averageScore = totalScore / articles.length;

  if (averageScore > 70) {
    return { score: 80, message: "This news is likely credible based on multiple sources." };
  } else if (averageScore > 40) {
    return { score: 50, message: "This news may have some credibility but should be verified further." };
  } else {
    return { score: 20, message: "This news is likely false or lacks verification." };
  }
};

// Route to verify news
app.post('/api/verify', async (req, res) => {
  const { link } = req.body;
  console.log("Verification request received:", link);
  
  try {
    const domain = new URL(link).hostname.replace('www.', '');
    console.log("Domain being queried:", domain);
    
    const newsApiResponse = await axios.get(`https://newsapi.org/v2/everything?domains=${domain}&apiKey=${newsApiKey}`);
    const articles = newsApiResponse.data.articles || [];
    console.log("News API response:", newsApiResponse.data);

    const { score, message } = calculateCredibilityScore(articles);

    return res.json({
      credibilityScore: score,
      message: message,
      relatedArticles: articles
    });
  } catch (error) {
    console.error("Error verifying news link:", error.response || error.message);
    res.status(500).json({ error: "Server error while verifying news." });
  }
});

// Route to handle user satisfaction response
app.post('/api/satisfaction', async (req, res) => {
  const { response } = req.body; // Expecting 'yes' or 'no'

  if (response !== 'yes' && response !== 'no') {
    return res.status(400).json({ error: "Response must be 'yes' or 'no'." });
  }

  try {
    const satisfaction = new Satisfaction({ response });
    await satisfaction.save();

    const counts = await Satisfaction.aggregate([
      { $group: { _id: "$response", count: { $sum: 1 } } },
    ]);

    const satisfactionCounts = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { yes: 0, no: 0 });

    res.json({ message: 'Response recorded', satisfactionCounts });
  } catch (error) {
    console.error("Error saving satisfaction response:", error);
    res.status(500).json({ error: "Server error while recording response." });
  }
});

// Start server
const PORT = 5000; // Use a fixed port for simplicity
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
