const prices = [
  { size: 2, price: 70 },
  { size: 3, price: 104 },
  { size: 5, price: 184 },
  { size: 7, price: 250 },
];

export default function Pricing() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pricing</h2>
      <table className="table-auto border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Cylinder Size</th>
            <th className="border px-4 py-2">Refill Price (R)</th>
          </tr>
        </thead>
        <tbody>
          {prices.map(p => (
            <tr key={p.size}>
              <td className="border px-4 py-2">{p.size}kg</td>
              <td className="border px-4 py-2">{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4">Subscription orders receive a 10% discount plus R45 delivery fee per order.</p>
    </div>
  );
}
