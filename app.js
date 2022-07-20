const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const tweetRoutes = require('./src/routes/tweetRoute');
const commentRoutes = require('./src/routes/commentRoute');
const userRoutes = require('./src/routes/userRoute');
const authRoute = require('./src/routes/authRoute');
const { deserializeUser } = require('./src/middlewares/deserializeUser');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.static('public'));
app.use(cookieParser());

app.use(deserializeUser);

app.use('/tweets', tweetRoutes);
app.use('/tweets/comments', commentRoutes);
app.use('/users', userRoutes);
app.use('/', authRoute);

app.use((req, res) => res.status(404).json({ message: 'page not found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening to http://localhost:${PORT}`));
