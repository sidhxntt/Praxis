import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faqs } from "@/SampleData/LandingPage/faq-data";

function FaqSection() {
  return (
    <section className="bg-white/80 dark:bg-[#020817] py-20" id="faq">
      <div className="max-w-sm sm:max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12 capitalize">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-slate-100/50 dark:bg-[#15202b] p-4 px-7 rounded-lg hover:shadow"
            >
              <AccordionTrigger className="flex items-center w-full py-0.5 text-left  dark:text-white text-zinc-950">
                <span className="ml-2 dark:text-white text-zinc-950 text-xl font-semibold">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="origin-left">
                <p className="pl-6 pr-2 leading-relaxed dark:text-white  text-zinc-500">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FaqSection;
