import SectionTitle from "@/components/ui/SectionTitle";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"

const projects = [
    {
        title: "RAG Portfolio",
        img: "/projects/rag-portfolio.png",
        demo: "https://github.com/jeffreyhoang/rag-portfolio",
        github: "https://github.com/jeffreyhoang/rag-portfolio",
        skills: ["Python", "Fast API", "React", "LangChain", "HuggingFace", "OpenAI API", "ChromaDB / Pinecone", "Tailwind CSS"],
        description: "Production RAG pipeline with cosine similarity retrieval, cross-encoder reranking, and ragas evaluation - powering the AI assistant on this portfolio."
    }, {
        title: "ASL Recognition",
        img: "/projects/asl-recognition.png",
        demo: "https://github.com/jeffreyhoang/ASL-Recognition",
        github: "https://github.com/jeffreyhoang/ASL-Recognition",
        skills: ["Python", "PyTorch", "MediaPipe", "Flask", "React", "OpenCV", "BiLSTM", "Transformer"],
        description: "Real-time ASL recognition system achieving 73% accuracy using BiLSTM with self-attention to convert webcam-captured hand movements into coherent text."
    }, {
        title: "Multimodal Sentiment Analysis",
        img: "/projects/sentiment-analysis.png",
        demo: "https://github.com/jeffreyhoang/Multimodal-Sentiment-Analysis",
        github: "https://github.com/jeffreyhoang/Multimodal-Sentiment-Analysis",
        skills: ["Python", "PyTorch", "ResNet", "BERT", "HuggingFace", "scikit-learn"],
        description: "Sentiment analysis system comparing unimodal and multimodal models using text and image data, evaluating score-level, embedding-level, and gated fusion strategies."
    }, {
        title: "Resume AI",
        img: "/projects/resumeai.png",
        demo: "https://resume-ai-three-sigma.vercel.app/",
        github: "https://github.com/jeffreyhoang/ResumeAI",
        skills: ["Python", "Javascript", "Flask", "React", "Tailwind CSS", "OpenAI API"],
        description: "AI-assisted resume builder that formats your information into a professional PDF and delivers personalized improvement suggestions."
    }, {
        title: "Sloka",
        demo: "https://sloka.vercel.app/",
        github: "https://github.com/jeffreyhoang/sloka",
        img: "/projects/sloka.png",
        skills: ["Typescript", "Next.js", "Tailwind CSS", "Framer Motion", "Supabase", "OpenAI API"],
        description: "Full-stack web application for K–12 education that leverages AI to deliver personalized, adaptive learning experiences."
    }
]

function Projects() {
    return (
        <div>
            {/* Title */}
            <div className="flex">
                <SectionTitle title="Featured Projects" symbol={faFolderOpen} />
            </div>
            <div className="grid grid-cols-1 gap-8 md:gap-4 md:grid-cols-2">
                {projects.map((project) => (
                    <motion.div 
                        key={project.title}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ amount: 0.1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="
                            group relative overflow-hidden rounded-2xl flex flex-col
                            border border-indigo-400/20
                            bg-gradient-to-b from-indigo-500/10 via-indigo-400/[0.06] to-indigo-900/[0.08]
                            shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
                            transition-all duration-300
                            hover:-translate-y-1 hover:border-indigo-300/40 hover:shadow-[0_30px_80px_-35px_rgba(99,102,241,0.4)]
                        "
                    >
                        
                        <div className="relative h-50 w-full overflow-hidden">
                            <img 
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                src={project.img} 
                                alt="" 
                            />
                        </div>

                        <div className="flex flex-col gap-3 p-4 flex-1 justify-between">
                            <h2 className="font-head font-semibold text-md md:text-lg text-indigo-50">
                                {project.title}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {project.skills.map((skill) => (
                                    <div 
                                        key={`${project.title}-${skill}`}
                                        className="
                                            border-1 border-indigo-400/30 
                                            bg-indigo-400/10 
                                            px-2 py-1 rounded-full text-xs md:text-sm text-indigo-100 
                                            transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo/400/20
                                        "
                                    >
                                        <p>{skill}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="font-body text-sm md:text-md text-indigo-50">{project.description}</p>
                            <div className="flex gap-6 mt-4">
                                <a 
                                    className="font-head font-bold text-blue-400 text-sm md:text-md flex items-center gap-1 transition-colors duration-200 hover:text-blue-300" 
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                                    <span>Live Demo</span>
                                </a>
                                <a 
                                    className="font-head font-bold text-zinc-400 text-sm md:text-md flex items-center gap-1 transition-colors duration-200 hover:text-zinc-300" 
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FontAwesomeIcon icon={faGithub} />
                                    <span>Github</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
};

export default Projects;