import { useEffect, useState } from "react";

const Panel = () => {
    const [orders, setOrders] = useState([]);

    // تابع دریافت سفارش‌ها
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3001/orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders(); // بار اول

        const interval = setInterval(() => {
            fetchOrders(); // هر ۳ ثانیه
        }, 3000);

        return () => clearInterval(interval); // پاکسازی وقتی کامپوننت بسته میشه
    }, []);

    // تغییر وضعیت سفارش
    const changeStatus = (id, newStatus) => {
        fetch(`http://localhost:3001/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })
            .then(res => res.json())
            .then(updatedOrder => {
                setOrders(prev =>
                    prev.map(o => (o.id === id ? { ...o, status: newStatus } : o))
                );
            })
            .catch(err => console.error('خطا در تغییر وضعیت:', err));
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h2 className='text-4xl font-bold text-gray-800 mb-6'>پنل مدیریت</h2>
            <div>
                <ul>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <li key={order.id} className='bg-white shadow-md rounded-lg p-4 m-2'>
                                <h3 className='text-xl font-semibold'>سفارش شماره: {order.id}</h3>
                                <p className='text-gray-600'>وضعیت: {order.status}</p>
                                <p>آیتم‌ها: {order.items.join(', ')}</p>
                                <select
                                    value={order.status}
                                    onChange={(e) => changeStatus(order.id, e.target.value)}
                                >
                                    <option value="در انتظار">در انتظار</option>
                                    <option value="در حال انجام">در حال انجام</option>
                                    <option value="انجام شده">انجام شده</option>
                                </select>
                            </li>
                        ))
                    ) : (
                        <p>سفارشی وجود ندارد</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Panel;
