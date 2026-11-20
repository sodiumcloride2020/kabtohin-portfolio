import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Menu, X, Mail } from 'lucide-react'
import Admin from './Admin.jsx'

const projects = [
  { n: '01', type: 'PRINT DESIGN', title: 'Visual identities & print pieces', detail: 'Posters · Flyers · Brochures', tone: 'tone-one', symbol: 'P' },
  { n: '02', type: 'MOTION DESIGN', title: 'Stories brought into motion', detail: 'Motion graphics · Short-form video', tone: 'tone-two', symbol: 'M' },
  { n: '03', type: 'SOCIAL MEDIA', title: 'Ideas made for the feed', detail: 'Campaigns · Carousels · Social posts', tone: 'tone-three', symbol: 'S' },
]
const services = [
  ['01', 'Print Design', 'Posters, banners, brochures and flyers.'],
  ['02', 'Motion Design', 'Motion graphics and visual storytelling.'],
  ['03', 'Social Media Design', 'Campaign visuals, carousels and social content.'],
  ['04', 'Presentation Design', 'Clear, considered and engaging presentations.'],
]

function InstagramMark() {
  return <svg className="brand-icon instagram-mark" viewBox="0 0 24 24" role="img" aria-label="Instagram" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ig-gradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#FFDC80"/><stop offset="35%" stopColor="#F77737"/><stop offset="65%" stopColor="#E1306C"/><stop offset="100%" stopColor="#833AB4"/></linearGradient></defs>
    <rect x="2.2" y="2.2" width="19.6" height="19.6" rx="5.7" fill="none" stroke="url(#ig-gradient)" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4.25" fill="none" stroke="url(#ig-gradient)" strokeWidth="2"/>
    <circle cx="18" cy="6.2" r="1.25" fill="#E1306C"/>
  </svg>
}
function LinkedInMark() {
  return <svg className="brand-icon linkedin-mark" viewBox="0 0 24 24" role="img" aria-label="LinkedIn" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="22" height="22" rx="3" fill="#0A66C2"/>
    <path fill="#fff" d="M6.1 9.1h2.7v8.7H6.1zM7.45 5.1a1.57 1.57 0 1 1-.02 3.14 1.57 1.57 0 0 1 .02-3.14M10.4 9.1H13v1.19h.04c.36-.68 1.24-1.4 2.55-1.4 2.73 0 3.24 1.8 3.24 4.14v4.77h-2.72v-4.23c0-1.01-.02-2.3-1.4-2.3-1.4 0-1.61 1.1-1.61 2.23v4.3H10.4z"/>
  </svg>
}

function Label({ n, children }) {
  return <div className="section-label"><span>{n}</span><span>{children}</span></div>
}
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') return <Admin />
  return <main>
    <header className="header" id="top">
      <a className="logo" href="#top">KABTOHIN<span>®</span></a>
      <nav><a href="#work">Work</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact <ArrowUpRight size={13}/></a></nav>
      <a className="availability" href="#contact"><i/> Available for projects</a>
      <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X size={21}/> : <Menu size={21}/>}</button>
      {menuOpen && <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}>
        <nav className="mobile-menu" aria-label="Mobile navigation" onClick={e => e.stopPropagation()}>
          <div className="mobile-menu-head"><span>MENU</span><button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20}/></button></div>
          <a href="#work" onClick={() => setMenuOpen(false)}><span>01</span>Work<ArrowUpRight size={18}/></a>
          <a href="#about" onClick={() => setMenuOpen(false)}><span>02</span>About<ArrowUpRight size={18}/></a>
          <a href="#services" onClick={() => setMenuOpen(false)}><span>03</span>Services<ArrowUpRight size={18}/></a>
          <a href="#contact" onClick={() => setMenuOpen(false)}><span>04</span>Contact<ArrowUpRight size={18}/></a>
          <p>INDEPENDENT CREATIVE PRACTICE · DHAKA, BANGLADESH</p>
        </nav>
      </div>}
    </header>

    <section className="hero">
      <div className="hero-meta"><span>INDEPENDENT CREATIVE PRACTICE</span><span>DHAKA, BANGLADESH · 2026</span></div>
      <div className="hero-content">
        <p className="eyebrow">HELLO, I'M KABTOHIN</p>
        <h1>Creative<br/><em>Visual</em> Designer<span className="period">.</span></h1>
        <div className="hero-foot">
          <p>I turn ideas into thoughtful visual experiences across print, motion, social media and digital spaces.</p>
          <a className="circle-link" href="#work" aria-label="Explore selected work"><ArrowDownRight/></a>
        </div>
      </div>
      <div className="hero-bottomline"><span>DESIGN WITH INTENTION.</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="work section-wrap" id="work">
      <Label n="01">SELECTED WORK</Label>
      <div className="section-heading"><h2>Ideas into<br/><em>visual form.</em></h2><p>A selection of creative directions and visual explorations. More projects coming soon.</p></div>
      <div className="project-grid">{projects.map(p => <article className="project" key={p.n}>
        <div className={'project-art '+p.tone}><span className="art-index">{p.n} / EXPLORE</span><span className="art-symbol">{p.symbol}</span><span className="art-caption">KABTOHIN® — CREATIVE STUDIO</span></div>
        <div className="project-info"><div><span className="project-type">{p.type}</span><h3>{p.title}</h3><p>{p.detail}</p></div><span className="project-arrow"><ArrowUpRight size={19}/></span></div>
      </article>)}</div>
    </section>

    <section className="about section-wrap" id="about">
      <Label n="02">A LITTLE ABOUT ME</Label>
      <div className="about-grid"><h2>Curiosity<br/>meets <em>craft.</em></h2><div className="about-copy"><p className="about-lead">I’m a creative visual designer based in Dhaka, Bangladesh, interested in the space where design, technology and storytelling meet.</p><p>I build clear, expressive visuals with a thoughtful balance of typography, composition and detail. I also use AI as part of my creative process — exploring ideas, developing visual directions and refining the final work.</p><a className="text-link" href="#contact">LET'S CONNECT <ArrowUpRight size={15}/></a></div></div>
      <div className="tools-line"><span>TOOLS & PLAYGROUND</span><p>CANVA&nbsp;&nbsp; / &nbsp;&nbsp;CAPCUT&nbsp;&nbsp; / &nbsp;&nbsp;GEMINI&nbsp;&nbsp; / &nbsp;&nbsp;CLAUDE</p></div>
    </section>

    <section className="services section-wrap" id="services">
      <Label n="03">WHAT I DO</Label>
      <div className="section-heading"><h2>Thoughtful design.<br/><em>Useful impact.</em></h2><p>From a single visual to a connected campaign, every detail has a purpose.</p></div>
      <div className="service-list">{services.map(([n, title, desc]) => <div className="service-row" key={n}><span className="service-num">{n}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight className="service-icon" size={20}/></div>)}</div>
    </section>

    <section className="contact section-wrap" id="contact">
      <Label n="04">HAVE A PROJECT IN MIND?</Label>
      <div className="contact-content"><h2>Let's make<br/><em>something</em><br/>meaningful.</h2><a className="contact-link" href="mailto:kabtothin2020@gmail.com">GET IN TOUCH <ArrowUpRight size={19}/></a></div>
      <div className="contact-socials" aria-label="Contact and social profiles">
        <a href="mailto:kabtothin2020@gmail.com"><Mail size={17}/><span>kabtothin2020@gmail.com</span></a>
        <a href="https://www.instagram.com/sodiumcloride2020/" target="_blank" rel="noreferrer"><InstagramMark /><span>Instagram</span></a>
        <a href="https://www.linkedin.com/in/sodiumcloride" target="_blank" rel="noreferrer"><LinkedInMark /><span>LinkedIn</span></a>
      </div>
      <div className="contact-note"><span>OPEN TO CREATIVE COLLABORATIONS</span><span>BASED IN DHAKA, BANGLADESH</span></div>
    </section>

    <footer className="footer"><a className="logo" href="#top">KABTOHIN<span>®</span></a><span>© 2026 KABTOHIN. ALL RIGHTS RESERVED.</span><div className="footer-socials">
      <a href="mailto:kabtothin2020@gmail.com" aria-label="Email"><Mail size={17}/></a>
      <a href="https://www.instagram.com/sodiumcloride2020/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramMark /></a>
      <a href="https://www.linkedin.com/in/sodiumcloride" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInMark /></a>
    </div><a href="#top">BACK TO TOP ↑</a></footer>
  </main>
}