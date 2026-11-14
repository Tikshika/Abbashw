import Catalog from "./catalog";

function Icon({ name }) {
  const paths = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Abbas Hardware home">
      <img
        className="brand-logo"
        src="/abbas-hardware-logo.png"
        alt="Abbas Hardware — Build Better, Live Better"
      />
    </a>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <nav className="navigation" aria-label="Main navigation">
          <Brand />
          <div className="nav-links">
            <a href="#catalog">SHOP NOW</a>
          </div>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Tools for the way you make</p>
          <h1>Make room<br />for <span>what&apos;s next.</span></h1>
          <p className="hero-description">
            The right fittings, tools, and finishing touches for every corner of your home.
          </p>
          <a className="primary-link" href="#catalog">
            Explore the collection <Icon name="arrow" />
          </a>
        </div>
        <div className="hero-art">
          <img
            className="workshop-art"
            src="/workshop-hardware.png"
            alt="Modern kitchen cabinetry and furniture fittings, including drawers and cabinet hinges."
          />
          <span className="art-label">A BETTER FIT FOR EVERY PROJECT</span>
        </div>
        <div className="hero-swoosh" aria-hidden="true" />
        <div className="hero-footnote">
          <span>BUILT AROUND YOUR HOME</span>
          <span>GOOD MATERIALS. GOOD ADVICE.</span>
        </div>
      </section>

      <section className="about-strip" id="about">
        <div>
          <p className="eyebrow">Abbas Hardware</p>
          <h2>Make every detail<br /><span>work beautifully.</span></h2>
        </div>
        <p>
          Discover dependable hardware, thoughtful fittings, and everyday essentials
          chosen to help bring your next project together.
        </p>
      </section>

      <Catalog />

      <footer className="footer" id="contact">
        <div className="footer-top">
          <Brand />
          <p>Helpful hardware for a home that works beautifully.</p>
          <a className="footer-link" href="#home">Back to top <span aria-hidden="true">↑</span></a>
        </div>
        <div className="footer-bottom">
          <div className="footer-column">
            <a href="#about">About Us</a>
            <a href="#contact">Contact Us</a>
            <a href="#catalog">Our Collection</a>
            <a href="#catalog">Visit a Store</a>
          </div>
          <div className="footer-column">
            <a href="#contact">Returns Policy</a>
            <a href="#contact">Privacy Policy</a>
            <a href="#contact">Shipping &amp; Delivery</a>
            <a href="#contact">Terms of Use</a>
          </div>
          <div className="footer-certifications">
            <span>Quality you can count on</span>
            <strong>MADE FOR EVERYDAY</strong>
          </div>
          <div className="footer-social">
            <span>Connect with us</span>
            <div aria-label="Social links">
              <a href="#contact" aria-label="Facebook">f</a>
              <a href="#contact" aria-label="Instagram">◎</a>
              <a href="#contact" aria-label="YouTube">▶</a>
            </div>
          </div>
        </div>
        <div className="copyright">© 2026 Abbas Hardware. All rights reserved.</div>
      </footer>
    </main>
  );
}
