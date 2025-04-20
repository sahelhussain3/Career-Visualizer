import React, { useRef } from 'react';
import CareerPathVisualizer from './components/CareerPathVisualizer';
import './App.css';

function App() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Explore Your Future Career</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Answer a few questions and discover career paths tailored to your education, interests, and skills.
          </p>
          <button 
            onClick={scrollToForm}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full text-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-6 -mt-20" ref={formRef}>
        <CareerPathVisualizer />
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 px-6 fixed bottom-0 w-full">
        <div className="max-w-5xl mx-auto text-center">
          <p>Built by Sahel Hussain | © 2025 CareerPathVisualizer</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
