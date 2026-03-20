import React from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full h-auto flex bg-primaryGray relative">
      <aside>
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[5] sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <header>
          <Header />
        </header>
        <div className="h-[calc(100vh-57px)] overflow-y-scroll hide-scrollbar relative">
          <main><Outlet /></main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;
