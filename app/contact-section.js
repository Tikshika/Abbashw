import { siteConfig } from "./site-config";

export default function ContactSection() {
  const { contact, map } = siteConfig;
  const embedUrl = `https://maps.google.com/maps?q=${map.latitude},${map.longitude}&z=${map.zoom}&output=embed`;

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-details">
        <p className="eyebrow">Contact Us</p>
        <h2 id="contact-title">Visit our store</h2>
        <dl>
          <div>
            <dt>Contact person</dt>
            <dd>{contact.contactPerson}</dd>
          </div>
          <div>
            <dt>Business</dt>
            <dd>{contact.businessName}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              {contact.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd>
          </div>
          <div>
            <dt>Hours</dt>
            <dd>{contact.hours}</dd>
          </div>
        </dl>
        <a className="primary-link" href={map.placeUrl} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
        </a>
      </div>
      <div className="contact-map">
        <iframe
          title="Abbas Hardware location map"
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
