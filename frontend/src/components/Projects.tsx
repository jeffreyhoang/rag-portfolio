import { motion } from 'framer-motion'

interface Project {
  icon: string
  iconGradient: string
  title: string
  description: string
  tags: string[]
}

const projects: Project[] = [
  {
    icon: '🤖',
    iconGradient: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
    title: 'RAG Portfolio Assistant',
    description:
      'Production-deployed AI assistant with hybrid search, cross-encoder reranking, and ragas evaluation. The assistant you can chat with on this page.',
    tags: ['FastAPI', 'LangChain', 'ChromaDB', 'OpenAI'],
  },
  {
    icon: '🤟',
    iconGradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    title: 'ASL Recognition System',
    description:
      'Real-time American Sign Language recognition using BiLSTM with temporal attention. 73% accuracy, 1.25ms latency on CPU.',
    tags: ['PyTorch', 'MediaPipe', 'BiLSTM', 'OpenAI'],
  },
  {
    icon: '🧠',
    iconGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    title: 'Human Motion Reconstruction',
    description:
      'Physics-based pipeline fitting 3D keypoint predictions to biomechanical models using forward kinematics on NVIDIA A100 GPUs.',
    tags: ['TensorFlow', 'MuJoCo', 'MediaPipe', 'HPC'],
  },
  {
    icon: '💬',
    iconGradient: 'linear-gradient(135deg, #7c3aed, #6366f1)',
    title: 'Multimodal Sentiment Analysis',
    description:
      'BERT + ResNet-18 multimodal fusion achieving 79.43% accuracy on Twitter sentiment with four fusion architectures compared.',
    tags: ['PyTorch', 'BERT', 'ResNet-18', 'Fusion'],
  },
  {
    icon: '📄',
    iconGradient: 'linear-gradient(135deg, #0d9488, #0891b2)',
    title: 'ResumeAI',
    description:
      'Full-stack AI-powered resume builder with real-time preview, AI recommendations, and one-click PDF export.',
    tags: ['React', 'Flask', 'OpenAI', 'WeasyPrint'],
  },
]

export default function Projects() {
  return (
    <section id="projects" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-tag">Selected Work</p>
          <h2 className="section-title font-cinzel">Featured Projects</h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              className="card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: p.iconGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                {p.icon}
              </div>

              <h3
                className="font-cinzel"
                style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}
              >
                {p.title}
              </h3>

              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.65, flex: 1 }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                {p.tags.map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
