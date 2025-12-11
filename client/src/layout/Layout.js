import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      
      <Header />

      <div className="main-div">
        
        <Sidebar />

        <main className="flex-grow-1 p-4 bg-light">
          {children}
        </main>

      </div>

      <Footer />

    </div>
  );
}
