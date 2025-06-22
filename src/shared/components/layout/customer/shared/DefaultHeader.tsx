import { motion, type Variants } from "framer-motion";

interface HeroHeaderProps {
  line1: string;
  highlight: string;
  line2: string;
  subtitle: string;
}
const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export const HeroHeader = ({ line1, highlight, line2, subtitle }: HeroHeaderProps) => {
  const title = `${line1} ${highlight} ${line2}`;
  const words = title.split(" ");

  return (
    <div className="space-y-4">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-white"
        variants={titleContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mr-[0.2em]" 
          >
            {word === highlight ? (
              <span className="text-blue-400">{word}</span>
            ) : (
              word
            )}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-200/90 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: words.length * 0.08 }} // Delay until title finishes
      >
        {subtitle}
      </motion.p>
    </div>
  );
};


// You can also keep the DefaultHeader here if you use it on other pages
export const DefaultHeader = ({ title, subtitle }: { title: string, subtitle: string }) => {
    // ... This is the previously designed DefaultHeader component
    // We can add the same animations here for consistency
     const words = title.split(" ");
      return (
        <div className="space-y-4">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white"
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {words.map((word, index) => (
              <motion.span key={index} variants={wordVariants} className="inline-block mr-[0.2em]">
                  {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: words.length * 0.08 }}
          >
            {subtitle}
          </motion.p>
        </div>
      );
};