import SectionTitle from "@/components/text/SectionTitle";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"

function Education() {
    const schools = [
        {
            name: "San Jose State University",
            degree: "Master of Science in Artificial Intelligence",
            date: "Jan 2026 – Present",
            gpa: "Incoming graduate Student"
        },
        {
            name: "California Polytechnic University, Pomona",
            degree: "Bachelor of Science in Computer Science",
            date: "Aug 2022 – Dec 2025",
            gpa: "GPA: 3.92 / 4.00"
        }
    ]

    return (
        <div>
            {/* Title */}
            <div className="flex">
                <SectionTitle title="Education" symbol={faGraduationCap} />
            </div>

            {/* Timeline */}
            <div className="relative">
                <div className="absolute left-[10px] top-0 bottom-0 w-px bg-blue-400/60" />
                <div className="absolute left-[10px] top-0 bottom-0 w-[6px] bg-blue-500/40 blur-md opacity-40" />
                <div className="flex flex-col gap-8">
                    {schools.map((school) => (
                        <div 
                            key={school.name} 
                            className="relative pl-12"
                        >
                            {/* Dot */}
                            <motion.div 
                                className="absolute left-0 top-2 h-5 w-5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,1)]" 
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ amount: 0.5 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            />

                            {/* Card */}
                            <motion.div 
                                className="rounded-xl border border-blue-400/25 bg-white/5 p-5 backdrop-blur"
                                initial={{ opacity: 0, x: -20, scale: 0.99 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                viewport={{ amount: 0.4 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                    <h3 className="font-head text-white text-lg md:text-xl font-semibold">
                                        {school.name}
                                    </h3>
                                    <span className="font-body text-white/70 text-xs md:text-sm">
                                        {school.date}
                                    </span>
                                </div>

                                <p className="font-body text-white/90 mt-1 text-sm md:textmd">
                                    {school.degree}
                                </p>

                                <p className="font-body text-blue-300/90 mt-2 text-xs md:text-sm">
                                    {school.gpa}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default Education;