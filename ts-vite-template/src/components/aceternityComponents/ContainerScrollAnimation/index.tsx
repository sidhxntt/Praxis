import { ContainerScroll } from "./ContainerScrollAnimation";
import VideoPlayer from "./Video";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll 
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Demo of your <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
               Cool Product
              </span>
            </h1>
          </>
        }
      >
       <VideoPlayer/>
      </ContainerScroll>
    </div>
  );
}
