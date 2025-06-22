import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const faqData = [
  {
    value: "item-1",
    question: "How do I book a vehicle or travel package?",
    answer:
      "Simply browse our selection, choose your preferred vehicle or package, select your dates, and click “Book Now”. Follow the on-screen prompts to complete your reservation securely.",
  },
  {
    value: "item-2",
    question: "Do I need an international driving license?",
    answer:
      "Yes, for vehicle rentals, international travelers are required to present a valid international driving permit along with their original license.",
  },
  {
    value: "item-3",
    question: "What is included in the travel packages?",
    answer:
      "Each travel package is different, but they typically include transportation, guided tours, and entrance fees to specified destinations. Accommodation may be included in certain packages. Please check the details of each package.",
  },
  {
    value: "item-4",
    question: "What is your cancellation policy?",
    answer:
      "We offer free cancellations up to 24 hours before your rental or trip starts. Please refer to our full cancellation policy page for detailed terms and conditions.",
  },
];

// Animation variants for the staggered list of questions
const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FAQ() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <motion.div
            className="lg:sticky lg:top-24 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
              Find quick answers to common queries below. If you can't find what
              you're looking for, feel free to contact our support team.
            </p>
            <HelpCircle className="w-24 h-24 sm:w-32 sm:h-32 text-gray-100 mx-auto lg:mx-0" />
          </motion.div>

          {/* --- Right Column: The Accordion --- */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Accordion
              type="single"
              collapsible
              className="space-y-4 text-left w-full"
            >
              {faqData.map((item) => (
                <motion.div key={item.value} variants={itemVariants}>
                  <AccordionItem
                    value={item.value}
                    className="bg-gray-50/80 border border-gray-200/80 rounded-xl shadow-sm hover:border-gray-300 transition-colors"
                  >
                    <AccordionTrigger className="p-6 text-base font-semibold text-left hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
