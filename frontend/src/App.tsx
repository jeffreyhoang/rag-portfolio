import StarField from './components/StarField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Education from './components/Education'
import Projects from './components/Projects'
import ChatAssistant from './components/ChatAssistant'
import Connect from './components/Connect'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <StarField />
      <Navbar />
      <main>
        <Hero />
        <Education />
        <Projects />
        <Connect />
      </main>
      <Footer />
      <ChatAssistant />
    </>
  )
}
