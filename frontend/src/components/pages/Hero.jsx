import Button1 from "@/components/ui/Button1";
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"

function Hero({ onClickConnect }) {
    const name = "Jeffrey Hoang"
    let indexCounter = 0

    const openPdf = () => {
        window.open("resume.pdf", "_blank", "noopener, noreferrer")
    }

    const letterVariants = {
        offscreen: { opacity: 0, y: -50 },
        onscreen: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.2,
                duration: 0.8,
                delay: i * 0.05,
            },
        }),
    };

    const logoVariants = {
        offscreen: { opacity: 0, scale: 0.3 },
        onscreen: {
            opacity: 1,
            scale: 1,
            transition: {
            type: "spring",
            bounce: 0.3,
            duration: 1,
            },
        },
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center px-4">
            <motion.div
                className="relative mb-4"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={logoVariants}
            >
                <div 
                    className="
                        absolute inset-0 rounded-full
                        bg-gradient-to-br from-blue-500/50 via-indigo-500/40 to-fuchsia-500/40
                        blur-3xl animate-pulse
                    "   
                />
                <img 
                    src="/profile.png" 
                    alt="" 
                    className="
                        h-36 w-36 sm:h-64 sm:w-64 rounded-full object-cover
                        saturate-110 contrast-110
                    "
                />
            </motion.div>
            <motion.h1 
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                className="
                    font-name text-white text-center
                    text-7xl md:text-9xl
                "
            >
                {[...`${name}`.split(" ")].map(
                    (word, wordIndex) => (
                        <motion.span
                            key={wordIndex}
                            className="whitespace-nowrap mr-4 inline-flex"
                        >
                        {[...word].map((char) => (
                            <motion.span
                                key={`char-${indexCounter}`}
                                custom={indexCounter++}
                                variants={letterVariants}
                            >
                            {char}
                            </motion.span>
                        ))}
                        </motion.span>
                    )
                )}
            </motion.h1>
            <div className="relative w-full h-6 my-6">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"/>
            </div>
            <p className="font-head text-zinc-400 text-center text-md md:text-lg px-8 md:px-16">
                Master's student in Artificial Intelligence at San José State University, passionate about building AI systems that deliver real-world impact.
            </p>
            <div className="flex mt-8 gap-4">
                <Button1 
                    text="Resume" 
                    symbol={faFile} 
                    fullSpin={true} 
                    onClick={openPdf}
                />
                <Button1 
                    text="Let's Connect" 
                    symbol={faArrowRight} 
                    onClick={onClickConnect}
                />
            </div>
        </div>
    )
};

export default Hero;

