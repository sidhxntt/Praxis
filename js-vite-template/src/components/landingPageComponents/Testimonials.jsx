import { Tweet } from "react-tweet";
import MaxWidthWrapper from "../Layout/MaxWidthWrapper";

const tweets = [
  {
    id: "1881765010424385902",
  },
  {
    id: "1889727007128244284",
  },
  {
    id: "1881303462597779752",
  },
  {
    id: "1879559021012922761",
  },
  {
    id: "1840212070979313962",
  },
];

function Testimonials() {
  return (
    <MaxWidthWrapper>
      <div className="text-center space-y-5 my-14" id="testimonials">
        <h1 className="font-bold text-4xl">6,893 happy customers</h1>
        <h2 className="font-semibold text-xl">
          Hear from our satisfied customers about their experience with our
          products and services.
        </h2>
      </div>

      <ul className="mx-auto md:columns-2 lg:columns-3 space-y-4 md:space-y-6 md:gap-6">
        <li className="break-inside-avoid">
          <Tweet id={tweets[0].id} />
        </li>

        <li className="break-inside-avoid">
          <Tweet id={tweets[1].id} />
        </li>

        <li className="break-inside-avoid">
          <Tweet id={tweets[2].id} />
        </li>

        <li className="break-inside-avoid">
          <Tweet id={tweets[3].id} />
        </li>

        <li className="break-inside-avoid">
          <Tweet id={tweets[4].id} />
        </li>

        <li className="break-inside-avoid">
          <Tweet id={tweets[0].id} />
        </li>
      </ul>
    </MaxWidthWrapper>
  );
}

export default Testimonials;
