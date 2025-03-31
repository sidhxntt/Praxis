import { cn } from "@/lib/utils";

import {
  BiLogoTypescript,
  BiLogoJavascript,
  BiLogoPostgresql,
} from "react-icons/bi";
import { RiNextjsFill } from "react-icons/ri";
import {
  SiMongodb,
  SiPrisma,
  SiRedis,
  SiGmail,
  SiGrafana,
  SiVite,
  SiPrometheus,
  SiWebauthn,
  SiContentful,
  SiShadcnui
} from "react-icons/si";
import { FaDollarSign, FaSms, FaGoogle, FaGithub } from "react-icons/fa";
import { FaInfinity } from "react-icons/fa6";
import { AiTwotoneThunderbolt } from "react-icons/ai";

const FeatureSkeleton = ({
  title,
  description,
  icon1,
  icon2,
  index,
}: {
  title: string;
  description: string;
  icon1: React.ReactNode;
  icon2?: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-800",
        (index === 0 || index === 4 || index === 8) && "lg:border-l border-neutral-800",
        index < 8 && "lg:border-b border-neutral-800" // Changed from index < 4 to index < 8
      )}
    >
      {index < 8 && ( // Changed from index < 4 to index < 8
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 8 && ( // Changed from index >= 4 to index >= 8
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="flex gap-3">
        <div className="mb-4 relative z-10 pl-10 text-neutral-400">{icon1}</div>
        <div className="mb-4 relative z-10 text-neutral-400">{icon2}</div>
      </div>

      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
function FeaturesSectionDemo() {
  const features = [
    {
      title: "Choose between languages",
      description: "Choose TypeScript or JavaScript, whichever suits you best.",
      icon1: <BiLogoTypescript size={"30px"} />,
      icon2: <BiLogoJavascript size={"30px"} />,
    },
    {
      title: "Choose between frameworks",
      description:
        "Choose Vite.js or Next.js for frontend, whichever fits your needs.",
      icon1: <SiVite size={"30px"} />,
      icon2: <RiNextjsFill size={"30px"} />,
    },
    {
      title: "Choose between Databases",
      description:
        "Choose MongoDB or Postgres for database, whichever suits you best.",
      icon1: <SiMongodb size={"30px"} />,
      icon2: <BiLogoPostgresql size={"30px"} />,
    },
    {
      title: "ORM and Caching",
      description:
        "Currently Praxis supports Prisma ORM and Redis for caching in backend. More options coming soon.",
      icon1: <SiPrisma size={"30px"} />,
      icon2: <SiRedis size={"30px"} />,
    },
    {
      title: "Email and SMS",
      description:
        "Currently Praxis supports Nodemailer for emails and Twilio for SMS in backend using BullMQ. More options coming soon.",
      icon1: <SiGmail size={"30px"} />,
      icon2: <FaSms size={"30px"} />,
    },
    {
      title: "Payments",
      description:
        "Currently Praxis supports LemonSqueezy for making transactions. Stripe coming soon.",
      icon1: <FaDollarSign size={"30px"} />,
    },
    {
      title: "Dockerised production ready scalable backend",
      description:
        "With Praxis get dockerised backend with docker-compose added with prometheius and grafana for monitoring.",
      icon1: <SiPrometheus size={"30px"} />,
      icon2: <SiGrafana size={"30px"} />,
    },
    {
      title: "Authorisation & Authentication",
      description:
        "Get JWT based authorisation & authentication with passport.js. ",
      icon1: <SiWebauthn size={"30px"} />,
    },
    {
      title: "OAuth",
      description:
        "Praxis currently supports Google and Github Oauth integrations. You can add as many as you want",
      icon1: <FaGoogle size={"30px"} />,
      icon2: <FaGithub size={"30px"} />,
    },
    {
      title: "Contentful and Admin Dashboard",
      description: "Praxis fullstack templates comes with Contentful CMS for your saas documentation and fully functioning Shadcn Admin Dashboard.",
      icon1: <SiContentful size={"30px"} />,
      icon2: <SiShadcnui size={"30px"} />,
    },
    {
      title: "Object Oriented Programming",
      description: "Backend follows OOP-based architecture – Easy to scale and maintain.",
      icon1: <AiTwotoneThunderbolt size={"30px"} />,
    },
    {
      title: "And everything else",
      description: "Get custom middlewares such as rate limitter, logger etc, prebuild prisma schema for databases and sample data to seed it, and so much more. ",
      icon1: <FaInfinity size={"30px"} />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <FeatureSkeleton key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

export function Features() {
  return (
    <div
      id="features"
      className="w-full max-w-7xl mx-auto py-4 px-4 md:px-8 md:my-20 md:py-20"
    >
      <div className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-center text-lg font-semibold tracking-tight text-neutral-300 md:text-3xl">
        <h2
          className={cn(
            "inline-block text-3xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)]",
            "bg-clip-text text-transparent"
          )}
        >
          Features
        </h2>
      </div>
      <FeaturesSectionDemo />
    </div>
  );
}
