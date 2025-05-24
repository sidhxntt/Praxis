import { cn } from "@/lib/utils";
import {
  SiRedis,
  SiGmail,
  SiGrafana,
  SiPrometheus,
  SiWebauthn,
  SiSentry,
  SiDjango,
  SiSwagger,
  SiKibana,
  SiElasticsearch,
} from "react-icons/si";
import {
  FaDollarSign,
  FaSms,
  FaGoogle,
  FaGithub,
  FaAws,
  FaDocker,
} from "react-icons/fa";
import { FaInfinity } from "react-icons/fa6";
import { RiAdminLine, RiSupabaseFill } from "react-icons/ri";
import { MdSecurity } from "react-icons/md";


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
        (index === 0 || index === 4 || index === 8 || index === 12) &&
          "lg:border-l border-neutral-800",
        index < 12 && "lg:border-b border-neutral-800" // Changed from index < 4 to index < 8
      )}
    >
      {index < 12 && ( // Changed from index < 4 to index < 8
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 12 && ( // Changed from index >= 4 to index >= 8
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
      title: "Django Rest Framework (DRF)",
      description:
        "Praxis Pro leverages Django Rest Framework (DRF) for more advance backend infrastructure.",
      icon1: <SiDjango size={"30px"} />,
    },
    {
      title: "Supabase",
      description: "Praxis Pro uses Supabase as the default database.",
      icon1: <RiSupabaseFill size={"30px"} />,
    },
    {
      title: "ORM and Caching",
      description:
        "Praxis Pro comes with inbuilt Django ORM and Redis for caching.",
      icon1: <SiRedis size={"30px"} />,
    },
    {
      title: "Dockerised Backend",
      description:
        "Get Dockerised backend with docker-compose. Kubernetes coming soon.",
      icon1: <FaDocker size={"30px"} />,
    },
    {
      title: "Email and SMS",
      description:
        "Currently Praxis Pro supports Django inbuilt mail system for emails and Twilio for SMS in backend using Celery.",
      icon1: <SiGmail size={"30px"} />,
      icon2: <FaSms size={"30px"} />,
    },
    {
      title: "Payments",
      description:
        "Currently Praxis Pro supports LemonSqueezy for making transactions. Stripe coming soon.",
      icon1: <FaDollarSign size={"30px"} />,
    },
    {
      title: "Application Performace Monitoring",
      description: "With Praxis Pro get Prometheus and Grafana for APM.",
      icon1: <SiPrometheus size={"30px"} />,
      icon2: <SiGrafana size={"30px"} />,
    },
    {
      title: "Authorisation & Authentication",
      description:
        "Get JWT based authorisation & authentication specifically tailored for APIs. ",
      icon1: <SiWebauthn size={"30px"} />,
    },
    {
      title: "OAuth",
      description:
        "Praxis Pro currently supports Google and Github Oauth integrations. You can add as many as you want and its super easy using django-allauth. ",
      icon1: <FaGoogle size={"30px"} />,
      icon2: <FaGithub size={"30px"} />,
    },
    {
      title: "Custom User Model & Django Admin",
      description:
        "Get Custom User model instead of Django's default User model with enhanced features. See FAQs for more details.",
      icon1: <RiAdminLine size={"30px"} />,
      // icon2: <SiShadcnui size={"30px"} />,
    },
    {
      title: "ELK Stack",
      description:
        "With Praxis Pro get ELK stack for centralised logging using filebeat and faster searching of data using Elasticsearch.",
      icon1: <SiElasticsearch size={"30px"} />,
      icon2: <SiKibana size={"30px"} />,
    },
    {
      title: "API Documentation",
      description: "Get API documentation with Swagger and Redoc. ",
      icon1: <SiSwagger size={"30px"} />,
    },
    {
      title: "Advance Middlewares & Security",
      description:
        "Get advanced middlewares such as rate limitter, api auditer, IP tracking, User Activity etc.",
      icon1: <MdSecurity size={"30px"} />,
    },
    {
      title: "Sentry",
      description:
        "Get centralised error logging with advance error stack, tracibility, backtracking, analysis using Sentry SDK.",
      icon1: <SiSentry size={"30px"} />,
    },
    {
      title: "Storage",
      description:
        "Get Django-storages (e.g., S3, Azure) for managing media/static files remotely.",
      icon1: <FaAws size={"30px"} />,
    },
    {
      title: "And everything else",
      description:
        "Get sample Schema, database seeder, django_filters, health_check, OOPS based Approach and custom pdm scripts etc. ",
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
