const express = require('express');
const fs = require('fs');
const cors = require('cors');
const menu = require('./data/menu.json');
const app = express();
const PORT = 3001;

app.use(cors());

// مسیر: دریافت لیست غذاها
app.get('/menu', (req, res) => {
    fs.readFile(menu, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('خطا در خواندن منو');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server Running http://localhost:${PORT}`);
});
