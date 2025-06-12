import { ChevronRight } from "lucide-react";

export const Cta = () => {
  return (
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
          <button className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg">
            Book Your Vehicle
            <ChevronRight className="inline ml-2 h-5 w-5" />
          </button>
          <button className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-lg hover:bg-blue-500 hover:text-white transition-colors font-medium text-lg">
            Explore Destinations
          </button>
        </div>
      </div>
    </section>
  );
};
