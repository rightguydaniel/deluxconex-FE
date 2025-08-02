export const PaymentMethods = () => {
  return (
    <>
      <button className="bg-green-500 text-sm text-white p-1 rounded cursor-pointer hover:text-blue-200">
        Add payment method
      </button>
      <table className="w-full mt-4 text-left">
        <thead className="w-full">
          <th>Payment method</th>
          <th>Expires</th>
          <th>Operations</th>
        </thead>
        <tbody className="w-full bg-gray-100 text-lg font-extralight">
          <p>There are no payment methods yet.</p>
        </tbody>
      </table>
    </>
  );
};
