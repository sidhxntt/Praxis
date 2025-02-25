import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollLink = ({ to, id, children, className }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === to && id) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location, to, id]);

  const handleClick = (e) => {
    if (location.pathname === to) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default ScrollLink;
