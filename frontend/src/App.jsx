import { SparklesCore } from "@/components/ui/sparkles";
import Homepage from '@/components/pages/Homepage';
import Education from '@/components/pages/Education';
import Skills from '@/components/pages/Skills';
import Projects from '@/components/pages/Projects';
import Connect from "@/components/pages/Connect";
import Footer from "@/components/pages/Footer";

function App() {
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }

    return (
        <div className="relative min-h-screen bg-black">
            {/* Sparkles */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <SparklesCore
                    background="transparent"
                    minSize={0.1}
                    maxSize={1.5}
                    particleDensity={50}
                    speed={4}
                    className="w-full h-full"
                    particleColor="#ffffffff"
                />
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-full max-w-3xl mb-12">
                    <Homepage onClickConnect={scrollToBottom} />
                </div>
                <div className="w-full max-w-3xl mt-4 mb-24 md:mb-48 px-4">
                    <Education />
                </div>
                <div className="w-full max-w-3xl mb-24 md:mb-48 px-4">
                    <Skills />
                </div>
                <div className="w-full max-w-3xl mb-24 md:mb-48 px-4">
                    <Projects />
                </div>
                <div className="w-full max-w-3xl mb-12 md:mb-24 px-4">
                    <Connect />
                </div>
                <div className="w-full">
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default App
