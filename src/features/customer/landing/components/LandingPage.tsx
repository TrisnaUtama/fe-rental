import { Link } from "react-router-dom";
import {
  CarFront,
  Palmtree,
  Rocket,
  Star,
  Users,
  Shield,
  Clock,
  ChevronRight,
  DollarSign,
  Heart,
  Camera,
  Waves,
  Mountain,
  Map,
  BotMessageSquare,
} from "lucide-react";
import { DatePickerWithRange } from "@/shared/components/ui/calender-range";
import { useState } from "react";

const menuBar = {
  Rent: <CarFront />,
  Destination: <Map />,
  Trip: <Palmtree />,
  Ai: <BotMessageSquare />,
};

const popularDestinations = [
  {
    name: "Ubud Rice Terraces",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    price: "From $45/day",
    icon: <Mountain className="h-4 w-4" />,
  },
  {
    name: "Seminyak Beach",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    price: "From $35/day",
    icon: <Waves className="h-4 w-4" />,
  },
  {
    name: "Tanah Lot Temple",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    price: "From $40/day",
    icon: <Camera className="h-4 w-4" />,
  },
  {
    name: "Kuta Beach",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    price: "From $30/day",
    icon: <Waves className="h-4 w-4" />,
  },
];

const vehicles = [
  {
    name: "Honda PCX 150",
    type: "Scooter",
    price: "$8/day",
    seats: "2",
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    name: "Toyota Avanza",
    type: "MPV",
    price: "$25/day",
    seats: "7",
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    name: "Yamaha NMAX",
    type: "Scooter",
    price: "$10/day",
    seats: "2",
    image: "/placeholder.svg?height=150&width=200",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Australia",
    rating: 5,
    comment:
      "Amazing experience exploring Bali! The car rental was smooth and the recommendations were perfect.",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "David Chen",
    location: "Singapore",
    rating: 5,
    comment:
      "Best way to explore Bali's hidden gems. Professional service and great vehicles!",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "Emma Wilson",
    location: "UK",
    rating: 5,
    comment:
      "The AI recommendations helped us discover places we never would have found. Highly recommended!",
    avatar: "/placeholder.svg?height=50&width=50",
  },
];

export default function LandingPage() {
  const [activeMenu, setActiveMenu] = useState<string>();

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="mx-4">
        <div className="bg-[#f0f3f5] w-full p-8 rounded-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="font-bold text-5xl md:text-6xl text-gray-900 leading-tight">
                  {activeMenu === "Rent"
                    ? "Find  Vehicle"
                    : activeMenu === "Destination"
                    ? " Find Destination"
                    : activeMenu === "Trip"
                    ? "Find Trip Package"
                    : "use AI"}{" "}
                  for your activity in{" "}
                  <span className="text-indigo-500">Bali.</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover the beauty of Bali with our {" "}
                  {activeMenu === "Rent"
                    ? "premium Vehicle"
                    : activeMenu === "Destination"
                    ? "recomendation Destination"
                    : activeMenu === "Trip" && "premium Trip Package"}
                  and AI-powered destination recommendations
                </p>
              </div>

              {/* Menu Bar */}
              <div className="flex gap-8 justify-center items-center flex-wrap">
                {Object.entries(menuBar).map(([key, value]) => (
                  <div className="flex flex-col items-center group" key={key}>
                    <Link
                      to="#"
                      onClick={() => setActiveMenu(key.toString())}
                      className={`flex items-center justify-center text-center p-4 rounded-xl border transition-all duration-300 group-hover:scale-105
                        ${
                          activeMenu === key.toString()
                            ? "bg-indigo-500 border-indigo-500 text-white shadow-xl -translate-y-1"
                            : "bg-white border-gray-100 text-gray-800 shadow-lg hover:bg-indigo-500 hover:border-indigo-500 hover:text-white hover:shadow-xl hover:-translate-y-1"
                        }
                      `}
                    >
                      <div className="h-6 w-6">{value}</div>
                    </Link>
                    <p
                      className={`mt-3 text-sm font-medium text-gray-700 group-hover:text-indigo-500 transition-colors ${
                        activeMenu === key.toString() && "text-indigo-500"
                      }`}
                    >
                      {key}
                    </p>
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4">
                  <div className="space-y-2">
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option>Denpasar Airport</option>
                      <option>Ubud Center</option>
                      <option>Seminyak</option>
                      <option>Canggu</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <DatePickerWithRange />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-colors font-medium">
                      Search Vehicles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations in Bali
            </h2>
            <p className="text-xl text-gray-600">
              Explore the most beautiful places with our recommended vehicles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {destination.icon}
                    <h3 className="ml-2 font-semibold text-lg text-gray-900">
                      {destination.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {destination.rating}
                      </span>
                    </div>
                    <span className="text-indigo-500 font-bold">
                      {destination.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Fleet */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Vehicle Fleet
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect vehicle for your Bali adventure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{vehicle.type}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{vehicle.seats} seats</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-500">
                      {vehicle.price}
                    </span>
                  </div>
                  <button className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors font-medium">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BaliRent?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the best of Bali with our premium services
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500 transition-colors">
                <DollarSign className="h-8 w-8 text-indigo-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Competitive rates with no hidden fees
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500 transition-colors">
                <Shield className="h-8 w-8 text-indigo-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fully Insured
              </h3>
              <p className="text-gray-600">
                All vehicles are fully insured and maintained
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500 transition-colors">
                <Clock className="h-8 w-8 text-indigo-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Round-the-clock customer assistance
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500 transition-colors">
                <Rocket className="h-8 w-8 text-indigo-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Recommendations
              </h3>
              <p className="text-gray-600">
                Personalized destination suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-indigo-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-indigo-100">
              Real experiences from travelers who explored Bali with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Explore Bali?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your adventure today with our premium vehicle rentals and
            AI-powered recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-500 text-white px-8 py-4 rounded-lg hover:bg-indigo-600 transition-colors font-medium text-lg">
              Book Your Vehicle
              <ChevronRight className="inline ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-indigo-500 text-indigo-500 px-8 py-4 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors font-medium text-lg">
              Explore Destinations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
