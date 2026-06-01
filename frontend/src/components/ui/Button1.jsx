import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Button1({ text, symbol, fullSpin=false, onClick }) {
  return (
    <button
        className="
            group relative flex items-center gap-2
            px-5 py-2 rounded-xl
            border border-blue-400/60
            bg-black
            text-blue-400 text-md md:text-lg
            overflow-hidden
            transition-all duration-300 ease-out
            hover:border-blue-400
            hover:text-blue-300
            hover:shadow-[0_0_25px_rgba(59,130,246,0.55)]
            hover:cursor-pointer
            active:scale-95
        "
        onClick={onClick}
    >
        {/* Glow background */}
        <span
            className="
                absolute inset-0
                bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20
                opacity-0 blur-xl
                transition-opacity duration-300
                group-hover:opacity-100
            "
        />

        {/* Text */}
        <span className="relative font-header font-semibold">
            {text}
        </span>

        {/* Icon */}
        <span
            className={`               
                relative
                transition-transform duration-300 ease-out
                ${fullSpin ? "group-hover:rotate-360": "group-hover:rotate-90"}
            `}
        >
            <FontAwesomeIcon icon={symbol} />
        </span>
    </button>
  );
}

export default Button1;
