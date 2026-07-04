'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getChatbotSuggestions } from '../lib/faqData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = getChatbotSuggestions();

interface ChatbotWindowProps {
  onClose: () => void;
}

export default function ChatbotWindow({ onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Assalamu Alaikum! I’m here to help you understand Rishte Forever packages, profile privacy, verification, and how the platform works. How can I help you?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (rawText: string) => {
    const cleanInput = rawText.trim();
    if (!cleanInput || isLoading) return;
    if (cleanInput.length > 1000) {
      setErrorMsg('Message is too long (maximum 1000 characters).');
      return;
    }

    // Clear previous errors
    setErrorMsg(null);

    // 1. Add User Message to UI
    const historyForRequest = messages;
    const updatedMessages: Message[] = [...messages, { role: 'user', content: cleanInput }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Post to API Route
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanInput,
          history: historyForRequest // Pass existing history
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      // 3. Add Assistant Reply
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.text || 'I could not process that message. Please try again.' }
      ]);
    } catch (err) {
      console.error('Error communicating with chatbot API:', err);
      setErrorMsg('Could not reach the assistant. Reverting to fallback answers...');
      
      // Graceful local client fallback if API is fully down
      const { getFallbackResponse } = require('../lib/chatbotFallback');
      const offlineReply = getFallbackResponse(cleanInput);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: offlineReply }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Assalamu Alaikum! I’m here to help you understand Rishte Forever packages, profile privacy, verification, and how the platform works. How can I help you?'
      }
    ]);
    setErrorMsg(null);
  };

  return (
    <div className="chatbot-window">
      {/* Chat Header */}
      <div className="chatbot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="chatbot-header-avatar">❀</div>
          <div>
            <h4 className="chatbot-header-title">Rishte Forever Assistant</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="chatbot-status-indicator"></span>
              <span className="chatbot-status-text">
                Online
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleClearChat} 
            className="chatbot-clear-btn" 
            title="Clear conversation"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="chatbot-close-btn"
            aria-label="Close chat window"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chatbot-messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message-row ${
              msg.role === 'user' ? 'row-user' : 'row-assistant'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="chatbot-msg-avatar">❀</div>
            )}
            <div
              className={`chatbot-message-bubble ${
                msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'
              }`}
            >
              <p className="chatbot-message-content">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <div className="chatbot-message-row row-assistant">
            <div className="chatbot-msg-avatar">❀</div>
            <div className="chatbot-message-bubble bubble-assistant bubble-loading">
              <div className="chatbot-typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="chatbot-error-banner">
            {errorMsg}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions — shown at the start of a conversation */}
      {messages.length <= 1 && !isLoading && (
        <div className="chatbot-suggestions">
          <span className="chatbot-suggestions-label">Popular questions</span>
          <div className="chatbot-suggestions-list">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="chatbot-suggestion-chip"
                onClick={() => sendMessage(s.question)}
              >
                {s.question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Link to the full FAQ page */}
      <div className="chatbot-faq-link-row">
        <Link href="/faq" className="chatbot-faq-link" onClick={onClose}>
          Browse all FAQs →
        </Link>
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="chatbot-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about packages, privacy, verification..."
          className="chatbot-input-field"
          disabled={isLoading}
          maxLength={1000}
        />
        <button
          type="submit"
          className="chatbot-send-btn"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="18" 
            height="18" 
            fill="currentColor"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
