// src/components/Layout.jsx
import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="pt-20"> {/* to avoid content hiding behind fixed header */}
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}
