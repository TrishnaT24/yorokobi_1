import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";

function Home({isLoggedIn,username}) {
  // console.log("Home props:", { isLoggedIn, username });
  // console.log("LocalStorage data in home:", localStorage.getItem("user"));
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          {isLoggedIn ? `Welcome back, ${username}!` : "Welcome to Our Restaurant"}
        </h1>
        {/* Add your home page content here */}
      </div>
    </div>
  );
    
}

export default Home;
