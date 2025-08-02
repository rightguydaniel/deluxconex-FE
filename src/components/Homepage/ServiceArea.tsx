import designBg from "../../assets/images/design-custom-shipping-container_0-Copy.webp";
import builder from "../../assets/images/builder.png.webp";
import { MdOutlineLocationOn } from "react-icons/md";
import { motion } from "framer-motion";

interface ListProps {
  name: string;
}

const List: React.FC<ListProps> = ({ name }) => {
  return (
    <li className="flex items-center mb-2">
      <MdOutlineLocationOn className="w-4 h-4 md:w-5 md:h-5" />
      <span className="text-base md:text-lg lg:text-xl font-extralight ml-2">
        {name}
      </span>
    </li>
  );
};

export const ServiceArea = () => {
  const westCoast = [
    "Seattle, WA",
    "Portland, OR",
    "San Francisco, CA",
    "West Sacramento, CA",
    "San Diego, CA",
    "Reno, NV",
    "Los Angeles, CA",
    "Salt Lake City, UT",
    "Phoenix, AZ",
    "Boise, ID",
  ];

  const midWest = [
    "Denver, CO",
    "Dallas, TX",
    "Houston, TX",
    "Kansas City, MO",
    "Minneapolis, MN",
    "Memphis, TN",
    "Chicago, IL",
    "Nashville, TN",
    "Louisville, KY",
  ];

  const eastCoast = [
    "Atlanta, GA",
    "Jacksonville, FL",
    "Miami, FL",
    "Baltimore, MD",
    "Newark, NJ",
    "Boston, MA",
    "Philadelphia, PA",
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div
        className="flex flex-col lg:flex-row px-4 md:px-8 py-12 md:py-16 gap-8 md:gap-20 items-center"
        style={{
          backgroundImage: `url(${designBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full lg:w-2/5 text-white">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Visualize and build your custom container
          </h3>
          <p className="mt-2 text-lg md:text-xl lg:text-2xl font-light">
            Transform your vision with Conexbuilder—design custom storage,
            offices, or retail spaces.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 bg-light text-dark text-lg md:text-xl font-extrabold py-3 px-6 md:py-4 md:px-8 rounded-lg hover:bg-light/90 transition"
          >
            Start building now
          </motion.button>
        </div>
        <div className="w-full lg:w-3/5 flex justify-center">
          <img
            src={builder}
            alt="builder"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Service Areas Section */}
      <div className="flex flex-col lg:flex-row px-4 md:px-8 py-12 md:py-16 gap-8 md:gap-12">
        <div className="w-full lg:w-1/4 text-dark">
          <h4 className="text-2xl md:text-3xl font-bold mb-4">Service area</h4>
          <p className="text-base md:text-lg">
            Deluxconex services 28+ US states. Our services vary in each state;
            please include zip code with your inquiry.
          </p>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h4 className="text-gray-500 text-lg md:text-xl mb-3">
                West Coast
              </h4>
              <ul className="text-dark">
                {westCoast.map((item) => (
                  <List key={item} name={item} />
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-gray-500 text-lg md:text-xl mb-3">
                Mid West
              </h4>
              <ul>
                {midWest.map((item) => (
                  <List key={item} name={item} />
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-gray-500 text-lg md:text-xl mb-3">
                East Coast
              </h4>
              <ul>
                {eastCoast.map((item) => (
                  <List key={item} name={item} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
