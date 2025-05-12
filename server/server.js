const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // برای خواندن JSON در POST

app.get('/menu', (req, res) => {
    fs.readFile('./data/menu.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('خطا در خواندن منو');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/order', (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send('سفارش نامعتبر است');
    }

    const newOrder = {
        id: Date.now(),
        items,
        status: 'در انتظار'
    };

    fs.readFile('./data/orders.json', 'utf8', (err, data) => {
        let orders = [];
        if (!err && data) {
            orders = JSON.parse(data);
        }

        orders.push(newOrder);

        fs.writeFile('./data/orders.json', JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                return res.status(500).send('خطا در ذخیره سفارش');
            }
            res.json(newOrder);
        });
    });
});
app.get('/orders', (req, res) => {
    fs.readFile('./data/orders.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('خطا در خواندن سفارش‌ها');
        }
        const orders = JSON.parse(data || '[]');
        res.json(orders);
    });
});
app.listen(PORT, () => {
    console.log(`✅ Server Running at http://localhost:${PORT}`);
});
