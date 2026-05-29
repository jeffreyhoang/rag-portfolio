import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion"

function SectionTitle({ title, symbol }) {
    let indexCounter = 0

    const letterVariants = {
        offscreen: { opacity: 0 },
        onscreen: (i) => ({
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.2,
                duration: 0.8,
                delay: i * 0.05,
            },
        }),
    };

    return (
        <div className="w-full mb-8">
            <div className="flex items-start gap-3">
                {/* Icon badge */}
                <motion.div 
                    className="
                        relative rounded-xl p-2
                        bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-blue-600/20
                        border border-blue-400/30
                        shadow-[0_0_20px_rgba(59,130,246,0.35)]
                    "
                    initial={{ rotate: 0 }}
                    whileInView={{ rotate: 360 }}
                    viewport={{ amount: 0.8 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <FontAwesomeIcon className="text-blue-400 text-lg md:text-2xl" icon={symbol} />
                </motion.div>
                <motion.h2 
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.3 }}
                    className="font-head font-bold text-white text-3xl md:text-4xl"
                >
                    {[...title].map((char) => (
                        <motion.span
                            key={indexCounter}
                            custom={indexCounter++}
                            variants={letterVariants}
                        >
                        {char}
                        </motion.span>
                    ))}
                </motion.h2>
            </div>
            <div className="relative w-full h-6 my-2">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"/>
            </div>
        </div>
    )
};

export default SectionTitle;