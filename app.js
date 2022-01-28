const express = require('express');
const cors = require('cors');

const tweetRoutes = require('./routes/tweetRoutes');
const commentRoutes = require('./routes/commentRoute');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/tweets', tweetRoutes);
app.use('/tweets/comments', commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening to http://localhost:${PORT}`));
