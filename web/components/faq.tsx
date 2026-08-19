"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconArrowRight } from "@/icons/arrow-right";
import Link from "next/link";

const FAQs = [
  {
    question: "Is Praxis just another boilerplate generator?",
    answer:
      "No, Praxis goes beyond traditional boilerplate generators. While standard boilerplates provide pre-configured starter code, Praxis offers a guided, interactive development experience with advanced customization options. For more details, refer to our documentation.",
  },
  {
    question: "Why shouldn't I rely solely on Next.js for fullstack development?",
    answer:
      "While Next.js can handle basic backend needs, it lacks the scalability and flexibility required for complex applications. As your project grows, you'll need proper microservices, stateful processes, background jobs, and real-time capabilities—features best supported by a dedicated, independent backend. Praxis provides this separation while maintaining seamless integration. Learn more in the documentation." ,
  },
  {
    question: "Can I use Praxis without a frontend template?",
    answer:
      "Yes, Praxis allows you to opt out of frontend templates if needed. While fullstack templates include integrated frontends templates by default (Vite/Next.js), you can choose backend-only configurations for greater flexibility.",
  },
  {
    question: "Which Praxis setup is right for my project?",
    answer:
      "Praxis adapts to your workflow. Whether you need a production-ready backend, a frontend landing page, or a complete end-to-end solution, Praxis provides tailored setups to match your requirements. The choice depends on your project's scope and development preferences.",
  },
  {
    question: "Is Praxis only for SaaS development?",
    answer:
      "While Praxis excels at SaaS development, it is versatile enough for any project—whether a personal website, custom web application, or enterprise SaaS platform. Its modular design ensures adaptability across various use cases. Try it to experience its flexibility firsthand.",
  }
];

export function FrequentlyAskedQuestions() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div 
    id="faqs"
    className="w-full max-w-7xl mx-auto my-10 md:my-20 py-10 md:py-20 px-4 md:px-8">
      <div className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-center">
        <h2
          className={cn(
            "inline-block text-3xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)]",
            "bg-clip-text text-transparent"
          )}
        >
          Let&apos;s Answer Your Questions
        </h2>
      </div>
      <p className="max-w-lg text-sm  text-center mx-auto mt-4 text-neutral-400 px-4 md:px-0">
       With these importatnt faqs we aim to provide maximum clarification.
      </p>
      <div className="mt-10 md:mt-20 max-w-3xl mx-auto divide-y divide-neutral-800">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <motion.div
      className="cursor-pointer py-4 md:py-6"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="pr-8 md:pr-12">
          <h3 className="text-base md:text-lg font-medium text-neutral-200">
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden text-sm md:text-base text-neutral-400 mt-2"
              >
                <p>{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative mr-2 md:mr-4 mt-1 h-5 w-5 md:h-6 md:w-6 flex-shrink-0">
          <motion.div
            animate={{
              scale: isOpen ? [0, 1] : [1, 0, 1],
              rotate: isOpen ? 90 : 0,
              marginLeft: isOpen ? "1.5rem" : "0rem",
            }}
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconArrowRight className="absolute inset-0 h-5 w-5 md:h-6 md:w-6 transform text-white-500" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
