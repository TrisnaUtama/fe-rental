import { DollarSign, Shield, Clock, Rocket } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const features = [
  {
    icon: DollarSign,
    title: "Best Prices",
    description:
      "Competitive rates with no hidden fees, ensuring you get the best value.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description:
      "Drive with peace of mind. All vehicles are fully insured and regularly maintained.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Our dedicated team is here to assist you around-the-clock, anytime you need.",
  },
  {
    icon: Rocket,
    title: "AI Recommendations",
    description:
      "Discover hidden gems with personalized destination suggestions powered by our AI.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const WhyChooseUs = () => {
  return (
    <section className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          // ... (animation props are unchanged)
        >
          {/* Responsive font sizes */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            An Unforgettable Journey
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our premium services, designed for
            the modern traveler.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            // This 'variants' prop will now be correctly typed
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-gray-50/80 p-8 rounded-2xl border h-full group transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-2">
                <div className="bg-white rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-md transition-colors duration-300 group-hover:bg-blue-600">
                  <feature.icon className="h-8 w-8 text-blue-600 transition-colors duration-300 group-hover:text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
