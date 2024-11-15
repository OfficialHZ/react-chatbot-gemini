import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loading from "./Loading";
import products from "../data/products";

const ChatbotModal = ({ isOpen, onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyCtE3-xi0Zr2PfiN128AehFv93UQExe49c");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleUserInput = (e) => setUserInput(e.target.value);

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    let botMessage = "";

    // Check for keywords in user input to respond with product-specific information
    if (userInput.toLowerCase().includes("shirts")) {
      const shirts = products.filter(p => p.category === "Shirts");
      botMessage = shirts.length
        ? `Here are our shirts:\n${shirts.map(s => `• ${s.name} - $${s.price}`).join("\n")}`
        : "We currently don't have any shirts in stock.";
    } else if (userInput.toLowerCase().includes("pants")) {
      const pants = products.filter(p => p.category === "Pants");
      botMessage = pants.length
        ? `Here are our pants:\n${pants.map(p => `• ${p.name} - $${p.price}`).join("\n")}`
        : "We currently don't have any pants in stock.";
    } else if (
      userInput.toLowerCase().includes("all products") ||
      userInput.toLowerCase().includes("everything") ||
      userInput.toLowerCase().includes("what products do you have")
    ) {
      botMessage = `Here is our full product list:\n${products.map(p => `• ${p.name} - $${p.price}`).join("\n")}`;
    } else if (userInput.toLowerCase().includes("cost") || userInput.toLowerCase().includes("price")) {
      botMessage = `Here are our products with their prices:\n${products.map(p => `• ${p.name}: $${p.price}`).join("\n")}`;
    } else if (userInput.toLowerCase().includes("jeans")) {
      const jeans = products.find(p => p.name.toLowerCase().includes("jeans"));
      botMessage = jeans
        ? `We have ${jeans.name} available for $${jeans.price}.`
        : "We currently don't have jeans in stock.";
    } else if (userInput.toLowerCase().includes("discounts") || userInput.toLowerCase().includes("sales")) {
      botMessage = "Currently, we don’t have any discounts or sales.";
    } else if (userInput.toLowerCase().includes("category") || userInput.toLowerCase().includes("types of products")) {
      const categories = [...new Set(products.map(p => p.category))];
      botMessage = `We offer products in the following categories: ${categories.join(", ")}.`;
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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-full p-4 bg-white rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-blue-600">Chat Support</h2>
        <div className="flex space-x-2">
          <button
            onClick={clearChat}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            X
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-60 mb-4 p-2 border border-gray-300 rounded bg-gray-50">
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

      <div className="flex mt-2">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-300"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotModal;
