const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatgptRoutes = require('./routes/chatgpt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/chatgpt', chatgptRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
