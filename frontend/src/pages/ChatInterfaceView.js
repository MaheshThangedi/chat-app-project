import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import TableResponse from '../components/TableResponse';
import AnswerFeedback from '../components/AnswerFeedback';

const ChatInterfaceView = ({ apiUrl, setSessions }) => {
  const { sessionId } = useParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Get current suggestions from the last bot message
  const lastBotMessage = chatHistory.findLast(msg => msg.sender === 'bot');
  const suggestions = lastBotMessage?.suggestions || [];

  // Fetch history for this session
  useEffect(() => {
    if (!sessionId) return;
    setIsLoading(true);
    fetch(`${apiUrl}/session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setChatHistory(data.history || []);
        setIsLoading(false);
      })
      .catch(console.error);
  }, [sessionId, apiUrl]);

  // Scroll to bottom when new message appears
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // Handle sending a new message
  const handleSendMessage = (userMessage) => {
    const userMsg = { sender: 'user', text: userMessage };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsLoading(true);

    fetch(`${apiUrl}/chat/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: userMessage }),
    })
      .then((res) => res.json())
      .then((data) => {
        // If this was the first real question (after initial bot welcome), update the session list
        // for potential new title
        if (chatHistory.length === 1 && data.sender === 'bot') {
            fetch(`${apiUrl}/sessions`).then(res => res.json()).then(setSessions);
        }
        setChatHistory((prev) => [...prev, data]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setChatHistory((prev) => [...prev, { sender: 'bot', text: 'Error fetching response from backend.' }]);
        setIsLoading(false);
      });
  };

  // This h-full and flex-col structure fixes the floating input
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-4 rounded-lg shadow-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              
              {msg.tableData && (
                <TableResponse data={msg.tableData} />
              )}
              
              {msg.sender === 'bot' && (
                <AnswerFeedback />
              )}
            </div>
          </div>
        ))}
        {isLoading && chatHistory.length > 0 && (
           <div className="flex justify-start">
            <div className="max-w-xl p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700">
              <p className="animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} /> {/* Anchor for scrolling */}
      </div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && !isLoading && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((text, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(text)}
                className="p-2 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat input area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterfaceView;