import React, { useState, useEffect } from 'react';

const Order = () => {
    const [menu, setMenu] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [orderStatus, setOrderStatus] = useState(null);

    // دریافت منو
    useEffect(() => {
        fetch('http://localhost:3001/menu')
            .then(res => res.json())
            .then(data => setMenu(data))
            .catch(err => console.error('خطا در بارگذاری منو:', err));
        const savedOrder = localStorage.getItem('order');
        if (savedOrder) {
            const order = JSON.parse(savedOrder);
            setOrderStatus(order); // همون لحظه نمایش بده
            }
    }, []);

    // هندل انتخاب غذا
    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // ثبت سفارش
    const handleSubmit = () => {
        fetch('http://localhost:3001/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: selectedItems }),
        })
            .then(res => res.json())
            .then(order => {
                setOrderStatus(order);  // کل سفارش رو ذخیره می‌کنیم
                localStorage.setItem('order', JSON.stringify(order)); // 👈 ذخیره سفارش
            })
            .catch(err => console.error('خطا در ارسال سفارش:', err));
    };

    // چک کردن وضعیت سفارش (اگر بخوای دستی بزنه)
    const handleCheckStatus = () => {
        fetch(`http://localhost:3001/orders/${orderStatus.id}`)
            .then(res => res.json())
            .then(order => {
                setOrderStatus(order); // آپدیت وضعیت
                localStorage.setItem('order', JSON.stringify(order)); // 👈 آپدیت localStorage

            })
            .catch(err => console.error('خطا در دریافت وضعیت سفارش:', err));
    };

    // به‌روزرسانی خودکار وضعیت سفارش
    useEffect(() => {
        if (!orderStatus?.id) return;

        const interval = setInterval(() => {
            fetch(`http://localhost:3001/orders/${orderStatus.id}`)
                .then(res => res.json())
                .then(order => setOrderStatus(order));
        }, 100); // هر ۳ ثانیه

        return () => clearInterval(interval);
    }, [orderStatus?.id]);

    return (
        <div>
            <h2>سفارش غذا</h2>

            <h3>منو</h3>
            {menu.map(item => (
                <div key={item.id}>
                    <input
                        type="checkbox"
                        id={item.id}
                        onChange={() => handleCheckboxChange(item.id)}
                    />
                    <label htmlFor={item.id}>{item.name}</label>
                </div>
            ))}

            <button onClick={handleSubmit}>ثبت سفارش</button>

            {orderStatus && (
                <div style={{ marginTop: '20px' }}>
                    <h3>وضعیت سفارش شما: {orderStatus.status}</h3>
                    <button onClick={handleCheckStatus}>مشاهده وضعیت</button>
                </div>
            )}
        </div>
    );
};

export default Order;
