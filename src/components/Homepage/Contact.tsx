import { motion } from "framer-motion";

export const Contact = () => {
  return (
    <div className="py-8 md:py-12 text-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-dark text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
          Need a custom quote?
        </h3>
        <p className="text-base md:text-lg font-extralight mb-4 md:mb-6">
          We are open Monday-Friday 7am-6pm
        </p>
      </motion.div>

      <div className="flex justify-center">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          action=""
          className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 xl:w-1/2 flex flex-col space-y-3 md:space-y-4"
        >
          {[
            { type: "text", placeholder: "Your Name" },
            { type: "email", placeholder: "Email" },
            { type: "tel", placeholder: "Phone" },
            { type: "text", placeholder: "Company" },
            { type: "text", placeholder: "Delivery zip code" },
          ].map((field, index) => (
            <motion.input
              key={index}
              whileFocus={{ scale: 1.01 }}
              type={field.type}
              placeholder={field.placeholder}
              className="p-3 md:p-4 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          ))}

          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            rows={6}
            placeholder="Tell us more about your project and timeline"
            className="p-3 md:p-4 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-4 md:mt-6 bg-light text-dark text-lg md:text-xl font-extrabold py-3 px-6 md:py-4 md:px-8 rounded-lg hover:bg-light/90 transition"
          >
            Get a quote
          </motion.button>

          <p className="mt-2 text-sm md:text-base lg:text-lg font-extralight">
            Your privacy is{" "}
            <span className="text-blue-400 font-medium">our policy</span>.
          </p>
        </motion.form>
      </div>
    </div>
  );
};
