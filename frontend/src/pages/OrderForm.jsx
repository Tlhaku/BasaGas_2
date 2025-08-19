import { useState } from 'react';

const BASE_PRICES = { 2: 70, 3: 104, 5: 184, 7: 250 };
const DELIVERY_FEE = 45;

export default function OrderForm() {
  const [form, setForm] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    cylinderSize: 2,
    quantity: 1,
    returnTime: '',
    paymentType: 'pay-per-refill',
  });
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState('');

  const calculatePrice = (f) => {
    const base = BASE_PRICES[f.cylinderSize] * f.quantity + DELIVERY_FEE;
    return f.paymentType === 'subscription' ? base * 0.9 : base;
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    setPrice(calculatePrice(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(`Order created with ID ${data.id} and price R${data.price}`);
    } else {
      setMessage('Failed to create order');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input className="w-full border p-2" name="pickupAddress" placeholder="Pickup Address" value={form.pickupAddress} onChange={handleChange} />
      <input className="w-full border p-2" name="dropoffAddress" placeholder="Drop-off Address" value={form.dropoffAddress} onChange={handleChange} />
      <select className="w-full border p-2" name="cylinderSize" value={form.cylinderSize} onChange={handleChange}>
        {[2,3,5,7].map(size => <option key={size} value={size}>{size}kg</option>)}
      </select>
      <input className="w-full border p-2" type="number" name="quantity" min="1" value={form.quantity} onChange={handleChange} />
      <input className="w-full border p-2" type="datetime-local" name="returnTime" value={form.returnTime} onChange={handleChange} />
      <div className="flex space-x-4">
        <label><input type="radio" name="paymentType" value="subscription" checked={form.paymentType==='subscription'} onChange={handleChange} /> Subscription</label>
        <label><input type="radio" name="paymentType" value="pay-per-refill" checked={form.paymentType==='pay-per-refill'} onChange={handleChange} /> Pay-per-refill</label>
      </div>
      <div className="font-bold">Price: R{price}</div>
      <button className="bg-blue-500 text-white px-4 py-2" type="submit">Submit</button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
}
