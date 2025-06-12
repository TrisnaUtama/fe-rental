import { CarFront, Link, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <CarFront className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">BaliRent</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for exploring the beauty of Bali
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 cursor-pointer transition-colors">
                <span className="text-xs">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 cursor-pointer transition-colors">
                <span className="text-xs">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 cursor-pointer transition-colors">
                <span className="text-xs">i</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Car Rental
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Motorbike Rental
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Driver Service
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Tour Packages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Destinations</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Ubud
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Seminyak
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Canggu
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Nusa Penida
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+62 361 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@balirent.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Denpasar, Bali, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BaliRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
