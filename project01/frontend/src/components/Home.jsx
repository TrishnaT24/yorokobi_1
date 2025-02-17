import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import { ArrowRight, Clock, Users, Truck, CalendarCheck } from 'lucide-react';
import food from '../images/img-1.jpeg';
import enchi from "../images/img-2.jpeg";
import desert from "../images/dessert.jpeg";
import homie from "../images/hero.jpeg";
import fries from "../images/fries.jpeg";
function Home({isLoggedIn,username}) {
  const noodleDishes = [
    {
      name: "Noodles three",
      description: "White plate with dried shrimps",
      price: "12",
      rating: 4.8,
      image: food
    },
    {
      name: "Noodles one",
      description: "Noodles spicy boil with seafood and pork in hot pot",
      price: "20",
      rating: 4.9,
      image: enchi
    },
    {
      name: "Noodles two",
      description: "Noodles prawn spicy soup",
      price: "16",
      rating: 4.5,
      image: desert
    }
  ];
  // console.log("Home props:", { isLoggedIn, username });
  // console.log("LocalStorage data in home:", localStorage.getItem("user"));
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          {isLoggedIn ? `Welcome back, ${username}!` : "Welcome to Our Restaurant"}
        </h1>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Hero Section */}
        <section className="flex justify-between items-center px-12 py-16">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold mb-4">Delicious Food Is Waiting For You</h2>
          <p className="text-gray-600 mb-8">Our team of registered nurses and skilled healthcare professionals provide in-home nursing</p>
          <div className="flex gap-4">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
              Food Menu
            </button>
            <button className="bg-white text-orange-500 px-6 py-2 rounded-lg border border-orange-500 hover:bg-orange-50">
              Book a Table
            </button>
          </div>
        </div>
        <div className="relative">
          <img 
            src={homie}
            alt="Featured dish" 
            className="w-96 h-96 object-cover rounded-full"
          />
        </div>
      </section>

      {/* Top List Section */}
      <section className="px-12 py-16">
        <h2 className="text-3xl font-bold mb-8">Top List</h2>
        <p className="text-gray-600 mb-8">Our mainstay menu</p>
        <div className="grid grid-cols-3 gap-8">
          {noodleDishes.map((dish, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src={dish.image} 
                alt={dish.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-700">{dish.rating}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
              <p className="text-gray-600 mb-4">{dish.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${dish.price}</span>
                <button className="p-2 bg-orange-100 rounded-full text-orange-500 hover:bg-orange-200">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* French Fries Section */}
      <section className="px-12 py-16 flex items-center gap-12">
        <img 
          src={fries}
          alt="French Fries" 
          className="w-96 object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">Best Potatoes For French Fries</h2>
          <p className="text-gray-600">
            Russet potatoes are ideal. Since they're dense, they don't contain as much 
            water inside, which allows them to get extra crispy.
          </p>
        </div>
      </section>


      {/* Services Section */}
      <section className="px-12 py-16 bg-white">
        <h2 className="text-3xl font-bold mb-12 text-center">Our services</h2>
        <div className="grid grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <Clock className="w-12 h-12 text-orange-500 mb-4" />
            <span className="text-gray-700">Online booking</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="w-12 h-12 text-orange-500 mb-4" />
            <span className="text-gray-700">Catering service</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <CalendarCheck className="w-12 h-12 text-orange-500 mb-4" />
            <span className="text-gray-700">Membership</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Truck className="w-12 h-12 text-orange-500 mb-4" />
            <span className="text-gray-700">Delivery service</span>
          </div>
        </div>
      </section>

      </div>
    </div>
    </div>

  );
    
}

export default Home;









