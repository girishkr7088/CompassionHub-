import { motion } from "framer-motion";
import { HeartIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "About Us",
      links: ["Our Mission", "How It Works", "Impact Stories", "Partners"],
    },
    {
      title: "Quick Links",
      links: ["Donate Food", "Request Food", "Volunteer", "Events"],
    },
    {
      title: "Resources",
      links: ["Blog", "FAQs", "Download App", "Media Kit"],
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook" },
    { icon: Twitter, name: "Twitter" },
    { icon: Instagram, name: "Instagram" },
    { icon: Linkedin, name: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-emerald-50 to-emerald-100 mt-24">
      {/* Wave Shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg 
          className="relative block h-[50px] w-full"
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-emerald-50"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand Section */}
          <div className="md:col-span-1">
            <motion.h2 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent"
            >
              Compassion Hub
            </motion.h2>
            <p className="mt-4 text-gray-600 text-sm">
              Bridging the gap between surplus and need through community power.
            </p>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mt-6 md:mt-0"
            >
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#" 
                      className="text-gray-600 hover:text-emerald-700 text-sm transition-colors"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact & Social Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-emerald-200 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Contact Info */}
            <div className="flex items-center space-x-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <EnvelopeIcon className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-600">contact@compassionhub.com</span>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <PhoneIcon className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  href="#"
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Copyright Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-emerald-200 mt-8 pt-8 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Compassion Hub. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <motion.a whileHover={{ scale: 1.05 }} href="#" className="hover:text-emerald-700">
                Privacy Policy
              </motion.a>
              <motion.a whileHover={{ scale: 1.05 }} href="#" className="hover:text-emerald-700">
                Terms of Service
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
