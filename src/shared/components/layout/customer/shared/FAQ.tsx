import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";

export function FAQ() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Still have questions? We're here to help.
        </p>

        <Accordion type="single" collapsible className="space-y-4 text-left">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I book a vehicle?</AccordionTrigger>
            <AccordionContent>
              Simply browse our fleet, choose your preferred vehicle, and click
              “Book Now”. Follow the prompts to complete your booking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Do I need an international driving license?
            </AccordionTrigger>
            <AccordionContent>
              Yes, international travelers are required to present a valid
              international driving permit when renting a vehicle.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Is fuel included in the rental price?
            </AccordionTrigger>
            <AccordionContent>
              No, fuel is not included. Vehicles are provided with a full tank
              and should be returned in the same condition.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I cancel my booking?</AccordionTrigger>
            <AccordionContent>
              Yes, cancellations are allowed up to 24 hours before your rental
              starts. Please refer to our cancellation policy for full details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
