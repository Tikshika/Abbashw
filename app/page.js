import Catalog from "./catalog";
import ContactSection from "./contact-section";
import NavMenu from "./nav-menu";

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
          <NavMenu />
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
        <div className="about-copy">
          <p>
            <strong>Abbas Hardware</strong> is a trusted destination for quality hardware, architectural
            fittings and interior hardware solutions in Chennai. We offer a wide range of products for
            homes, offices, commercial spaces, interior projects and general hardware requirements.
          </p>
          <p>
            Our product range includes <strong>door locks, door handles, hinges, stoppers, cabinet and
            furniture fittings, bathroom fittings, fasteners, tools and other essential hardware
            products</strong> from reputed brands.
          </p>
          <p>
            We understand that choosing the right hardware is important for both <strong>functionality
            and appearance</strong>. That is why we focus on providing customers with a good selection of
            products, competitive pricing and practical assistance in choosing the right product for
            their requirements.
          </p>
        </div>
      </section>

      <Catalog />

      <ContactSection />

      <footer className="footer">
        <div className="footer-top">
          <a className="footer-link" href="#home">Back to top <span aria-hidden="true">↑</span></a>
        </div>
        <div className="footer-bottom">
          <div className="footer-column">
            <a href="#about">About Us</a>
            <a href="#contact">Contact Us</a>
            <a href="#catalog">Our Collection</a>
            <a href="#catalog">Visit a Store</a>
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
