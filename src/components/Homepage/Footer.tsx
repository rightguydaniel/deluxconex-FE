import bic from "../../assets/images/bic.svg";
import abs from "../../assets/images/ABS.svg";
import iso from "../../assets/images/ISO.svg";
import bv from "../../assets/images/BV.svg";
import lr from "../../assets/images/LR.svg";
import dnv from "../../assets/images/DNV.svg";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface LinkProps {
  text: string;
  link?: string;
}

const Link: React.FC<LinkProps> = ({ text, link }) => {
  return (
    <li className="border-b border-gray-300 hover:bg-gray-100 hover:border-none hover:text-blue-500 py-2 text-sm font-extralight">
      <a href={link || "#"} className="block py-1">
        {text}
      </a>
    </li>
  );
};

export const Footer = () => {
  const navigation = [
    { name: "Looking for our W-9?", link: "#" },
    { name: "Blog", link: "#" },
    { name: "Credit application (fillable)", link: "#" },
    { name: "Terms & conditions", link: "#" },
    { name: "Shipping containers for sale", link: "#" },
    { name: "Rent storage container & offices", link: "#" },
    { name: "Cold storage containers", link: "#" },
    { name: "About us", link: "#" },
    { name: "Contact us", link: "#" },
    { name: "My account (log in)", link: "/auth" },
    { name: "Search", link: "#" },
  ];

  const certifications = [bic, abs, iso, bv, lr, dnv];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-200">
      {/* Certifications */}
      <div className="py-6 flex flex-wrap justify-center gap-4 md:gap-6 lg:justify-between">
        {certifications.map((cert, index) => (
          <motion.img
            key={index}
            src={cert}
            alt={`certification ${index}`}
            className="h-8 md:h-10 lg:h-12 object-contain"
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </div>

      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
        {/* Stay Connected */}
        <div className="space-y-4">
          <h4 className="text-xl md:text-2xl font-bold">Stay connected</h4>
          <p className="text-sm md:text-base">
            Join over 9,500 people who receive DIY tips and promotions.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 text-sm p-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-light text-dark text-sm font-extrabold py-3 px-4 sm:px-6 rounded-lg hover:bg-light/90 transition whitespace-nowrap"
            >
              Sign up
            </motion.button>
          </div>
          <div className="flex items-center gap-2 text-amber-500 mt-6">
            <p className="text-sm md:text-base">4.6</p>
            {[...Array(4)].map((_, i) => (
              <FaStar key={`full-${i}`} className="h-4 w-4 md:h-5 md:w-5" />
            ))}
            <FaStarHalfAlt className="h-4 w-4 md:h-5 md:w-5" />
            <p className="text-dark font-extralight text-sm md:text-base">
              300+ votes
            </p>
          </div>
        </div>

        {/* Our Philosophy */}
        <div className="space-y-4">
          <h4 className="text-xl md:text-2xl font-bold">Our philosophy</h4>
          <p className="text-sm font-extralight">
            Deluxconex strives to deliver the highest quality products and
            services to meet the demand and expectations of our valued
            customers. We pursue excellence and exceed industry standards
            because simply, #WeBuildItBetter
          </p>
          <p className="text-sm font-extralight">
            Follow us:{" "}
            {["Instagram", "Facebook", "LinkedIn", "YouTube"].map(
              (platform, i) => (
                <span key={platform}>
                  {i > 0 && " | "}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400"
                  >
                    {platform}
                  </a>
                </span>
              )
            )}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h4 className="text-xl md:text-2xl font-bold">Navigate</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            {navigation.map((item) => (
              <Link key={item.name} text={item.name} link={item.link} />
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="flex flex-col items-center text-center text-xs sm:text-sm font-extralight py-4 space-y-2">
        <div className="flex flex-wrap justify-center gap-x-2">
          <span>Headquartered in Miami</span>
          <span>|</span>
          <span>7am – 6pm Mon-Sat</span>
          <span>|</span>
          <a href="mailto:quote@deluxconex.com" className="hover:text-blue-500">
            quote@deluxconex.com
          </a>
          <span>|</span>
          <a href="tel:+17869529946" className="hover:text-blue-500">
            (786) 952-9946
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-x-2">
          <a href="#" className="hover:text-blue-500">
            Privacy Policy
          </a>
          <span>|</span>
          <a href="#" className="hover:text-blue-500">
            Sitemap
          </a>
          <span>© 2025 Deluxconex. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};
