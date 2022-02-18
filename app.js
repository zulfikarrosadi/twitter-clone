const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const tweetRoutes = require('./routes/tweetRoute');
const commentRoutes = require('./routes/commentRoute');
const userRoutes = require('./routes/userRoute');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use('/tweets', tweetRoutes);
app.use('/tweets/comments', commentRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening to http://localhost:${PORT}`));
