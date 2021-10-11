const express = require('express');
const cors = require('cors');

const tweetRoutes = require('./routes/tweetRoutes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`listening to http://localhost:${PORT}`));

app.use(tweetRoutes);
