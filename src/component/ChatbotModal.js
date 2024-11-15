import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loading from "./Loading";

const ChatbotModal = ({ isOpen, onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const genAI = new GoogleGenerativeAI("AIzaSyCtE3-xi0Zr2PfiN128AehFv93UQExe49c");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Fetch products from JSON server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Fallback to empty list if fetching fails
      }
    };
    fetchProducts();
  }, []);

  const handleUserInput = (e) => setUserInput(e.target.value);

  const sendMessage = async () => {
    if (userInput.trim() === "") return;
  
    setIsLoading(true);
    let botMessage = "";
  
    // Check for keywords in user input to respond with product-specific information
    const lowerInput = userInput.toLowerCase();
  
    const filterProductsByCategory = (category) => 
      category ? products.filter((p) => p.category.toLowerCase() === category) : products;
  
    const findExpensiveOrCheap = (category, type) => {
      const filteredProducts = filterProductsByCategory(category);
      if (!filteredProducts.length) return `We currently don't have any ${category || "products"} in stock.`;
  
      const sorted = [...filteredProducts].sort((a, b) => 
        type === "expensive" ? b.price - a.price : a.price - b.price
      );
      const product = sorted[0];
      return `Our ${type} ${category || "product"} is "${product.name}" priced at $${product.price}.`;
    };
  
    if (lowerInput.includes("most expensive") || lowerInput.includes("less expensive")) {
      const type = lowerInput.includes("most expensive") ? "expensive" : "cheap";
      if (lowerInput.includes("shoes")) botMessage = findExpensiveOrCheap("shoes", type);
      else if (lowerInput.includes("shirts")) botMessage = findExpensiveOrCheap("shirts", type);
      else if (lowerInput.includes("pants")) botMessage = findExpensiveOrCheap("pants", type);
      else botMessage = findExpensiveOrCheap(null, type); // General products
    } else if (lowerInput.includes("shirts")) {
      const shirts = filterProductsByCategory("shirts");
      botMessage = shirts.length
        ? `Here are our shirts:\n${shirts.map((s) => `• ${s.name} - $${s.price}`).join("\n")}`
        : "We currently don't have any shirts in stock.";
    } else if (lowerInput.includes("pants")) {
      const pants = filterProductsByCategory("pants");
      botMessage = pants.length
        ? `Here are our pants:\n${pants.map((p) => `• ${p.name} - $${p.price}`).join("\n")}`
        : "We currently don't have any pants in stock.";
    } else if (lowerInput.includes("shoes")) {
      const shoes = filterProductsByCategory("shoes");
      botMessage = shoes.length
        ? `Here are our shoes:\n${shoes.map((s) => `• ${s.name} - $${s.price}`).join("\n")}`
        : "We currently don't have any shoes in stock.";
    } else if (
      lowerInput.includes("all products") ||
      lowerInput.includes("everything") ||
      lowerInput.includes("what products do you have")
    ) {
      botMessage = `Here is our full product list:\n${products.map((p) => `• ${p.name} - $${p.price}`).join("\n")}`;
    } else {
      try {
        const result = await model.generateContent(userInput);
        botMessage = await result.response.text();
      } catch {
        botMessage = "Sorry, I'm having trouble answering that.";
      }
    }
  
    setChatHistory([
      ...chatHistory,
      { type: "user", message: userInput },
      { type: "bot", message: botMessage },
    ]);
    setUserInput("");
    setIsLoading(false);
  };
  
  

  const clearChat = () => setChatHistory([]);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      sendMessage();
    };
  };

  if (!isOpen) return null; // No renderizar si no está abierto.

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-full h-96 p-4 bg-white rounded-lg shadow-lg z-50 border border-gray-200 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-blue-600">Chat Support</h2>
        <div className="flex space-x-2">
          <button
            onClick={clearChat}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
          >
            Clear
          </button>
          <button
            onClick={onClose} // Llama a onClose para cerrar el modal.
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            X
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="overflow-y-auto h-48 mb-4 p-3 border border-gray-300 rounded bg-gray-50 transition-all">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`mb-2 ${chat.type === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                chat.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <pre className="whitespace-pre-wrap">{chat.message}</pre>
            </div>
          </div>
        ))}
        {isLoading && <Loading />}
      </div>

      {/* Input and Buttons */}
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-300 transition duration-200"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
        <button
          onClick={startVoiceRecognition}
          className="ml-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default ChatbotModal;