import SectionTitle from "@/components/text/SectionTitle";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"

const skills = {
    "Programming Languages": ["Python", "Java", "JavaScript", "TypeScript", "HTML", "SQL"],
    "Frameworks": ["React", "Next.js", "Node.js", "Django", "Flask", "Tailwind CSS", "Framer Motion", "Aceternity UI"],
    "Machine Learning Libraries": ["TensorFlow", "PyTorch", "Keras", "Matplotlib", "scikit-learn", "NumPy", "Pandas", "OpenCV"],
    "Systems & Tools": ["Git", "Anaconda", "VS Code", "Jupyter", "HPC (SLURM)", "CUDA / GPU Acceleration"],
    "Databases & Cloud": ["PostgreSQL", "Supabase"],
};

const skillMeta = {
    "Python": { logo: "/logos/python.svg", href: "https://www.python.org/" },
    "Java": { logo: "/logos/java.svg", href: "https://www.java.com/" },
    "JavaScript": { logo: "/logos/javascript.svg", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    "TypeScript": { logo: "/logos/typescript.svg", href: "https://www.typescriptlang.org/" },
    "HTML": { logo: "/logos/html.svg", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    "SQL": { logo: "/logos/sql.svg" },

    "React": { logo: "/logos/react.svg", href: "https://react.dev/" },
    "Next.js": { logo: "/logos/nextjs.png", href: "https://nextjs.org/" },
    "Node.js": { logo: "/logos/nodejs.svg", href: "https://nodejs.org/" },
    "Django": { logo: "/logos/django.svg", href: "https://www.djangoproject.com/" },
    "Flask": { logo: "/logos/flask.png", href: "https://flask.palletsprojects.com/" },
    "Tailwind CSS": { logo: "/logos/tailwind.svg", href: "https://tailwindcss.com/" },
    "Framer Motion": { logo: "/logos/framer.svg", href: "https://www.framer.com/motion/" },
    "Aceternity UI": { logo: "/logos/aceternity.svg", href: "https://ui.aceternity.com/" },

    "TensorFlow": { logo: "/logos/tensorflow.svg", href: "https://www.tensorflow.org/" },
    "PyTorch": { logo: "/logos/pytorch.svg", href: "https://pytorch.org/" },
    "Keras": { logo: "/logos/keras.svg", href: "https://keras.io/" },
    "Matplotlib": { logo: "/logos/matplotlib.svg", href: "https://matplotlib.org/" },
    "scikit-learn": { logo: "/logos/scikit-learn.svg", href: "https://scikit-learn.org/" },
    "NumPy": { logo: "/logos/numpy.svg", href: "https://numpy.org/" },
    "Pandas": { logo: "/logos/pandas.svg", href: "https://pandas.pydata.org/" },
    "OpenCV": { logo: "/logos/opencv.svg", href: "https://opencv.org/" },

    "Git": { logo: "/logos/git.svg", href: "https://git-scm.com/" },
    "Anaconda": { logo: "/logos/anaconda.svg", href: "https://www.anaconda.com/" },
    "VS Code": { logo: "/logos/vscode.svg", href: "https://code.visualstudio.com/" },
    "Jupyter": { logo: "/logos/jupyter.svg", href: "https://jupyter.org/" },
    "HPC (SLURM)": { logo: "/logos/slurm.png", href: "https://slurm.schedmd.com/" },
    "CUDA / GPU Acceleration": { logo: "/logos/cuda.svg", href: "https://developer.nvidia.com/cuda-zone" },

    "PostgreSQL": { logo: "/logos/postgresql.svg", href: "https://www.postgresql.org/" },
    "Supabase": { logo: "/logos/supabase.svg", href: "https://supabase.com/" },

    "__default": { logo: "/logos/default.svg" },
};

function SkillPill({ name }) {
    const meta = skillMeta[name] ?? skillMeta.__default;
    const Pill = (
        <span className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/10">
            <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-md bg-transparent">
                <img
                    src={meta.logo}
                    alt={`${name} logo`}
                    className="h-4 w-4 object-contain opacity-90 transition group-hover:opacity-100"
                    loading="lazy"
                />
            </span>
            <span className="whitespace-nowrap text-xs md:text-sm">{name}</span>
                <span className="ml-1 text-xs md:text-sm text-zinc-400 opacity-0 transition group-hover:opacity-100">
                ↗
            </span>
        </span>
    );

    if (meta.href) {
        return (
            <a
                href={meta.href}
                target="_blank"
                rel="noreferrer"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-full"
                title={name}
            >
                {Pill}
            </a>
        );
    }

    return Pill;
}

function CategoryCard({ title, skills }) {
    return (
        <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.4 }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut",
                }}
                className="rounded-xl border border-white/25 bg-gradient-to-b from-white/5 to-white/[0.02] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm md:text-md font-semibold uppercase tracking-wide text-zinc-300">
                    {title}
                </h3>
                <span className="text-xs text-zinc-500">{skills.length}</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                    <SkillPill key={s} name={s} />
                ))}
            </div>
        </motion.div>
    );
}

function Skills() {
    return (
        <div className="space-y-2">
            <div className="flex">
                <SectionTitle title="Skills" symbol={faCode} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(skills).map(([category, list]) => (
                    <CategoryCard key={category} title={category} skills={list} />
                ))}
            </div>
        </div>
  );
};

export default Skills;