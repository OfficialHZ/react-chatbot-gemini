// src/App.js
import React, { useState } from "react";
import ProductList from "./component/ProductList";
import ChatbotModal from "./component/ChatbotModal";

const App = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="App relative">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">The boys corner shop</h1>
      </header>
      <ProductList />
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        💬
      </button>
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default App;
