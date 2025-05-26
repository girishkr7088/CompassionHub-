import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { motion } from "framer-motion";
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

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role
      });

      alert("Success! Please check your email to verify");
      navigate("/login");
    } catch (err) {
      setError(err.message);
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
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Illustration Section */}
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
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSignup}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mx-auto border border-emerald-50"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-emerald-700 mb-2">Join Our Mission</h2>
            <p className="text-gray-600 mb-8">Create an account to start making impact</p>
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

          {/* Email Input */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-all"
            />
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-all"
            />
          </motion.div>

          {/* Role Selector */}
          <motion.div variants={itemVariants} className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-3">Account Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole("donor")}
                className={`flex-1 py-3 text-center rounded-lg border-2 transition-colors ${
                  role === "donor"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 hover:border-emerald-200"
                }`}
              >
                Food Donor
              </button>
              <button
                type="button"
                onClick={() => setRole("ngo")}
                className={`flex-1 py-3 text-center rounded-lg border-2 transition-colors ${
                  role === "ngo"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 hover:border-emerald-200"
                }`}
              >
                NGO Team
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-emerald-200"
            >
              Get Started
            </motion.button>
          </motion.div>

          {/* Login Link */}
          <motion.div variants={itemVariants}>
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium underline-offset-4 hover:underline"
              >
                Log in
              </motion.a>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
