import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const NAV_ITEMS = ["About", "Skills", "Projects", "Experience", "Contact"];
const ROCKET_ASSET = "/rocket.png";

const SKILLS = [
  { name: "Python", level: 90, cat: "Languages" },
  { name: "TensorFlow", level: 86, cat: "ML" },
  { name: "Keras", level: 85, cat: "ML" },
  { name: "Scikit-learn", level: 82, cat: "ML" },
  { name: "Pandas", level: 88, cat: "Data" },
  { name: "NumPy", level: 86, cat: "Data" },
  { name: "Django", level: 80, cat: "Web" },
  { name: "SQL", level: 84, cat: "Database" },
  { name: "Java", level: 72, cat: "Languages" },
  { name: "C/C++", level: 74, cat: "Languages" },
  { name: "Git", level: 88, cat: "Tools" },
  { name: "Tableau", level: 70, cat: "Tools" },
];

const PROJECTS = [
  {
    title: "PLACERA — Premium Placement Portal",
    desc: "A unified, real-time MERN-stack placement ecosystem connecting students, recruiters, and admins. Features secure JWT auth, linear application timelines, recruiter consoles, and comprehensive admin dashboard metrics.",
    tags: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS"],
    color: "#10b981",
    icon: "🎓",
    github: "https://github.com/Nawfal-Ahmed/Placera",
    live: "https://placera-17zu1s430-nawfalahmed204-8990s-projects.vercel.app/",
  },
  {
    title: "Stock Price Prediction (LSTM)",
    desc: "Built an end-to-end LSTM time-series forecasting pipeline (TensorFlow/Keras). Integrated model into a Django app with secure auth and SQL storage for real-time predictions.",
    tags: ["TensorFlow", "Keras", "Django", "Pandas"],
    color: "#00f5d4",
    icon: "📈",
    github: "https://github.com/Nawfal-Ahmed/Stock_Prediction",
    live: "https://stock-prediction-q2lt.onrender.com",
  },
  {
    title: "IMDB Sentiment Analysis",
    desc: "NLP model to classify IMDB movie reviews (TF-IDF, tokenization, stemming). Performed EDA and visualizations using Pandas, Matplotlib and Seaborn.",
    tags: ["NLP", "Scikit-learn", "Pandas"],
    color: "#f7b731",
    icon: "🎬",
    github: "https://github.com/Nawfal-Ahmed/IMDB-Sentiment-Analysis",
    live: "#",
  },
];

const EXPERIENCE = [
  {
    role: "Associate Software Developer (Intern)",
    company: "KIAQ PVT LTD",
    period: "Summer 2026",
    desc: "Internship focusing on full-stack development using the MERN stack, Tailwind CSS, and building REST APIs.",
    tags: ["MERN", "Tailwind", "REST APIs"],
  },
  {
    role: "B.Tech Computer Science and Engineering",
    company: "VIT Chennai",
    period: "2024 – 2028",
    desc: "CGPA: 8.89",
    tags: ["Data Structures", "Machine Learning", "Databases"],
  },
  {
    role: "Class XII - Computer Science",
    company: "Velammal Vidhyashram Mambakkam",
    period: "2023 – 2024",
    desc: "Percentage: 95.4%",
    tags: ["Computer Science", "Mathematics"],
  },
  {
    role: "Class X - Mathematics & Computer Science",
    company: "Velammal Vidhyashram Mambakkam",
    period: "2021 – 2022",
    desc: "Percentage: 96.4%",
    tags: ["Mathematics", "Computer Science"],
  },
];

// Skills grouped into categories for pill-based UI
const SKILL_CATEGORIES = [
  {
    title: "Machine Learning",
    skills: ["TensorFlow", "Scikit-learn", "Pandas", "NumPy"],
  },
  {
    title: "Backend Development",
    skills: ["Django","Express.js","REST APIs", "SQL" ,"MongoDB"],
  },
  {
    title: "Programming Languages",
    skills: ["Python","Java", "C/C++"],
  },
  {
    title: "Developer Tools",
    skills: ["Git", "Tableau"],
  },
];
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      a: Math.random(),
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,212,${p.a * 0.6})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,245,212,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function RocketLaunchOverlay({ payload, onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      const timer = window.setTimeout(() => onComplete(), 100);
      return () => window.clearTimeout(timer);
    }
  }, [onComplete, shouldReduceMotion]);

  const handleComplete = () => onComplete();

  return (
    <motion.div
      className="rocket-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="rocket-viewport"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="rocket-shell"
          initial={{ y: 0 }}
          animate={shouldReduceMotion ? {} : { y: ["0", "-55vh", "-140vh"] }}
          transition={{ delay: shouldReduceMotion ? 0 : 1, duration: shouldReduceMotion ? 0.4 : 1.1, ease: "easeInOut" }}
          onAnimationComplete={handleComplete}
        >
          <div className="rocket-center">
            <div className="rocket-image">
              <img src={ROCKET_ASSET} alt="Launch rocket" />
            </div>
            <div className="rocket-flames-center">
              <motion.div
                className="rocket-flames"
                animate={shouldReduceMotion ? {} : { scaleY: [0.9, 1.15, 1], opacity: [0.7, 1, 0.9] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flame core" />
                <div className="flame glow" />
                <div className="flame outer" />
              </motion.div>
            </div>
            <motion.div
              className="rocket-trail"
              animate={shouldReduceMotion ? {} : { opacity: [0.2, 0.65, 0.3], y: [0, -12, -40] }}
              transition={{ duration: 2.4, ease: "easeOut" }}
            />
            <div className="smoke-clouds">
              <motion.div className="smoke smoke-1" animate={shouldReduceMotion ? {} : { opacity: [0, 0.45, 0], y: [0, -4, -22], scale: [0.9, 1.1, 1.4] }} transition={{ duration: 2.2, ease: "easeOut" }} />
              <motion.div className="smoke smoke-2" animate={shouldReduceMotion ? {} : { opacity: [0, 0.35, 0], y: [0, -8, -36], scale: [0.8, 1.05, 1.3] }} transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }} />
              <motion.div className="smoke smoke-3" animate={shouldReduceMotion ? {} : { opacity: [0, 0.2, 0], y: [0, -12, -50], scale: [0.7, 1, 1.2] }} transition={{ duration: 2.2, ease: "easeOut", delay: 0.35 }} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function GlitchText({ text }) {
  return (
    <span className="glitch" data-text={text}>
      {text}
    </span>
  );
}

function SkillBar({ name, level, cat, delay }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const catColors = { Frontend: "#00f5d4", Backend: "#f7b731", Database: "#a29bfe", DevOps: "#fd79a8" };
  return (
    <div ref={ref} className="skill-bar-wrap" style={{ animationDelay: `${delay}ms` }}>
      <div className="skill-header">
        <span className="skill-name">{name}</span>
        <span className="skill-cat" style={{ color: catColors[cat] }}>{cat}</span>
        <span className="skill-pct">{level}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{
            width: animated ? `${level}%` : "0%",
            background: `linear-gradient(90deg, ${catColors[cat]}88, ${catColors[cat]})`,
            boxShadow: animated ? `0 0 10px ${catColors[cat]}88` : "none",
          }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ p, idx }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`project-card ${hovered ? "hovered" : ""}`}
      style={{ animationDelay: `${idx * 100}ms`, "--accent": p.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="project-icon">{p.icon}</div>
      <div className="project-glow" />
      <h3 className="project-title">{p.title}</h3>
      <p className="project-desc">{p.desc}</p>
      <div className="project-tags">
        {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="project-links">
        <a href={p.github} target="_blank" rel="noreferrer" className="proj-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
          GitHub
        </a>
        {p.live && p.live !== "#" && (
          <a href={p.live} target="_blank" rel="noreferrer" className="proj-link live">Live ↗</a>
        )}
      </div>
    </div>
  );
}

function ExperienceItem({ exp, idx }) {
  return (
    <div className="exp-item" style={{ animationDelay: `${idx * 120}ms` }}>
      <div className="exp-dot" />
      <div className="exp-line" />
      <div className="exp-content">
        <div className="exp-header">
          <div>
            <h3 className="exp-role">{exp.role}</h3>
            <span className="exp-company">{exp.company}</span>
          </div>
          <span className="exp-period">{exp.period}</span>
        </div>
        <p className="exp-desc">{exp.desc}</p>
        <div className="exp-tags">
          {exp.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("About");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRocketActive, setIsRocketActive] = useState(false);
  const [rocketPayload, setRocketPayload] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--scroll-position", `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    };
    document.documentElement.style.setProperty("--scroll-position", "0px");
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  const sendMailTo = (data) => {
    const subject = encodeURIComponent(data.subject || "New message from portfolio");
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
    window.location.href = `mailto:nawfalahmed786@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    if (shouldReduceMotion) {
      sendMailTo(data);
      return;
    }

    setRocketPayload(data);
    setIsRocketActive(true);
    setSubmitDisabled(true);
  };

  return (
    <div className="app">
      <ParticleCanvas />
      <AnimatePresence>
        {isRocketActive && rocketPayload ? (
          <RocketLaunchOverlay
            payload={rocketPayload}
            onComplete={() => {
              sendMailTo(rocketPayload);
              setIsRocketActive(false);
              setSubmitDisabled(false);
              setRocketPayload(null);
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("about")}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">Nawfal Ahmed</span>
          <span className="logo-bracket">/&gt;</span>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
          <span /><span /><span />
        </button>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                className={`nav-item ${active === item.toLowerCase() ? "active" : ""}`}
                onClick={() => scrollTo(item.toLowerCase())}
              >
                {item}
              </button>
            </li>
          ))}
          <li>
            <a href="/Nawfal_CV.pdf" className="nav-resume">Resume ↓</a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="about" className="hero">
        <div className="hero-content">
          <div className="hero-badge">Open to internships & projects</div>
          <h1 className="hero-title">
            <GlitchText text="Nawfal Ahmed" />
          </h1>
          <h2 className="hero-subtitle">
            B.Tech CSE Student · Machine Learning &amp; Full-Stack Development
          </h2>
          <p className="hero-bio">
            Highly motivated B.Tech Computer Science student with hands-on experience building end-to-end ML pipelines and deploying models. Skilled in TensorFlow, Keras, Pandas and Django; passionate about practical AI solutions and web development.
          </p>
          <div className="hero-socials">
            <a href="https://github.com/nawfal-ahmed" target="_blank" rel="noreferrer" className="social-btn github">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/nawfal-ahmed-174432323/" target="_blank" rel="noreferrer" className="social-btn linkedin">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              LinkedIn
            </a>
          </div>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo("projects")}>View Projects</button>
            <button className="btn-ghost" onClick={() => scrollTo("contact")}>Contact Me</button>
          </div>
        </div>
        <div className="hero-graphic">
          <div className="orbit-ring ring1">
            <div className="orbit-dot" style={{ "--c": "#00f5d4" }}>React</div>
          </div>
          <div className="orbit-ring ring2">
            <div className="orbit-dot" style={{ "--c": "#f7b731" }}>Node</div>
          </div>
          <div className="orbit-ring ring3">
            <div className="orbit-dot" style={{ "--c": "#a29bfe" }}>ML</div>
          </div>
          <div className="avatar-core">
            <span>NA</span>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">01</span>
            <h2 className="section-title">Skills & Technologies</h2>
          </div>
          <div className="skills-grid">
            {SKILL_CATEGORIES.map((group, gi) => (
              <div key={group.title} className="skill-category" style={{ animationDelay: `${gi * 80}ms` }}>
                <div className="skill-category-title">{group.title}</div>
                <div className="skill-category-divider" />
                <div className="skill-pill-row">
                  {group.skills.map((s) => (
                    <span key={s} className="skill-pill">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2 className="section-title">Projects</h2>
          </div>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} idx={i} />)}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2 className="section-title">Experience</h2>
          </div>
          <div className="exp-timeline">
            {EXPERIENCE.map((exp, i) => <ExperienceItem key={exp.company} exp={exp} idx={i} />)}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="section-inner contact-inner">
          <div className="section-header">
            <span className="section-num">04</span>
            <h2 className="section-title">Get In Touch</h2>
          </div>
          <p className="contact-sub">Have a project in mind or want to collaborate? I'd love to hear from you.</p>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <input name="name" className="form-input" placeholder="Your Name" required />
              <input name="email" type="email" className="form-input" placeholder="Email Address" required />
            </div>
            <input name="subject" className="form-input" placeholder="Subject" required />
            <textarea name="message" className="form-textarea" placeholder="Your message..." rows={5} required />
            <button type="submit" className="btn-primary submit-btn" disabled={submitDisabled}>
              {submitDisabled ? "Launching..." : "Send Message ↗"}
            </button>
          </form>
          <div className="contact-socials">
            <a href="mailto:nawfalahmed786@gmail.com" className="contact-link">nawfalahmed786@gmail.com</a>
            <span className="divider">·</span>
            <a href="tel:+918778905761" className="contact-link">+91 8778905761</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span className="logo-bracket">&lt;</span>
        <span>Built with React + Express</span>
        <span className="logo-bracket">/&gt;</span>
        <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: "0.8rem" }}>© {new Date().getFullYear()} Nawfal Ahmed</span>
      </footer>
    </div>
  );
}
