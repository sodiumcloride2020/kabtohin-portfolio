import { ArrowDownRight, ArrowUpRight, ArrowRight, Menu } from 'lucide-react'

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
function Label({ n, children }) {
  return <div className="section-label"><span>{n}</span><span>{children}</span></div>
}
export default function App() {
  return <main>
    <header className="header" id="top">
      <a className="logo" href="#top">KABTOHIN<span>®</span></a>
      <nav><a href="#work">Work</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact <ArrowUpRight size={13}/></a></nav>
      <a className="availability" href="#contact"><i/> Available for projects</a>
      <a className="mobile-contact" href="#contact"><Menu size={21}/></a>
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
      <div className="contact-content"><h2>Let's make<br/><em>something</em><br/>meaningful.</h2><a className="contact-link" href="mailto:hello@kabtohin.com">GET IN TOUCH <ArrowUpRight size={19}/></a></div>
      <div className="contact-note"><span>OPEN TO CREATIVE COLLABORATIONS</span><span>BASED IN DHAKA, BANGLADESH</span></div>
    </section>

    <footer className="footer"><a className="logo" href="#top">KABTOHIN<span>®</span></a><span>© 2026 KABTOHIN. ALL RIGHTS RESERVED.</span><a href="#top">BACK TO TOP ↑</a></footer>
  </main>
}