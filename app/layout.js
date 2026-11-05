import "./globals.css";

export const metadata = {
  title: "Abbas Hardware | Fittings, Tools & Home Essentials",
  description: "Shop fittings, tools, and everyday hardware essentials for your home and next project."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
