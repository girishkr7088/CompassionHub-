import React, { useState, useEffect } from "react";
import { FiCompass, FiHeart, FiUsers, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isNgoPanel = location.pathname === "/ngo-panel";

  const navLinks = [
    // { name: "Camps", path: "/camps", icon: <FiCompass className="mr-2" /> },
    ...(isNgoPanel
      ? [
          // {
          //   name: "Donations",
          //   path: "/donorsInfo",
          //   icon: <FiHeart className="mr-2" />,
          // },
        ]
      : []),
    {
      name: "Community",
      path: "/community",
      icon: <FiUsers className="mr-2" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-gradient-to-r from-emerald-600 to-green-400 rounded-lg"
            >
              <FiCompass className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
              CompassionHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={`${link.name}-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  onClick={() => console.log("Navigating to:", link.path)}
                  className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  {link.icon}
                  {link.name}
                </Link>
              </motion.div>
            ))}
            {/* {!isNgoPanel && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-400 text-white rounded-full shadow-lg hover:shadow-emerald-200 transition-all"
              >
                Donate Now
              </motion.button>
            )} */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-emerald-600 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden fixed inset-0 bg-white z-40"
          >
            <div className="container mx-auto px-6 py-8 h-full flex flex-col items-center justify-center">
              {navLinks.map((link, index) => (
                <motion.div
                  key={`${link.name}-mobile-${index}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full text-center py-4"
                >
                  <Link
                    to={link.path}
                    onClick={() => {
                      console.log("Navigating to:", link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-2xl font-medium text-gray-700 hover:text-emerald-600 flex items-center justify-center"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {!isNgoPanel && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-400 text-white rounded-full text-lg font-medium shadow-lg"
                >
                  Donate Now
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Header;
