import { useEffect } from "react";
import disney from "../../assets/images/disney-storage-containers.svg";
import redbull from "../../assets/images/redbull-storage-containers.svg";
import spacex from "../../assets/images/spacex-storage-containers.svg";
import tesla from "../../assets/images/tesla-storage-containers.svg";
import walmart from "../../assets/images/walmart-storage-containers.svg";
import wholefoods from "../../assets/images/wholefoods-storage-containers.svg";
import amazon from "../../assets/images/amazon-storage-containers.svg";
import costa from "../../assets/images/costco-storage-containers.svg";
import video from "/side.mp4";
import centerVideo from "/center.mp4";
import { motion } from "framer-motion";

interface PartnerLogo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export const History = () => {
  const partners: PartnerLogo[] = [
    { src: disney, alt: "Disney", width: 120, height: 40 },
    { src: redbull, alt: "Redbull", width: 120, height: 40 },
    { src: spacex, alt: "SpaceX", width: 120, height: 40 },
    { src: tesla, alt: "Tesla", width: 120, height: 40 },
    { src: walmart, alt: "Walmart", width: 120, height: 40 },
    { src: wholefoods, alt: "Whole foods", width: 120, height: 40 },
    { src: amazon, alt: "Amazon", width: 120, height: 40 },
    { src: costa, alt: "Costa", width: 120, height: 40 },
  ];
  const duplicatedPartners = [...partners, ...partners];
  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".partners-scroll-container"
    );
    if (scrollContainer) {
      let scrollAmount = 0;
      const scrollSpeed = 1; // Adjust speed here (pixels per frame)

      const scroll = () => {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollContainer.scrollLeft = scrollAmount;
        requestAnimationFrame(scroll);
      };

      requestAnimationFrame(scroll);
    }
  }, []);
  return (
    <>
      <div className="py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="partners-scroll-container flex overflow-x-hidden">
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.alt}-${index}`}
                  className="flex-shrink-0 mx-8 flex items-center justify-center"
                  style={{ width: partner.width, height: partner.height }}
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="object-contain max-h-12 hover:grayscale-0 transition-all duration-300 hover:scale-105"
                    style={{
                      width: `${partner.width}px`,
                      height: `${partner.height}px`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 p-4 md:p-8 text-dark">
        {/* Left Column - Headline */}
        <div className="flex-1">
          <p className="text-3xl sm:text-4xl md:text-5xl font-extralight leading-tight">
            We build it better
          </p>
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mt-2">
            Since 2014
          </h3>
        </div>

        {/* Right Column - Description */}
        <div className="flex-1">
          <p className="font-extralight text-base sm:text-xl md:text-2xl leading-relaxed">
            Welcome to <span className="font-extrabold">Deluxconex</span>, where
            innovation meets durability. Whether you're looking for secure
            storage, custom office space, or unique container solution, we're
            here to build it better. Explore our wide range of new, used, and
            refurbished containers, backed by fast delivery and expert
            customization.
          </p>
          <p className="font-extralight text-base sm:text-xl md:text-2xl leading-relaxed mt-4">
            Discover how Deluxconex can transform your project. Let's bring your
            vision to life.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 bg-light text-dark text-lg sm:text-xl font-extrabold py-3 px-6 sm:py-4 sm:px-8 rounded-lg hover:bg-light/90 transition"
          >
            Get a quote
          </motion.button>
        </div>
      </div>
      <div className="relative overflow-hidden flex justify-center">
        <div className="p-8 w-full h-1/2">
          <video
            autoPlay
            loop
            muted
            className="relative top-0 left-0 w-full h-full object-cover z-0 rounded-lg"
          >
            <source src={centerVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-8 text-dark">
        {/* Left Column - Content */}
        <div className="lg:w-3/5">
          <p className="text-lg md:text-xl mb-3">
            Industry-leading container solution
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-extralight mb-2">
            Trusted by
          </p>
          <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3">
            26,000+ Customers
          </h3>

          <h4 className="text-lg md:text-xl font-bold mb-3">
            Containers for Sale: New, Used, and Refurbished
          </h4>

          <p className="text-base md:text-lg lg:text-xl font-extralight mb-4">
            We offer a wide selection of ISO and specialized containers for
            sale, including options for:
          </p>

          <ul className="mb-6 ml-4 md:ml-6 lg:ml-8 text-base md:text-lg lg:text-xl font-extralight list-disc space-y-2">
            {[
              "Energy storage",
              "Generator enclosures",
              "Refrigeration",
              "Hazardous material containment",
              "Workforce housing",
              "Restrooms",
              "Off-grid infrastructure solutions",
            ].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4 className="text-lg md:text-xl font-bold mb-4">
            Industry-Leading Rental Fleet
          </h4>

          <p className="text-base md:text-lg lg:text-xl font-extralight mb-6">
            Our rental fleet includes 10-45ft storage containers, ground-level
            offices, and refrigeration containers. With fast lead times, our
            award-winning service and professional delivery teams ensure your
            projects stay on schedule.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-light text-dark text-lg md:text-xl font-extrabold py-3 px-6 md:py-4 md:px-8 rounded-lg hover:bg-light/90 transition"
          >
            Get a quote
          </motion.button>
        </div>

        {/* Right Column - Video */}
        <div className="lg:w-2/5 my-6 lg:my-12">
          <div className="relative aspect-video w-full h-full rounded-lg overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </>
  );
};
