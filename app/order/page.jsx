
"use client"; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PlaceOrder = () => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('/api/customers/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(token);
            fetchOrders(); 
          } else {
            router.push('/signup');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/signup');
        }
      } else {
        router.push('/signup');

      }
    };
    checkAuthentication();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product, quantity }),
    });

    if (response.ok) {
      alert('Order placed successfully!');
      fetchOrders(); // Fetch orders after placing a new one
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to place order');
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    } else {
      console.error('Failed to fetch orders');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">hey {user?.name}! Lets place an Order</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handlePlaceOrder}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <input 
              type="text" 
              value={product} 
              onChange={(e) => setProduct(e.target.value)} 
              required 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              required 
              min="1"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Place Order</button>
        </form>

        <h3 className="text-xl font-bold mt-6">Your Orders</h3>
        {orders.length > 0 ? (
          <ul className="mt-4">
            {orders.map(order => (
              <li key={order._id} className="border-b py-2">
                {order.product} - Quantity: {order.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;