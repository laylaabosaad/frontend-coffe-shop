import NavbarWrapper from "./components/NavbarWrapper";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <NavbarWrapper />
        </header>
        <main>{children}</main>
        <footer>Footer here</footer>
      </body>
    </html>
  );
}
