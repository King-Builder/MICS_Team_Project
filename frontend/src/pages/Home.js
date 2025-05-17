import React from "react";
import '../style/style.css'
import { Link } from "react-router-dom";
import globe from '../style/globe.png';
import lines from '../style/lines.png';

const Home = () => {
  return (
    <>
      <div className="navigator">
        <div className="logo">
          <a href="index.html" className="no-underline">
            <h1>MICS</h1>
          </a>
        </div>

        <div className="components">
          <div><a href="#home">Home</a></div>
          <div><a href="#about-us">About Us</a></div>
          <div><a href="#pricing">Pricing</a></div>
          <div><a href="#services">Services</a></div>
        </div>

        <div className="login-button">
            <Link to="/login" className="no-underline">Login</Link>
        </div>
      </div>

      <div className="home-container" id="home">
        <div className="home-center">
          <div className="homepage-left">
            <div className="text-container">
              <h1>The World is in Our Hands</h1>
              <p>
                Empowering Communities with Reliable, Affordable, and Accessible Internet. Connecting Lives, Fueling Progress.
              </p>
              <button className="learn-more-button">
                <a href="#about-us">Learn More</a>
              </button>
              <button className="get-started-button">
                <a href="#pricing">Get Started</a>
              </button>
            </div>
          </div>

          <div className="homepage-right">
            {/* Optional images */}
          </div>
        </div>
      </div>

      <div className="about-us-section" id="about-us">
        <div className="about-us-container">
          <img src={globe} alt="Globe Image" />
          <div className="about-us-text">
            <h2>About Us</h2>
            <p>
              Mikearvin Internet Communication Services (MICS), founded by Meguil Arvin M. Tigbabao in 2018, is a telecommunications business committed to delivering reliable internet connectivity to its clients. Operating under BukWISP (Bukidnon Wide Internet Service Provider) and regulated by the National Telecommunications Commission (NTC), MICS provides internet services with flexible prepaid and postpaid options, supporting local communities with accessible and efficient digital communication solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="pricing-container" id="pricing">
        {[
          {
            title: "Starter Plan",
            price: "₱1000",
            features: [
              "12 Mbps Speed",
              "Ideal for light users, messaging, social media browsing, and email",
              "Best for budget conscious customers who need reliable connectivity for everyday tasks",
              "A budget-friendly plan that covers all your basic internet needs without compromising reliability."
            ]
          },
          {
            title: "Family Plan",
            price: "₱1500",
            features: [
              "17 Mbps Speed",
              "Ideal for heavier browsing, HD streaming, Zoom meetings, online gaming (light), and file downloads.",
              "Best for medium-sized families (2–4 users) with school or work-from-home needs.",
              "A great balance of speed, with smooth video calls, online classes, and multitasking across devices."
            ]
          },
          {
            title: "Pro Plan",
            price: "₱2000",
            features: [
              "10 Mbps Speed",
              "Ideal sor HD/4K streaming, online gaming, video conferencing, smart home device usage.",
              "Best for tech-savvy homes or small offices with multiple users and connected devices.",
              "Designed for performance in streaming, gaming, and working online with no interruptions."
            ]
          },
          {
            title: "Elite Plan",
            price: "₱2500",
            features: [
              "50 Mbps Speed",
              "Ideal for power users, 4K streaming, large file transfers, professional-grade video calls, and online business operations.",
              "Best for large households, remote workers, content creators, or small businesses.",
              "Our fastest residential plan, built for those who need maximum speed and stability for both work and play."
            ]
          }
        ].map(({ title, price, features }) => (
          <div className="standard-card" key={title}>
            <div className="card-header">{title}</div>
            <div className="card-price">
              <span className="price">{price}</span>
              <span className="per"> / m</span>
            </div>
            <ul className="card-features">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button className="pricing-button get-started">Get Started</button>
          </div>
        ))}
      </div>

      <div className="services-section" id="services">
        <div className="services-container">
          <div className="services-text">
            <h2>Services</h2>
            <p>We provide excellent services like OTT, Internet Service Provider, and Virtual Private Networks tailored to your personal and professional needs.</p>
          </div>
          <img src={lines} alt="" />
        </div>
      </div>
    </>
  );
};

export default Home;
