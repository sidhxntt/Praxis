"use client";

import { motion } from "motion/react";
import {
  IconBinaryTree,
  IconCloudOff,
  IconFileCode,
  IconShieldCheck,
} from "@tabler/icons-react";
import { products, type ProductKey } from "@/lib/products";

const cardIcons = [IconBinaryTree, IconFileCode, IconCloudOff, IconShieldCheck];

export function Testimonials({ product = "flow" }: { product?: ProductKey }) {
  const content = products[product];

  return (
    <section className="mx-auto my-16 w-full max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div>
          <div className="sticky top-28">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-neutral-700" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                How it works
              </p>
            </div>
            <h2 className="max-w-xl text-4xl leading-[1.05] tracking-[-0.035em] text-neutral-100 md:text-6xl">
              {content.proofTitle}
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-neutral-400">
              {content.proofDescription}
            </p>
            <div className="mt-10 hidden items-center gap-2 lg:flex">
              {content.proofCards.map(([title], index) => (
                <span key={title} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] text-neutral-500">
                    {index + 1}
                  </span>
                  {index < content.proofCards.length - 1 && <span className="h-px w-8 bg-white/10" />}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {content.proofCards.map(([title, description], index) => {
            const Icon = cardIcons[index];
            return (
              <motion.article
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}
                key={title}
                className="group relative min-h-64 overflow-hidden rounded-2xl border border-white/[0.09] bg-[linear-gradient(145deg,rgba(36,36,38,0.86),rgba(10,10,11,0.96))] p-6"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60" />
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-neutral-300 shadow-inner">
                    <Icon size={21} stroke={1.5} />
                  </div>
                  <span className="font-mono text-xs text-neutral-600">0{index + 1}</span>
                </div>
                <div className="mt-12">
                  <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-400">{description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
