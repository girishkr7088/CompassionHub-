import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../firebase/uploadToCloudinary";
import { GeoPoint } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { BiMap, BiCalendar, BiTime, BiEnvelope, BiPhone, BiWallet, BiDonateHeart, BiX } from "react-icons/bi";
import { MdOutlineFoodBank, MdDelete } from "react-icons/md";

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

export default function NgoPanel() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    campName: "",
    location: "",
    geoLat: "",
    geoLng: "",
    date: "",
    time: "",
    itemsNeeded: [],
    description: "",
    contactPhone: "",
    contactEmail: "",
    paymentMethod: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    upiImage: "",
  });
  const [currentItem, setCurrentItem] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [upiImageFile, setUpiImageFile] = useState(null);
  const [upiImagePreview, setUpiImagePreview] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "camps"),
      where("ngoId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate()?.toLocaleString() || "Date not available",
        };
      });
      setCamps(campsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setFormData({
        ...formData,
        itemsNeeded: [...formData.itemsNeeded, currentItem.trim()],
      });
      setCurrentItem("");
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.itemsNeeded.filter((_, i) => i !== index);
    setFormData({ ...formData, itemsNeeded: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    const user = auth.currentUser;

    if (!formData.campName.trim()) validationErrors.campName = "Camp name is required";
    if (!formData.location.trim()) validationErrors.location = "Location is required";
    if (!formData.geoLat) validationErrors.geoLat = "Latitude is required";
    if (!formData.geoLng) validationErrors.geoLng = "Longitude is required";
    if (!formData.date) validationErrors.date = "Date is required";
    if (formData.itemsNeeded.length === 0) validationErrors.itemsNeeded = "At least one item is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let upiImageUrl = null;
      if (formData.paymentMethod === "upi" && upiImageFile) {
        try {
          upiImageUrl = await uploadToCloudinary(upiImageFile);
        } catch (uploadError) {
          console.error("UPI image upload error:", uploadError);
          setSuccessMessage("Failed to upload UPI image. Please try again.");
          return;
        }
      }

      const geoPoint = new GeoPoint(
        Number(formData.geoLat),
        Number(formData.geoLng)
      );

      await addDoc(collection(db, "camps"), {
        ...formData,
        geoLocation: geoPoint,
        upiImage: upiImageUrl,
        ngoId: user.uid,
        ngoEmail: user.email,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("Camp listing published successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowForm(false);
      setFormData({
        campName: "",
        location: "",
        geoLat: "",
        geoLng: "",
        date: "",
        time: "",
        itemsNeeded: [],
        description: "",
        contactPhone: "",
        contactEmail: "",
        paymentMethod: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        upiImage: "",
      });
      setUpiImageFile(null);
      setUpiImagePreview(null);
      setErrors({});
      setShowPaymentFields(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSuccessMessage("Failed to publish camp. Please try again.");
    }
  };

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-4xl font-bold text-emerald-800 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <MdOutlineFoodBank className="w-10 h-10 text-emerald-600" />
            </motion.div>
            NGO Camp Management
          </h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 shadow-emerald-200"
            >
              <BiDonateHeart className="w-6 h-6" />
              Create New Camp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-red-200"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-100/90 backdrop-blur-sm text-emerald-700 rounded-xl border border-emerald-200"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {camps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4 text-emerald-100 animate-pulse">🏕️</div>
            <h2 className="text-2xl text-emerald-800 font-medium mb-4">
              No camps published yet
            </h2>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {camps.map((camp) => (
                <motion.div
                  key={camp.id}
                  variants={cardVariants}
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  className="h-full"
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col border border-gray-100/80 hover:border-emerald-100">
                    <div className="p-6 flex-1">
                      <h2 className="text-xl font-bold text-gray-800 mb-3">
                        {camp.campName}
                      </h2>
                      <div className="text-gray-600 mb-4">
                        <p className="line-clamp-3">{camp.description}</p>
                      </div>

                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <BiMap className="w-5 h-5 text-emerald-600" />
                          <span>{camp.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <BiCalendar className="w-5 h-5 text-emerald-600" />
                          <span>{camp.date}</span>
                        </div>

                        {camp.time && (
                          <div className="flex items-center gap-2">
                            <BiTime className="w-5 h-5 text-emerald-600" />
                            <span>{camp.time}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <h3 className="font-medium text-gray-700 mb-2">
                        Items Needed:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {camp.itemsNeeded?.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]"
              >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Create New Camp
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setUpiImageFile(null);
                      setUpiImagePreview(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <BiX className="w-8 h-8" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Camp Name"
                      Icon={MdOutlineFoodBank}
                      value={formData.campName}
                      onChange={(e) => setFormData({ ...formData, campName: e.target.value })}
                      error={errors.campName}
                    />
                    <InputField
                      label="Location Address"
                      Icon={BiMap}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      error={errors.location}
                    />
                    <InputField
                      label="Latitude"
                      type="number"
                      step="any"
                      Icon={BiMap}
                      value={formData.geoLat}
                      onChange={(e) => setFormData({ ...formData, geoLat: e.target.value })}
                      error={errors.geoLat}
                    />
                    <InputField
                      label="Longitude"
                      type="number"
                      step="any"
                      Icon={BiMap}
                      value={formData.geoLng}
                      onChange={(e) => setFormData({ ...formData, geoLng: e.target.value })}
                      error={errors.geoLng}
                    />
                    <InputField
                      label="Date"
                      type="date"
                      Icon={BiCalendar}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      error={errors.date}
                    />
                    <InputField
                      label="Time"
                      type="time"
                      Icon={BiTime}
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 flex items-center gap-2">
                      <BiDonateHeart className="text-emerald-600" />
                      Items Needed
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentItem}
                        onChange={(e) => setCurrentItem(e.target.value)}
                        placeholder="Add an item"
                        className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>
                    {errors.itemsNeeded && (
                      <p className="text-red-500 text-sm mb-2">
                        {errors.itemsNeeded}
                      </p>
                    )}
                    <motion.ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {formData.itemsNeeded.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex justify-between items-center bg-emerald-50 rounded-lg px-3 py-2"
                        >
                          <span className="text-emerald-700">{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>

                  <InputField
                    label="Description"
                    type="textarea"
                    Icon={BiEnvelope}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Contact Phone"
                      Icon={BiPhone}
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                    <InputField
                      label="Contact Email"
                      Icon={BiEnvelope}
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <BiWallet className="text-emerald-600" />
                        Payment Information (Optional)
                      </h3>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPaymentFields(!showPaymentFields)}
                        className={`px-4 py-2 rounded-lg ${
                          showPaymentFields
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        } text-white transition-colors`}
                      >
                        {showPaymentFields ? "Remove" : "Add Payment"}
                      </motion.button>
                    </div>

                    {showPaymentFields && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 bg-gray-50 p-4 rounded-lg"
                      >
                        <div>
                          <label className="block font-semibold mb-2">
                            Payment Method
                          </label>
                          <select
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">Select Method</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="upi">UPI</option>
                          </select>
                        </div>

                        {formData.paymentMethod === "bank" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                              label="Account Holder Name"
                              value={formData.accountHolderName}
                              onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                            />
                            <InputField
                              label="Account Number"
                              value={formData.accountNumber}
                              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            />
                            <InputField
                              label="IFSC Code"
                              value={formData.ifscCode}
                              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                            />
                          </div>
                        )}

                        {formData.paymentMethod === "upi" && (
                          <div>
                            <label className="block font-semibold mb-2">
                              UPI QR Code
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setUpiImageFile(file);
                                  setUpiImagePreview(URL.createObjectURL(file));
                                } else {
                                  setUpiImageFile(null);
                                  setUpiImagePreview(null);
                                }
                              }}
                              className="w-full border border-gray-300 rounded-lg p-2"
                            />
                            {upiImagePreview && (
                              <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={upiImagePreview}
                                alt="UPI Preview"
                                className="mt-4 w-48 h-48 object-contain border-2 border-dashed border-gray-200 rounded-lg p-2"
                              />
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Publish Camp
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, error, type = "text", Icon }) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon className="text-emerald-600" />}
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          rows="4"
          value={value}
          onChange={onChange}
          className={`w-full border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500`}
        />
      )}
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <BiX className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
}
