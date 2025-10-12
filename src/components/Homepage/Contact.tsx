import { motion } from "framer-motion";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../../services/api";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  zipCode: string;
  message: string;
};

const defaultFormState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  zipCode: "",
  message: "",
};

export const Contact = () => {
  const [formData, setFormData] = useState<ContactFormState>(defaultFormState);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      await api.post("/contact", {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        zipCode: formData.zipCode.trim(),
        message: formData.message.trim(),
      });

      setFeedback({
        type: "success",
        message: "Thanks! A DeluxConex specialist will reach out shortly.",
      });
      setFormData(defaultFormState);
    } catch (error: unknown) {
      const fallback =
        "We couldn't send your request right now. Please try again.";
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : undefined;

      setFeedback({
        type: "error",
        message: apiMessage || fallback,
      });
    } finally {
      setSubmitting(false);
    }
  };

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
          onSubmit={handleSubmit}
          className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 xl:w-1/2 flex flex-col space-y-3 md:space-y-4"
        >
          {[
            {
              name: "name",
              type: "text",
              placeholder: "Your Name",
              autoComplete: "name",
              required: true,
            },
            {
              name: "email",
              type: "email",
              placeholder: "Email",
              autoComplete: "email",
              required: true,
            },
            {
              name: "phone",
              type: "tel",
              placeholder: "Phone",
              autoComplete: "tel",
              required: false,
            },
            {
              name: "company",
              type: "text",
              placeholder: "Company",
              autoComplete: "organization",
              required: false,
            },
            {
              name: "zipCode",
              type: "text",
              placeholder: "Delivery zip code",
              autoComplete: "postal-code",
              required: false,
            },
          ].map((field) => (
            <motion.input
              key={field.name}
              whileFocus={{ scale: 1.01 }}
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof ContactFormState]}
              onChange={handleChange}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              required={field.required}
              className="p-3 md:p-4 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          ))}

          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            rows={6}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your project and timeline"
            required
            className="p-3 md:p-4 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="mt-4 md:mt-6 bg-light text-dark text-lg md:text-xl font-extrabold py-3 px-6 md:py-4 md:px-8 rounded-lg hover:bg-light/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Get a quote"}
          </motion.button>

          <p className="mt-2 text-sm md:text-base lg:text-lg font-extralight">
            Your privacy is{" "}
            <span className="text-blue-400 font-medium">our policy</span>.
          </p>

          {feedback && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm md:text-base ${
                feedback.type === "success" ? "text-green-600" : "text-red-600"
              }`}
              role="status"
              aria-live="polite"
            >
              {feedback.message}
            </motion.p>
          )}
        </motion.form>
      </div>
    </div>
  );
};
