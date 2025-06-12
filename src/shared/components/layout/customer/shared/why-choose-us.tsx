import { DollarSign, Shield, Clock, Rocket } from "lucide-react";

export const WhyChoosee = () => {
  return (
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
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
              <DollarSign className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Best Prices
            </h3>
            <p className="text-gray-600">
              Competitive rates with no hidden fees
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
              <Shield className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fully Insured
            </h3>
            <p className="text-gray-600">
              All vehicles are fully insured and maintained
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
              <Clock className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-600">Round-the-clock customer assistance</p>
          </div>

          <div className="text-center group">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
              <Rocket className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors" />
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
  );
};
