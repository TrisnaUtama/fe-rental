import { ChevronRight, Compass } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const Cta = () => {
  return (
    <motion.section
      className="relative py-24 sm:py-32 px-4 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=1935&auto=format&fit=crop"
          alt="Scenic Balinese temple on the water"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          variants={itemVariants}
        >
          Your Balinese Adventure Awaits
        </motion.h2>

        <motion.p
          className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Don't just dream about it. Book your vehicle, plan your trip with our
          AI guide, and create unforgettable memories.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          {/* Primary Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            Book Your Vehicle
            <ChevronRight className="h-5 w-5" />
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/20 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
          >
            <Compass className="h-5 w-5" />
            Explore Destinations
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};
