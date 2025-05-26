import { useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const floatingVariants = {
  float: {
    y: [-10, 10],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut"
    }
  }
};

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  }
};

const textPopVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, delay: 0.2 }
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        setError("User document does not exist in Firestore.");
        return;
      }
      
      const role = userDoc.data().role;
      navigate(role === "donor" ? "/donations" : "/ngo-panel");
      
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Left Branding Section */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden w-1/2 bg-emerald-50 lg:flex flex-col items-center justify-center p-12 h-screen space-y-8"
      >
        <motion.div 
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
         
          <motion.h1 
            variants={textPopVariants}
            className="text-5xl font-bold text-emerald-700 text-center leading-tight bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent"
          >
            Compassion Hub
          </motion.h1>
        </motion.div>

        <motion.img
          variants={floatingVariants}
          animate="float"
          src="/Donation.png"
          alt="Food Donation"
          className="max-w-lg h-auto max-h-[70vh] mt-8"
        />
      </motion.div>

      {/* Right Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 h-screen"
      >
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mx-auto border border-emerald-50"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-emerald-600 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-8">Continue making a difference</p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-br from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-emerald-100"
            >
              Log In
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/signup"
                className="text-emerald-600 hover:text-emerald-700 font-medium underline-offset-4 hover:underline"
              >
                Sign up
              </motion.a>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
