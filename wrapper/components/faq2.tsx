"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconArrowRight } from "@/icons/arrow-right";

const FAQs = [
  {
    question: "Praxis VS Praxis Pro?",
    answer:
      "While Praxis is an overall solution where you can choose frontend, backend, fullstack, Praxis Pro focuses on backend solely to make it more powerful by leveraging Django. As Django is more powerful than Express for building full-featured apps out of the box, thanks to its built-in admin, ORM, authentication, security features etc.",
  },
  {
    question: "Is Praxis Pro only for SaaS development?",
    answer:
      "No, Praxis Pro focuses solely on the backend therefore it can be used to build anything.",
  },
  {
    question: "Can Praxis and Praxis Pro be integrated together?",
    answer:
      "Yes, You can leverage both of these tools to build your SaaS rapidly. If you need more powerful backend you can replace ExpressJS (Praxis) with Django (Praxis Pro) easily. Apart from this everything else remains the same." ,
  },
  {
    question: "Is Praxis Pro a boiler plate generator?",
    answer:
      "Yes, Praxis Pro allows you to set up your complex production grade Django infrastructure in seconds. Unlike Praxis, it comes with less flexibilty/options due to its main focus on backend infrastructure.",
  },
  {
    question: "Why Praxis Pro is using custom User Model?",
    answer:
      "Django’s default user model is limited and opinionated (e.g., username-based auth, no roles, minimal fields). Praxis Pro's User model provides production-ready features like email-based login, role management, security tracking, account locking, full profile support, and background email tasks—all of which are essential for real-world SaaS applications and hard to retrofit later.",
  },

];

export function FrequentlyAskedQuestionsPro() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div 
    id="faqs2"
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
