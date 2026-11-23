"use client";

import { useState } from "react";

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={`nav-toggle${open ? " is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`nav-links${open ? " is-open" : ""}`} id="nav-links">
        <a href="#home" onClick={close}>Home</a>
        <a href="#about" onClick={close}>About</a>
        <a href="#contact" onClick={close}>Contact Us</a>
        <a className="nav-cta" href="#catalog" onClick={close}>SHOP NOW</a>
      </div>
    </>
  );
}
