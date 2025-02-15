import { Sparkle, } from 'lucide-react';
import { Cover } from '../aceternityComponents/Cover/cover';

function FeatureDisplay() {
    return (
        <section className=" py-24 pb-16 bg-[#f8f9fa] dark:bg-[#15202b]">
            <div className='max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto flex flex-col gap-4'>
                <h2 className='tracking-tight font-bold text-center md:text-left text-3xl lg:text-5xl lg:leading-[3.5rem]'>
                    All you need to do Lorem ipsum dolor sit amet <Cover>consectetur</Cover>
                </h2>
                <p className='font-semibold my-4 text-center md:text-left '>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In minima incidunt, rerum quia asperiores fugit ipsam. Labore iusto dolor autem. Lorem ipsum dolor sit amet consectetur adipisicing el
                </p>

                <div className='flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-8 md:gap-0 mt-4'>
                    <div className='flex flex-col items-center gap-2 group cursor-pointer'>
                        <Sparkle className={`h-5 w-5 md:h-10 md:w-10group-hover:text-gray-600 transition-colors duration-200`} />
                        <p className={`text-sm font-semibold  group-hover:text-gray-600 transition-colors duration-200`}>Feature One</p>
                    </div>
                    <div className='flex flex-col items-center gap-2 group cursor-pointer'>
                        <Sparkle className={`h-5 w-5 md:h-10 md:w-10group-hover:text-gray-600 transition-colors duration-200`} />
                        <p className={`text-sm font-semibold  group-hover:text-gray-600 transition-colors duration-200`}>Feature Two</p>
                    </div>
                    <div className='flex flex-col items-center gap-2 group cursor-pointer'>
                        <Sparkle className={`h-5 w-5 md:h-10 md:w-10group-hover:text-gray-600 transition-colors duration-200`} />
                        <p className={`text-sm font-semibold  group-hover:text-gray-600 transition-colors duration-200`}>Feature Three</p>
                    </div>
                    <div className='flex flex-col items-center gap-2 group cursor-pointer'>
                        <Sparkle className={`h-5 w-5 md:h-10 md:w-10group-hover:text-gray-600 transition-colors duration-200`} />
                        <p className={`text-sm font-semibold  group-hover:text-gray-600 transition-colors duration-200`}>Feature Four</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeatureDisplay