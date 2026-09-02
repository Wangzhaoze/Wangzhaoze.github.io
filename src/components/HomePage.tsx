'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowDown,
  ArrowUpRight,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
} from 'lucide-react';
import RadarCanvas from './RadarCanvas';
import { education, experience, projects, publications, socialLinks } from '@/data/site';

const iconMap: Record<string, React.ReactNode> = {
  Email: <Mail size={15} />,
  LinkedIn: <Linkedin size={15} />,
  GitHub: <Github size={15} />,
  Scholar: <GraduationCap size={15} />,
  ORCID: <FileText size={15} />,
};

export default function HomePage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    lenis.on('scroll', ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', {
        opacity: 0,
        y: 34,
        duration: 1.15,
        stagger: 0.08,
        ease: 'power3.out',
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 38,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 86%', once: true },
        });
      });
      gsap.to('.hero-wordmark', {
        yPercent: 12,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Back to top">ZW<span>°</span></a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#about">About</a>
        </div>
        <a className="nav-contact" href="mailto:wangzhaoze@outlook.com">Contact <ArrowUpRight size={14} /></a>
      </nav>

      <section id="top" className="hero">
        <RadarCanvas />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-meta" data-hero>
          <span>PhD Researcher</span>
          <span>FORVIA HELLA</span>
          <span>Lippstadt, Germany</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow" data-hero>Radar · Generative AI · Autonomous Driving</p>
          <h1 className="hero-wordmark" data-hero><span>ZHAOZE</span><span>WANG</span></h1>
          <div className="hero-bottom" data-hero>
            <p>
              Building intelligent sensing systems at the boundary between
              <strong> simulation and reality.</strong>
            </p>
            <a className="scroll-cue" href="#work">Explore selected work <ArrowDown size={15} /></a>
          </div>
        </div>
      </section>

      <section id="work" className="section section-cream">
        <div className="section-header" data-reveal>
          <p className="section-index">01 / Selected work</p>
          <h2>Research made visible.</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className={`project-card project-${project.accent}`} key={project.title} data-reveal>
              <div className="project-visual" aria-hidden="true">
                <span className="project-number">{project.index}</span>
                <div className="visual-orbit" />
                <div className="visual-grid" />
              </div>
              <div className="project-content">
                <p className="project-eyebrow">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-links">
                  <a href={project.href} target="_blank" rel="noreferrer">View project <ArrowUpRight size={15} /></a>
                  <a href={project.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="research" className="section section-ink">
        <div className="section-header light" data-reveal>
          <p className="section-index">02 / Publications</p>
          <h2>Selected research.</h2>
        </div>
        {publications.map((publication) => (
          <article className="publication" key={publication.title} data-reveal>
            <div className="publication-image-wrap">
              <img src={publication.image} alt="RADxGPS result visualization" className="publication-image" />
            </div>
            <div className="publication-copy">
              <p className="venue">{publication.venue}</p>
              <h3>{publication.title}</h3>
              <p className="authors">{publication.authors}</p>
              <div className="publication-actions">
                <a href={publication.paper} target="_blank" rel="noreferrer">Paper <ArrowUpRight size={15} /></a>
                <a href={publication.project} target="_blank" rel="noreferrer">Project <ArrowUpRight size={15} /></a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section id="about" className="section section-cream about-section">
        <div className="about-lead" data-reveal>
          <p className="section-index">03 / About</p>
          <p className="about-statement">
            I work across <strong>automotive radar, computer vision, robotics and autonomous driving</strong>,
            with a current focus on radar simulation and generative AI.
          </p>
        </div>

        <div className="profile-panel" data-reveal>
          <img src="/images/profile.png" alt="Zhaoze Wang" className="profile-photo" />
          <div>
            <p className="profile-label">Currently</p>
            <h3>PhD Student @ FORVIA HELLA</h3>
            <p>Radar · Autonomous Driving · Generative AI</p>
          </div>
        </div>

        <div className="timeline-layout">
          <div className="timeline-column" data-reveal>
            <h3>Experience</h3>
            {experience.map((item) => (
              <div className="timeline-row" key={`${item.period}-${item.role}`}>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h4>{item.role}</h4>
                  <p>{item.place}</p>
                  <p className="timeline-detail">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="timeline-column" data-reveal>
            <h3>Education</h3>
            {education.map((item) => (
              <div className="timeline-row education-row" key={item.school}>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h4>{item.degree}</h4>
                  <p>{item.school}</p>
                </div>
              </div>
            ))}
            <a className="cv-link" href="/cv/Zhaoze-Wang-CV.pdf" target="_blank" rel="noreferrer">
              Full curriculum vitae <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top" data-reveal>
          <p>Let’s build what sensors can see next.</p>
          <a href="mailto:wangzhaoze@outlook.com">wangzhaoze@outlook.com <ArrowUpRight size={28} /></a>
        </div>
        <div className="social-row">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {iconMap[link.label]} {link.label}
            </a>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Zhaoze Wang</span>
          <span>Radar · AI · Autonomous Systems</span>
        </div>
      </footer>
    </main>
  );
}
