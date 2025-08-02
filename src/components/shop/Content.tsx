import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";
import { PiShippingContainerDuotone } from "react-icons/pi";

export const Content = () => {
  return (
    <>
      <h4 className="text-dark text-lg font-bold mb-2">Have questions?</h4>
      <p className="text-dark mb-2">
        Call our specialists at <a href="tel:+4627848723">(855)878-5233.</a> We
        are open Mon-Fri 7am-6pm PST.
      </p>
      <button className="my-2 border border-dark w-full py-2 font-bold rounded hover:bg-dark hover:text-white">
        Get a quote
      </button>
      <h4 className="text-lg font-bold my-4">Buying online is easy</h4>
      <div>
        <div className="flex space-x-4 my-2 items-center">
          <FiCheckCircle className="h-8 w-8 text-gray-400" />
          <span className="text-dark font-bold text-base">
            Choose container
          </span>
        </div>
        <div className="flex space-x-4 my-2 items-center">
          <MdOutlineDateRange className="h-8 w-8 text-gray-400" />
          <span className="text-dark font-bold text-base">
            Pick delivery date
          </span>
        </div>
        <div className="flex space-x-4 my-2 items-center">
          <PiShippingContainerDuotone className="h-8 w-8 text-gray-400" />
          <span className="text-dark font-bold text-base">
            Receive container
          </span>
        </div>
      </div>
    </>
  );
};
