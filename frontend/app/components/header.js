"use client"

import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi"
import { useState, useEffect } from "react";

export default function Header() {
  const [show, setShow] = useState(false);

  const handleLinkClick = () => {
    setShow(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShow(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="w-full relative">
      <nav className="flex items-center justify-between pl-12 pr-4 md:pr-20 bg-black text-yellow-50">
        <div>
          <h2>Arbetarbanken</h2>
        </div>
        <div>
          <button
            onClick={() => setShow(!show)}
            className="block bg-black text-yellow-50 border-none md:hidden cursor-pointer"
          >
            {" "}
            <GiHamburgerMenu />{" "}
          </button>
        </div>
        <div className="hidden md:block">
          <Link href="/" className="no-underline text-yellow-50">
            Hem
          </Link>
          <Link href="/blikund" className="m-20 no-underline text-yellow-50">
            Bli Kund
          </Link>
          <Link href="/loggain" className="no-underline text-yellow-50">
            Logga in
          </Link>
        </div>
      </nav>
      {show && (
        <div className="absolute bg-white top-full right-0 md:left-auto md:right-0 mt-2 z-10">
          <Link
            href="/"
            className="no-underline text-black block p-2"
            onClick={handleLinkClick}
          >
            Hem
          </Link>
          <Link
            href="/blikund"
            className="no-underline text-black block p-2"
            onClick={handleLinkClick}
          >
            Bli kund
          </Link>
          <Link
            href="/loggain"
            className="no-underline text-black block p-2"
            onClick={handleLinkClick}
          >
            Logga in
          </Link>
        </div>
      )}
    </header>
  );
}