import { useState } from "react";
import SectionTitle from "@/components/text/SectionTitle";
import SuccessCheck from "@/components/misc/SuccessCheck";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion"

function Connect() {
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        const fd = new FormData();
        fd.append("access_key", "fb386c33-d8d5-401f-9697-cac4aaf945c5");
        fd.append("name", formData.name);
        fd.append("email", formData.email);
        fd.append("message", formData.message);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: fd
        });

        const data = await response.json();

        if (data.success) {
            setSignupSuccess(true);
            setTimeout(() => setSignupSuccess(false), 2000);
        } else {
            console.log("Error", data);
        }

        setFormData({
            name: "",
            email: "",
            message: ""
        })
    };

    return (
        <div>
            {/* Success Check */}
            {signupSuccess && (
                <SuccessCheck />
            )}

            {/* Title */}
            <div className="flex">
                <SectionTitle title="Let's Connect" symbol={faRocket} />
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.form
                    initial={{ opacity: 0, scale: 0.99}}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ amount: 0.4 }}
                    transition={{ duration: 0.4, ease: "easeout"}}
                    onSubmit={onSubmit}
                    className="
                        flex flex-col gap-3 rounded-2xl p-4
                        border border-indigo-400/20
                        bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-cyan-400/10
                        text-indigo-200
                        shadow-[0_0_0_1px_rgba(99,102,241,0.15)]                    "
                >
                    <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        className="
                            w-full rounded-lg border border-white/10 bg-white/5
                            px-3 py-2 text-xs md:text-sm text-zinc-100 placeholder:text-zinc-500
                            outline-none transition-all duration-200 ease-out
                            hover:bg-white/10 hover:border-indigo-300/40 hover:ring-indigo-400/20
                            focus:bg-white/12 focus:border-indigo-300/60
                            focus:ring-2 focus:ring-indigo-400/25
                        "
                        onChange={handleChange}
                        placeholder="Your Name"
                        required 
                    />
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        className="
                            w-full rounded-lg border border-white/10 bg-white/5
                            px-3 py-2 text-xs md:text-sm text-zinc-100 placeholder:text-zinc-500
                            outline-none transition-all duration-200 ease-out
                            hover:bg-white/10 hover:border-indigo-300/40 hover:ring-indigo-400/20
                            focus:bg-white/12 focus:border-indigo-300/60
                            focus:ring-2 focus:ring-indigo-400/25
                        "
                        onChange={handleChange}
                        placeholder="Your Email" 
                        required 
                    />
                    <textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        rows="3"
                        className="
                            w-full rounded-lg border border-white/10 bg-white/5
                            px-3 py-2 text-xs md:text-sm text-zinc-100 placeholder:text-zinc-500
                            outline-none transition-all duration-200 ease-out
                            hover:bg-white/10 hover:border-indigo-300/40 hover:ring-indigo-400/20
                            focus:bg-white/12 focus:border-indigo-300/60
                            focus:ring-2 focus:ring-indigo-400/25
                        "
                        onChange={handleChange}
                        placeholder="Your Message" 
                        required 
                    />
                    <button
                        type="submit"
                        className="
                            group mt-1 inline-flex items-center justify-center gap-2
                            rounded-lg px-4 py-2
                            bg-gradient-to-br from-indigo-500/90 to-indigo-700/90
                            text-xs md:text-sm font-semibold text-white
                            shadow-[0_0_0_1px_rgba(99,102,241,0.35),0_18px_40px_-25px_rgba(99,102,241,0.8)]
                            transition
                            hover:brightness-110 hover:cursor-pointer
                            focus:scale-97
                        "
                    >
                        <FontAwesomeIcon className="transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" icon={faPaperPlane} />
                        <span>Send Message</span>
                    </button>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.99 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1}}
                    viewport={{ amount: 0.4 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col gap-4 mt-4 md:mt-0"
                >
                    <div>
                        <h2 className="font-head text-lg md:text-xl font-semibold text-zinc-100">
                            Get In Touch
                        </h2>
                        <p className="mt-1 text-xs md:text-sm text-zinc-400">
                            I'm open to collaboration, research, and intership opportunities.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Email */}
                        <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-4 gap-4">
                            <div 
                                className="
                                    flex items-center justify-center p-2.5 rounded-xl
                                    border border-indigo-400/20
                                    bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-cyan-400/10
                                    text-indigo-200
                                    shadow-[0_0_0_1px_rgba(99,102,241,0.15)]
                                "
                            >
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-zinc-100">Email</p>
                                <p className="text-zinc-400">hoangjeffrey04@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-4 gap-4">
                            <div 
                                className="
                                    flex items-center justify-center p-2.5 rounded-xl
                                    border border-indigo-400/20
                                    bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-cyan-400/10
                                    text-indigo-200
                                    shadow-[0_0_0_1px_rgba(99,102,241,0.15)]
                                "
                            >
                                <FontAwesomeIcon icon={faLocationDot} />
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-zinc-100">Location</p>
                                <p className="text-zinc-400">San Jose, California, USA</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <h2 className="fond-head text-sm md:text-md font-semibold uppercase tracking-wide text-zinc-300">
                            Socials
                        </h2>
                        <div className="mt-3 flex gap-3 text-xl">
                            <a 
                                href="https://github.com/jeffreyhoang?tab=repositories"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    group flex items-center justify-center rounded-xl p-3
                                    border border-indigo-400/20
                                    bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-cyan-400/10
                                    text-indigo-200
                                    shadow-[0_0_0_1px_rgba(99,102,241,0.15)]
                                    transition-all duration-300
                                    hover:border-indigo-300/40
                                    hover:text-white
                                    hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]
                                    hover:bg-indigo-500/20
                                "
                            >
                                <FontAwesomeIcon className="transition-transform group-hover:-translate-y-[1px]" icon={faGithub} />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/jeffrey-hoang-095664260/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    group flex items-center justify-center rounded-xl p-3
                                    border border-indigo-400/20
                                    bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-cyan-400/10
                                    text-indigo-200
                                    shadow-[0_0_0_1px_rgba(99,102,241,0.15)]
                                    transition-all duration-300
                                    hover:border-indigo-300/40
                                    hover:text-white
                                    hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]
                                    hover:bg-indigo-500/20
                                "
                            >
                                <FontAwesomeIcon className="transition-transform group-hover:-translate-y-[1px]" icon={faLinkedin} />
                            </a>
                            <a 
                                href="mailto:hoangjeffrey04@gmail.com" 
                                target="_blank" 
                                rel="noopener noreferrer"                                
                                className="
                                    group flex items-center justify-center rounded-xl p-3
                                    border border-indigo-400/20
                                    bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-cyan-400/10
                                    text-indigo-200
                                    shadow-[0_0_0_1px_rgba(99,102,241,0.15)]
                                    transition-all duration-300
                                    hover:border-indigo-300/40
                                    hover:text-white
                                    hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]
                                    hover:bg-indigo-500/20
                                "
                            >
                                <FontAwesomeIcon className="transition-transform group-hover:-translate-y-[1px]" icon={faEnvelope} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
};

export default Connect;