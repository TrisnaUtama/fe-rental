import { CarFront, Mail, MapPin, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

const footerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative pt-24 pb-12 px-4">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-24 text-gray-900">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-current"></path>
            </svg>
        </div>

        <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* This variants prop will now be correctly typed */}
                <motion.div variants={footerVariants} className="space-y-4">
                    <Link to="/" className="flex items-center space-x-2 mb-4">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <CarFront className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">XYZ</span>
                    </Link>
                    <p className="text-gray-400">Your trusted partner for exploring the beauty of Bali with freedom and confidence.</p>
                    <div className="flex space-x-3 pt-2">
                        <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors"><Facebook className="w-5 h-5"/></a>
                        <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors"><Twitter className="w-5 h-5"/></a>
                        <a href="#" className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors"><Instagram className="w-5 h-5"/></a>
                    </div>
                </motion.div>

                <motion.div variants={footerVariants}>
                    <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link to="/car-rental" className="hover:text-white transition-colors">Car Rental</Link></li>
                        <li><Link to="/travel" className="hover:text-white transition-colors">Tour Packages</Link></li>
                        <li><Link to="/destination" className="hover:text-white transition-colors">Top Destinations</Link></li>
                        <li><Link to="/ai" className="hover:text-white transition-colors">AI Trip Planner</Link></li>
                    </ul>
                </motion.div>

                <motion.div variants={footerVariants}>
                    <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    </ul>
                </motion.div>

                <motion.div variants={footerVariants}>
                    <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
                    <div className="space-y-4 text-gray-400">
                        <div className="flex items-start"><Phone className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>+62 361 123 4567</span></div>
                        <div className="flex items-start"><Mail className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>info@xyz.com</span></div>
                        <div className="flex items-start"><MapPin className="h-4 w-4 mr-3 mt-1 flex-shrink-0" /><span>Denpasar, Bali, Indonesia</span></div>
                    </div>
                </motion.div>
            </div>

            <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} PT. XYZ. All rights reserved.</p>
            </div>
        </motion.div>
    </footer>
  );
}