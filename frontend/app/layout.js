import Header from "./components/header";
import "./globals.css";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="top-0 m-0"><Header/>{children}</body>
    </html>
  );
}
