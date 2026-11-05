"use client";

import { useState } from "react";
import Catalog from "./catalog";

function Icon({ name }) {
  const paths = {
    account: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.5-3.1 2.7-4.8 6.5-4.8s6 1.7 6.5 4.8" /></>,
    heart: <path d="M20.4 8.8c0 4.1-8.4 9.5-8.4 9.5S3.6 12.9 3.6 8.8A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 8.4 1.2Z" />,
    bookmark: <path d="M6.5 4.5h11v16L12 17l-5.5 3.5v-16Z" />,
    cart: <><path d="M3.5 5h2l2.2 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
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

function WorkshopIllustration() {
  return (
    <svg className="workshop-art" viewBox="0 0 820 500" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="deskTop" x1="120" y1="255" x2="760" y2="310" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#dce8e9" />
        </linearGradient>
        <linearGradient id="metal" x1="340" y1="300" x2="390" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor="#657984" />
          <stop offset="1" stopColor="#344c5b" />
        </linearGradient>
        <filter id="deskShadow" x="85" y="215" width="720" height="250" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>
      <ellipse cx="451" cy="425" rx="320" ry="30" fill="#476474" fillOpacity=".18" filter="url(#deskShadow)" />
      <path d="M159 283h566l-23 23H151l8-23Z" fill="#243b49" />
      <path d="M140 263h618l-15 24H153l-13-24Z" fill="url(#deskTop)" />
      <path d="M174 286v181h31V286m420 0v181h31V286" fill="url(#metal)" />
      <path d="M166 462h47v12h-47zm420 0h47v12h-47z" fill="#253c4a" />
      <path d="M190 307h429" stroke="#9eafb5" strokeWidth="5" strokeLinecap="round" />
      <rect x="361" y="247" width="117" height="13" rx="6.5" fill="#d8e1e2" />
      <rect x="380" y="251" width="78" height="6" rx="3" fill="#596f7a" />
      <rect x="627" y="115" width="146" height="99" rx="4" fill="#263741" />
      <rect x="635" y="123" width="130" height="82" rx="2" fill="#62747b" />
      <path d="M700 214v31m-28 4h57" stroke="#3b505b" strokeWidth="8" strokeLinecap="round" />
      <path d="M290 262v-47a29 29 0 0 1 58 0v47" stroke="#415d69" strokeWidth="10" />
      <path d="M274 261h90" stroke="#415d69" strokeWidth="9" strokeLinecap="round" />
      <path d="M514 261v-28l16-29 17 29v28" fill="#f3a347" />
      <path d="m530 208 11-27m-26 30-10-18" stroke="#ce7540" strokeWidth="5" strokeLinecap="round" />
      <rect x="502" y="231" width="54" height="31" rx="4" fill="#a9c5c5" />
      <path d="M511 233v-15a8 8 0 0 1 16 0v15m7-16v16" stroke="#3c7280" strokeWidth="4" strokeLinecap="round" />
      <path d="M226 243h42v18h-42z" fill="#d98b4c" />
      <path d="M234 243v-9h26v9" stroke="#895632" strokeWidth="5" strokeLinecap="round" />
      <circle cx="247" cy="252" r="3" fill="#f8d19b" />
      <path d="M593 256h24l21-15 17 15" stroke="#718890" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M651 256h29" stroke="#354d58" strokeWidth="5" strokeLinecap="round" />
      <rect x="400" y="280" width="40" height="8" rx="4" fill="#f38a32" />
      <path d="M728 350c15 18 20 34 21 54" stroke="#f38a32" strokeWidth="6" strokeLinecap="round" />
      <path d="M682 403h93l-11 20h-73l-9-20Z" fill="#fff" />
      <path d="m699 423-11 41m64-41 11 41" stroke="#c58d5b" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");

  return (
    <main>
      <header className="site-header">
        <nav className="navigation" aria-label="Main navigation">
          <Brand />
          <div className="nav-links">
            <a href="#catalog">SHOP NOW</a>
          </div>
          <div className="header-actions" aria-label="Store shortcuts">
            <a href="#contact" aria-label="Contact Abbas Hardware"><Icon name="account" /></a>
            <a href="#catalog" aria-label="Browse favorites"><Icon name="heart" /></a>
            <a href="#catalog" aria-label="Browse saved products"><Icon name="bookmark" /></a>
            <a href="#catalog" aria-label="Shop products"><Icon name="cart" /></a>
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
          <WorkshopIllustration />
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

      <Catalog search={search} onSearchChange={setSearch} />

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
