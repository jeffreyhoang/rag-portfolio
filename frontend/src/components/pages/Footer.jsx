import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

function Footer() {
    return (
        <div className="flex flex-col justify-center h-40 bg-white/5 border-t border-white/5">
            <div className="flex items-center justify-between px-4 md:px-16 lg:px-28">
                <h1 className="font-name text-white text-xl sm:text-3xl">Jeffrey Hoang</h1>
                <div className="flex gap-2">
                            <a 
                                href="https://github.com/jeffreyhoang?tab=repositories"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    flex items-center justify-center rounded-xl
                                    border border-white/10 bg-white/5 text-zinc-200 p-2 sm:p-3
                                    text-sm sm:text-md
                                    transition 
                                    hover:bg-white/10 hover:text-white hover:border-indigo-400/20 hover:cursor-pointer
                                "
                            >
                                <FontAwesomeIcon className="transition-transform group-hover:-translate-y-[1px]" icon={faGithub} />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/jeffrey-hoang-095664260/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    flex items-center justify-center rounded-xl
                                    border border-white/10 bg-white/5 text-zinc-200 p-2 sm:p-3
                                    text-sm sm:text-md
                                    transition 
                                    hover:bg-white/10 hover:text-white hover:border-indigo-400/20 hover:cursor-pointer
                                "
                            >
                                <FontAwesomeIcon className="transition-transform group-hover:-translate-y-[1px]" icon={faLinkedin} />
                            </a>
                            <a 
                                href="mailto:hoangjeffrey04@gmail.com" 
                                target="_blank" 
                                rel="noopener noreferrer"                                
                                className="
                                    flex items-center justify-center rounded-xl
                                    border border-white/10 bg-white/5 text-zinc-200 p-2 sm:p-3
                                    text-sm sm:text-md
                                    transition 
                                    hover:bg-white/10 hover:text-white hover:border-indigo-400/20 hover:cursor-pointer
                                "
                            >
                                <FontAwesomeIcon className="transition-transform group-hover:-translate-y-[1px]" icon={faEnvelope} />
                            </a>

                </div>
            </div>
            <div className="relative w-full h-6 my-2">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"/>
            </div>
            <div className="font-head text-xs text-white text-center space-y-2">
                <p>Made with ❤️ by Jeffrey Hoang</p>
                <p>@ 2026 All Rights Reserved</p>
            </div>
        </div>
    )
};

export default Footer;