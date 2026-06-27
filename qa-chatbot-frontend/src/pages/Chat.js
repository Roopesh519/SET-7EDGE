import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import tokenManager from '../utils/tokenManager';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import Sidebar from '../components/Chat/Sidebar';
import MobileSidebar from '../components/Chat/MobileSidebar';
import ApiKeyModal from '../components/modals/ApiKeyModal';
import MessageLimitModal from '../components/modals/MessageLimitModal';

export default function Chat() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const hasInitiallyLoaded = useRef(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [trialStatus, setTrialStatus] = useState({
    hasApiKey: null,
    trialPromptsUsed: 0,
    remainingTrialPrompts: null
  });

  const chatRef = useRef();
  const mainContainerRef = useRef();
  const messagesContainerRef = useRef();
  const token = tokenManager.getToken();
  const TRIAL_LIMIT = 5;
  const CONVERSATION_MESSAGE_LIMIT = 50; // Maximum number of message pairs (user + assistant) per conversation

  const checkApiKeyStatus = async () => {
    try {
      const res = await api.get('/settings');
      return res.data.hasApiKey;
    } catch (err) {
      console.error('Failed to check API key status:', err);
      // Assume no API key on error
      return false;
    }
  };

  const checkTrialStatus = async () => {
    try {
      const res = await api.get('/chat/trial-status');
      setTrialStatus(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to check trial status:', err);
      // Default trial status on error
      const defaultStatus = {
        hasApiKey: false,
        trialPromptsUsed: 0,
        remainingTrialPrompts: TRIAL_LIMIT
      };
      setTrialStatus(defaultStatus);
      return defaultStatus;
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      // Always set activeConversationId first to update UI immediately
      setActiveConversationId(conversationId);
      
      // Add timestamp query parameter to bypass cache and ensure fresh data
      const timestamp = new Date().getTime();
      const res = await api.get(`/chat/conversations/${conversationId}?t=${timestamp}`);
      const loadedMessages = res.data.messages || [];
      setMessages(loadedMessages);
      
      // Check if loaded conversation is at limit
      if (loadedMessages.length >= CONVERSATION_MESSAGE_LIMIT * 2) {
        // Don't show modal immediately, but user will see it when trying to send
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
      // Reset on error
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  const loadingMessages = [
    'Thinking...',
    'Typing your answer...',
    'Gathering info...',
    'Consulting the data hive...',
    'One sec, almost there...',
  ];

  const handleUpdateConversationTitle = async (conversationId, newTitle) => {
    try {
      await api.patch(`/chat/conversations/${conversationId}`, {
        title: newTitle,
      });

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, title: newTitle } : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await api.delete(`/chat/conversations/${conversationId}`);

      setConversations((prev) =>
        prev.filter((conv) => conv._id !== conversationId)
      );

      if (activeConversationId === conversationId) {
        setMessages([]);
        setActiveConversationId(null);

        const remainingConversations = conversations.filter(
          (conv) => conv._id !== conversationId
        );
        if (remainingConversations.length > 0) {
          loadConversation(remainingConversations[0]._id);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Check if conversation has reached message limit
    if (messages.length >= CONVERSATION_MESSAGE_LIMIT * 2) {
      setShowLimitModal(true);
      return;
    }

    // Check trial status before sending message
    const currentTrialStatus = trialStatus.hasApiKey !== null ? trialStatus : await checkTrialStatus();
    
    // If no API key and trial exhausted, show modal
    if (!currentTrialStatus.hasApiKey && currentTrialStatus.remainingTrialPrompts <= 0) {
      setShowApiKeyModal(true);
      return;
    }

    const randomLoadingMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const newMessage = { prompt: input, response: randomLoadingMessage };

    setMessages((prev) => [...prev, newMessage]);
    const currentInput = input; // Store current input
    setInput('');

    const conversationHistory = messages.flatMap((msg) => [
      { role: 'user', content: msg.prompt },
      { role: 'assistant', content: msg.response },
    ]);

    conversationHistory.push({ role: 'user', content: currentInput });

    try {
      const res = await api.post('/chat', {
        messages: conversationHistory,
        conversationId: activeConversationId,
      });

      const reply = res.data.reply;

      // Update trial status if remaining prompts info is provided
      if (res.data.remainingTrialPrompts !== undefined) {
        setTrialStatus(prev => ({
          ...prev,
          remainingTrialPrompts: res.data.remainingTrialPrompts,
          trialPromptsUsed: TRIAL_LIMIT - res.data.remainingTrialPrompts
        }));
      }

      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
        fetchConversations();
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { prompt: currentInput, response: reply },
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Remove the loading message since we got an error
      setMessages((prev) => prev.slice(0, -1));
      setInput(currentInput); // Restore the input

      // Handle specific error codes
      if (err.response) {
        const errorMessage = err.response.data?.error || '';
        const errorCode = err.response.data?.code;
        const statusCode = err.response.status;
        
        // Handle conversation limit reached error
        if (errorCode === 'CONVERSATION_LIMIT_REACHED' || statusCode === 400) {
          if (errorMessage.toLowerCase().includes('conversation limit') || errorMessage.toLowerCase().includes('limit reached')) {
            setShowLimitModal(true);
            return;
          }
        }
        
        // Handle trial exhausted error
        if (errorCode === 'TRIAL_EXHAUSTED' || statusCode === 403) {
          // Update trial status to show exhausted
          setTrialStatus(prev => ({
            ...prev,
            remainingTrialPrompts: 0,
            trialPromptsUsed: TRIAL_LIMIT
          }));
          setShowApiKeyModal(true);
          return;
        }
        
        // Handle API key errors
        if (
          errorCode === 'INVALID_API_KEY' ||
          statusCode === 401 || 
          errorMessage.toLowerCase().includes('api key') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('authentication')
        ) {
          // Re-check statuses
          await checkApiKeyStatus();
          await checkTrialStatus();
          setShowApiKeyModal(true);
          return;
        }
      }
      
      // For other errors, show generic message
      alert('Error sending message. Please try again.');
    }
  };

  // Enhanced viewport height calculation for mobile
  const updateViewportHeight = () => {
    // Use window.visualViewport for better mobile support
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    
    // Set CSS custom property
    const vh = height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--real-vh', `${height}px`);
  };

  const handleNavigateToSettings = () => {
    setShowApiKeyModal(false);
    navigate('/settings');
  };

  const handleModalClose = () => {
    setShowApiKeyModal(false);
    // Re-check API key status and trial status when modal is closed
    checkApiKeyStatus();
    checkTrialStatus();
  };

  useEffect(() => {
    // Remove any existing page transition overlay
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      overlay.remove();
    }

    if (!isAuthenticated && !loading) {
      alert('You must be logged in to use the chat.');
      navigate('/login');
      return;
    }

    // Add chat-specific CSS class to body
    document.body.classList.add('chat-page');

    // Check API key status and trial status, fetch conversations
    checkApiKeyStatus();
    checkTrialStatus();
    fetchConversations();

    // Enhanced viewport height handling
    updateViewportHeight();
    
    // Listen for viewport changes (mobile keyboard, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
    }
    
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewportHeight, 100);
    });

    // Trigger page load animation
    setTimeout(() => setIsPageLoaded(true), 100);

    return () => {
      // Clean up chat-specific styles
      document.body.classList.remove('chat-page');
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
      }
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    // Only auto-load the first conversation on initial load, not when user explicitly creates new chat
    if (conversations.length > 0 && !activeConversationId && !hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadConversation(conversations[0]._id);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    // Only prevent body scrolling when sidebars are open, not for main chat
    if (showSidebar || showMobileMenu) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [showSidebar, showMobileMenu]);

  useEffect(() => {
    // Smooth scroll to bottom when new messages arrive
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = () => {
    logout();
    setMessages([]);
    setInput('');
    setShowSidebar(false);
    setShowMobileMenu(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setInput('');
    // Mark that we've initially loaded so useEffect doesn't auto-load a conversation
    hasInitiallyLoaded.current = true;
  };

  // Determine what banner to show
  const getBannerContent = () => {
    if (trialStatus.hasApiKey) {
      return null; // No banner if user has API key
    }

    if (trialStatus.remainingTrialPrompts > 0) {
      // Show trial remaining banner
      return {
        type: 'trial',
        content: (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-4 h-4 bg-blue-400 rounded-full flex-shrink-0"></div>
            <span className="text-blue-800">
              <strong>Trial Mode:</strong> You have{' '}
              <strong>{trialStatus.remainingTrialPrompts}</strong> free {trialStatus.remainingTrialPrompts === 1 ? 'prompt' : 'prompts'} remaining.{' '}
              <button 
                onClick={() => setShowApiKeyModal(true)}
                className="underline hover:no-underline font-medium"
              >
                Add your API key
              </button>{' '}
              for unlimited usage.
            </span>
          </div>
        ),
        bgColor: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-200'
      };
    } else {
      // Show API key required banner
      return {
        type: 'required',
        content: (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-4 h-4 bg-orange-400 rounded-full flex-shrink-0"></div>
            <span className="text-orange-800">
              <strong>API Key Required:</strong> Configure your Hugging Face API key in{' '}
              <button 
                onClick={() => setShowApiKeyModal(true)}
                className="underline hover:no-underline font-medium"
              >
                settings
              </button>{' '}
              to continue chatting.
            </span>
          </div>
        ),
        bgColor: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-200'
      };
    }
  };

  const bannerContent = getBannerContent();

  return (
    <div
      ref={mainContainerRef}
      className={`chat-main-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex transition-all duration-500 ease-out ${
        isPageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={handleModalClose}
        onNavigateToSettings={handleNavigateToSettings}
      />

      {/* Message Limit Modal */}
      <MessageLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onNewChat={handleNewChat}
        messageLimit={CONVERSATION_MESSAGE_LIMIT}
      />

      <Sidebar
        conversations={conversations}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onUpdateConversationTitle={handleUpdateConversationTitle}
        onDeleteConversation={handleDeleteConversation}
        activeConversationId={activeConversationId}
      />
      <MobileSidebar
        conversations={conversations}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onUpdateConversationTitle={handleUpdateConversationTitle}
        onDeleteConversation={handleDeleteConversation}
        activeConversationId={activeConversationId}
      />
      
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader
          setShowSidebar={setShowSidebar}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          handleLogout={handleLogout}
          isOnChatPage={true}
          className="flex-shrink-0"
        />
        
        <main className="flex-1 p-1 min-h-0">
          <div 
            className={`flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 shadow-xl transition-all duration-700 ease-out h-full ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Sticky Banner */}
            {bannerContent && (
              <div className="flex-shrink-0 sticky top-0 z-10 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-100">
                <div className={`mx-4 my-3 p-3 bg-gradient-to-r ${bannerContent.bgColor} border ${bannerContent.borderColor} rounded-xl shadow-sm`}>
                  {bannerContent.content}
                </div>
              </div>
            )}

            {/* Messages Container - Scrollable */}
            <div 
              ref={messagesContainerRef}
              className="messages-container flex-1 overflow-y-auto overflow-x-hidden"
              style={{
                minHeight: 0,
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <ChatMessages 
                messages={messages} 
                chatRef={chatRef}
              />
            </div>
            
            {/* Input Container - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200">
              <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                token={token}
                activeConversationId={activeConversationId}
                setMessages={setMessages}
                disabled={
                  (!trialStatus.hasApiKey && trialStatus.remainingTrialPrompts <= 0) ||
                  (messages.length >= CONVERSATION_MESSAGE_LIMIT * 2)
                }
              />
              {/* Show warning when approaching limit */}
              {messages.length >= CONVERSATION_MESSAGE_LIMIT * 2 - 4 && messages.length < CONVERSATION_MESSAGE_LIMIT * 2 && (
                <div className="px-4 py-2 bg-orange-50 border-t border-orange-200">
                  <p className="text-sm text-orange-700">
                    ⚠️ You're approaching the conversation limit ({Math.ceil((CONVERSATION_MESSAGE_LIMIT * 2 - messages.length) / 2)} message pairs remaining). 
                    Consider starting a new chat soon.
                  </p>
                </div>
              )}
              {/* Show limit reached message */}
              {messages.length >= CONVERSATION_MESSAGE_LIMIT * 2 && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-200">
                  <p className="text-sm text-red-700 font-medium">
                    ⛔ Conversation limit reached. Please start a new chat to continue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}