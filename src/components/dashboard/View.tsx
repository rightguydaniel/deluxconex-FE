// import { useNavigate } from "react-router-dom";

interface Props {
  handleOrderClick: () => void;
  handleInvoiceClick: () => void;
}

export const View: React.FC<Props> = ({ handleOrderClick, handleInvoiceClick }) => {
  //   const navigate = useNavigate();
  return (
    <>
      <ul>
        <li
          className="w-full text-blue-500 text-lg font-extralight hover:bg-gray-100 hover:border-none border-b border-gray-100 py-2 cursor-pointer"
          onClick={handleOrderClick}
        >
          Orders
        </li>
        <li
          className="w-full text-blue-500 text-lg font-extralight hover:bg-gray-100 hover:border-none border-b border-gray-100 py-2 cursor-pointer"
          onClick={handleInvoiceClick}
        >
          Invoice
        </li>
        <li className="w-full text-blue-500 text-lg font-extralight hover:bg-gray-100 hover:border-none border-b border-gray-100 py-2 cursor-pointer">
          Logout
        </li>
      </ul>
      <div className="mt-4">
        <p className="font-extrabold text-lg">Contact phone</p>
        <a
          href="tel:+647824628489"
          className="text-blue-500 border-b border-gray-100 text-lg font-extralight"
        >
          647824628489
        </a>
      </div>
    </>
  );
};
