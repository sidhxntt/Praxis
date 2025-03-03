import { Tweet } from "react-tweet";
import MaxWidthWrapper from "../LandingPageLayout/MaxWidthWrapper";

interface TweetsProps {
  tweets: { id: string }[];
}

function Testimonials({ tweets }: TweetsProps) {
  return (
    <MaxWidthWrapper>
      <div className="text-center space-y-5 my-14" id="testimonials">
        <h1 className="font-bold text-4xl">6,893 happy customers</h1>
        <h2 className="font-semibold text-xl">
          Hear from our satisfied customers about their experience with our
          products and services.
        </h2>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tweets.map((tweet) => (
          <li key={tweet.id} className="break-inside-avoid">
            <Tweet id={tweet.id} />
          </li>
        ))}
      </ul>
    </MaxWidthWrapper>
  );
}

export default Testimonials;
