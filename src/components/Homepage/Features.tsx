import { motion } from "framer-motion";
import carriage from "../../assets/images/carriage-left.webp";
import warehouse from "../../assets/images/warehousads.webp";
import chassis from "../../assets/images/container_chassis.webp";
import ramps from "../../assets/images/ramps_0.webp";
import gallery from "../../assets/images/gallery2.webp";

interface FeatureCardProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  subtitle,
  description,
  buttonText,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        <h4 className="text-lg md:text-2xl font-medium text-white">
          {subtitle}
        </h4>
        <h3 className="text-2xl md:text-4xl font-bold text-white mt-1">
          {title}
        </h3>
        <p className="text-sm md:text-xl font-light text-white mt-2 max-w-[90%] md:max-w-[80%]">
          {description}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-6 bg-light text-dark text-base md:text-xl font-bold py-2 px-6 md:py-4 md:px-8 rounded-lg hover:bg-light/90 transition w-max"
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
};

interface FeatureSection {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  className: string;
}

export const Features: React.FC = () => {
  const featureSections: FeatureSection[] = [
    {
      image: carriage,
      title: "Refrigerated containers",
      subtitle: "Secure & reliable",
      description:
        "Keep perishables fresh with advanced temperature control containers.",
      buttonText: "View cold storage",
      className: "md:w-3/5 w-full",
    },
    {
      image: warehouse,
      title: "Container modifications",
      subtitle: "Tailored container solutions",
      description:
        "Customize your container with expert, tailored modification services.",
      buttonText: "View modifications",
      className: "w-full",
    },
    {
      image: chassis,
      title: "Container chassis",
      subtitle: "Efficient container transport",
      description:
        "Robust chassis for safe and efficient container transportation.",
      buttonText: "View chassis",
      className: "w-full",
    },
    {
      image: ramps,
      title: "Parts & add-ons",
      subtitle: "Customizable",
      description:
        "Enhance your containers with doors, windows, shelving, and insulation.",
      buttonText: "View add-ons",
      className: "w-full md:w-1/2",
    },
    {
      image: gallery,
      title: "Project gallery",
      subtitle: "View our work",
      description:
        "Explore our gallery for innovative container solutions, from offices to custom storage.",
      buttonText: "View projects",
      className: "w-full md:w-1/2",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Top Row - Large Feature + 2 Small Features Stacked */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Large Left Feature */}
        <FeatureCard
          {...featureSections[0]}
          className="h-[400px] md:h-[600px]"
        />

        {/* Right Column - Two Small Features */}
        <div className="flex flex-col gap-4 md:gap-6 w-full md:w-2/5">
          <FeatureCard
            {...featureSections[1]}
            className="h-[300px] md:h-[290px]"
          />
          <FeatureCard
            {...featureSections[2]}
            className="h-[300px] md:h-[290px]"
          />
        </div>
      </div>

      {/* Bottom Row - Two Medium Features */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <FeatureCard
          {...featureSections[3]}
          className="h-[300px] md:h-[400px]"
        />
        <FeatureCard
          {...featureSections[4]}
          className="h-[300px] md:h-[400px]"
        />
      </div>
    </div>
  );
};
