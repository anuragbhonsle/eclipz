import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevModal: React.FC<DevModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="card-glass max-w-md w-full mx-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4 text-primary">
          You found the secret. ✨
        </h3>
        <p className="mb-4">You're not just a user, you're curious.</p>
        <p className="mb-4">
          Fueled by caffein, breakthroughs, and late-night code.
        </p>
        <p className="mb-4">
          Thanks for checking out Eclipz. Now go build something legendary.
        </p>
      </div>
    </div>
  );
};

const Footer = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleDeveloperNameClick = () => {
    setClickCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (clickCount >= 1) {
      setShowModal(true);
      setClickCount(0);
    }
  }, [clickCount]);

  return (
    <footer className="w-full py-6 px-6 md:px-16 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Eclipz. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <span
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={handleDeveloperNameClick}
            >
              Made by Anurag
            </span>
          </div>
        </div>
      </div>

      <DevModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </footer>
  );
};

export default Footer;
