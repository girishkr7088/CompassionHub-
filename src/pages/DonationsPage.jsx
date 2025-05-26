import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { format, formatDistanceToNow } from "date-fns";
import {
  BiCalendar,
  BiMap,
  BiTime,
  BiEnvelope,
  BiPhone,
  BiWallet,
  BiDonateHeart,
} from "react-icons/bi";
import { MdOutlineFoodBank } from "react-icons/md";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../chatbot/ChatbotConfig";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DonationsPage = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedMapCamp, setSelectedMapCamp] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const navigate = useNavigate();

  const fetchCamps = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "camps"));
      const campsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          geoLocation: data.geoLocation ? {
            latitude: data.geoLocation.latitude,
            longitude: data.geoLocation.longitude
          } : null
        };
      });
      setCamps(campsData);
    } catch (error) {
      console.error("Error fetching camps:", error);
      setError("Failed to load donation camps. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCamps();
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const closeModal = () => setSelectedCamp(null);
  const campsWithPayment = camps.filter((camp) => camp.paymentMethod);

  const openCampDetails = (campId) => {
    setSelectedCamp(camps.find((camp) => camp.id === campId));
    setShowDonateModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-6xl">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-40 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
       <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
        {showChatbot && (
          <div className="relative">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
            <button
              onClick={() => setShowChatbot(false)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Close chatbot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="p-4 bg-emerald-600 rounded-full shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105"
          aria-label="Open chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-700 flex items-center gap-2">
            <MdOutlineFoodBank className="w-8 h-8 transition-transform duration-300 hover:scale-110" />
            Donation Camps
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDonateModal(true)}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <BiDonateHeart className="w-5 h-5" />
              Donate Now
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        {camps.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 text-gray-300 transition-transform duration-300 hover:scale-110">🍽</div>
            <h2 className="text-2xl text-gray-600 font-medium">
              No donation camps available currently
            </h2>
            <p className="text-gray-500 mt-2">
              Check back later or organize your own camp!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {camp.campName}
                  </h2>
                  <p
                    className="text-gray-600 mb-2 break-words overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      maxHeight: "4.5rem",
                    }}
                  >
                    {camp.description}
                  </p>

                  {camp.description && camp.description.length > 150 && (
                    <button
                      onClick={() => setSelectedCamp(camp)}
                      className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm transition-colors duration-300"
                    >
                      Read More
                    </button>
                  )}

                  <div className="space-y-3 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-2">
                      <BiMap className="w-5 h-5 text-emerald-600" />
                      <span>{camp.location}</span>
                    </div>


                    <div className="flex items-center gap-2">
                      <BiCalendar className="w-5 h-5 text-emerald-600" />
                      <span>
                        {format(new Date(camp.date), "PPP")}
                        <span className="ml-2 text-gray-400">
                          ({formatDistanceToNow(new Date(camp.date))} ago)
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BiTime className="w-5 h-5 text-emerald-600" />
                      <span>{camp.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BiEnvelope className="w-5 h-5 text-emerald-600" />
                      <a
                        href={`mailto:${camp.contactEmail}`}
                        className="hover:text-emerald-600 transition-colors duration-300"
                      >
                        {camp.contactEmail}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <BiPhone className="w-5 h-5 text-emerald-600" />
                      <a
                        href={`tel:${camp.contactPhone}`}
                        className="hover:text-emerald-600 transition-colors duration-300"
                      >
                        {camp.contactPhone}
                      </a>
                    </div>
                  </div>

                    {camp.geoLocation && (
                      <button
                        onClick={() => setSelectedMapCamp(camp)}
                        className="w-full mt-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <BiMap className="w-5 h-5" />
                        Show Location on Map
                      </button>
                    )}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Items Needed:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {camp.itemsNeeded?.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm transition-colors duration-300 hover:bg-emerald-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {camp.createdAt?.seconds && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                      Created{" "}
                      {formatDistanceToNow(
                        new Date(camp.createdAt.seconds * 1000)
                      )}{" "}
                      ago
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMapCamp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMapCamp(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold transition-colors duration-300"
                aria-label="Close Modal"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedMapCamp.campName} Location
              </h2>
              
              <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <MapContainer
                  center={[selectedMapCamp.geoLocation.latitude, selectedMapCamp.geoLocation.longitude]}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[selectedMapCamp.geoLocation.latitude, selectedMapCamp.geoLocation.longitude]}>
                    <Popup className="font-medium">
                      {selectedMapCamp.campName}<br />
                      <span className="text-sm">{selectedMapCamp.location}</span>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="mt-4 text-gray-600">
                <p className="font-medium">Full Address:</p>
                <p>{selectedMapCamp.location}</p>
              </div>
            </div>
          </div>
        )}

        {showDonateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Select a Camp to Donate
                </h2>
                <button
                  onClick={() => setShowDonateModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors text-2xl duration-300"
                >
                  &times;
                </button>
              </div>

              <div className="overflow-y-auto max-h-[70vh]">
                {campsWithPayment.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <BiWallet className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-pulse" />
                    <p className="text-lg">
                      No camps with payment options available
                    </p>
                    <p className="mt-2 text-sm">
                      Check back later for donation opportunities
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {campsWithPayment.map((camp) => (
                      <li
                        key={camp.id}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-300 group"
                        onClick={() => openCampDetails(camp.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                              {camp.campName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <BiMap className="inline mr-1" />
                              {camp.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {camp.paymentMethod === "bank" ? (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm transition-colors duration-300">
                                Bank Transfer
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm transition-colors duration-300">
                                UPI Payment
                              </span>
                            )}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors duration-300"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-emerald-600 animate-pulse"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L3 9l3 6h12l3-6-9-7zM12 22V10" />
                    <path d="M9 14l3 3 3-3" />
                  </svg>
                  Secure & Verified Payment Methods
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedCamp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold transition-colors duration-300"
                aria-label="Close Modal"
              >
                &times;
              </button>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedCamp.campName}
              </h2>

              <div className="space-y-4">
                {selectedCamp.paymentMethod && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <BiWallet className="w-6 h-6 text-emerald-600" />
                      Payment Details
                    </h3>
                    {selectedCamp.paymentMethod === "bank" ? (
                      <div className="space-y-2 text-gray-700">
                        <p>
                          <span className="font-medium">Account Holder:</span>{" "}
                          {selectedCamp.accountHolderName}
                        </p>
                        <p>
                          <span className="font-medium">Account Number:</span>{" "}
                          {selectedCamp.accountNumber}
                        </p>
                        <p>
                          <span className="font-medium">IFSC Code:</span>{" "}
                          {selectedCamp.ifscCode}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">UPI ID:</span>{" "}
                          {selectedCamp.upiId}
                        </p>
                        {selectedCamp.upiImage && (
                          <img 
                            src={selectedCamp.upiImage} 
                            alt="UPI QR Code"
                            className="mt-2 max-w-xs border rounded-lg p-1 mx-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedCamp.createdAt?.seconds && (
                  <div className="mt-4 text-sm text-gray-500 italic">
                    Created{" "}
                    {formatDistanceToNow(
                      new Date(selectedCamp.createdAt.seconds * 1000)
                    )}{" "}
                    ago
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsPage;
