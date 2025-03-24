import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";

function Footer({
  logo,
  description,
  links = [],
  additionalContent,
}) {
  return (
    <footer className="border-t border-gray-200 dark:border-[#4e4f50]">
      <MaxWidthWrapper className="py-14 pb-20 flex flex-col items-center justify-center md:items-start md:justify-between md:flex-row">
        {/* Left Side - Logo & Description */}
        <div className="max-w-[16rem] flex flex-col space-y-4 items-center justify-center md:items-start md:justify-normal">
          <Link href="/" className="flex items-center z-40 font-bold text-lg">
            {logo}
          </Link>

          {description && (
            <p className="text-gray-700 dark:text-white md:text-[0.875rem] font-medium text-center md:text-left">
              {description}
            </p>
          )}

          <small className="mb-2 block text-gray-700 dark:text-white select-none">
            {logo} &copy; {new Date().getFullYear()} - All rights reserved
          </small>
        </div>

        {/* Right Side - Links & Icons */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-24 mt-10 md:mt-0">
          {links.map((section, index) => (
            <div
              key={index}
              className="flex flex-col items-center md:items-start px-4"
            >
              <h3 className="font-semibold text-gray-400 dark:text-white mb-2">
                {section.title?.toUpperCase()}
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-white text-sm text-center md:text-left">
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="hover:underline hover:underline-offset-1 flex items-center space-x-2"
                  >
                    {typeof item.label === "string" ? (
                      <Link href={item.href}>{item.label}</Link>
                    ) : (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Content (e.g., Social Media, Newsletter) */}
        {additionalContent && (
          <div className="mt-10 md:mt-0">{additionalContent}</div>
        )}
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
