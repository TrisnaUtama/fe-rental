import { Star, Quote } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from "framer-motion";

import { useAllRating } from "@/features/customer/rating/hooks/useRating";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import type { IRating } from '@/features/customer/rating/types/rating.type';

export const Testimonial = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  
  const { data: response, isLoading } = useAllRating();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const testimonials = response?.data;

  if (!testimonials || testimonials.length === 0) {
    return (
      <motion.section 
        className="py-20 px-4 bg-gray-50 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Reviews Yet</h2>
          <p className="text-lg text-gray-600">Be the first to share your experience with us!</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
        className="py-20 px-4 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by Travelers Worldwide
          </h2>
          <p className="text-lg text-gray-600">
            Real experiences from adventurers who explored with us.
          </p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial: IRating) => (
              <div key={testimonial.id} className="flex-grow-0 flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 px-2 sm:px-4">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg h-full flex flex-col">
                  <Quote className="absolute top-6 right-6 w-16 h-16 text-gray-100/80" />
                  <div className="relative z-10 flex flex-col flex-grow">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.ratingValue)].map((_, i) => (
                        <Star key={`filled-${i}`} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                      {[...Array(5 - testimonial.ratingValue)].map((_, i) => (
                        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 italic flex-grow">
                      "{testimonial.comment}"
                    </p>
                    <div className="flex items-center border-t border-gray-100 pt-6">
                      <img
                        src={`https://placehold.co/48x48/EBF6FF/3B82F6?text=${testimonial.user?.name.charAt(0)}`}
                        alt={`${testimonial.user?.name || 'User'} avatar`}
                        className="w-12 h-12 rounded-full mr-4 object-cover bg-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.user?.name || 'Anonymous Traveler'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonial;
