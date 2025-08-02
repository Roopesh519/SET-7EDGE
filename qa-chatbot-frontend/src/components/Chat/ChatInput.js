import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import AcceptanceCriteriaModal from '../modals/AcceptanceCriteriaModal';
import TestCharterModal from '../modals/TestCharterModal';
import GherkinModal from '../modals/GherkinModal';
import StepDefinitionModal from '../modals/StepDefinitionModal';

export default function ChatInput({ input, setInput, sendMessage, token, activeConversationId, setMessages }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileQuestion, setFileQuestion] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Modal states
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [showTestCharterModal, setShowTestCharterModal] = useState(false);
  const [showGherkinModal, setShowGherkinModal] = useState(false);
  const [showStepDefinitionModal, setShowStepDefinitionModal] = useState(false);

  // Automatically resize the textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.overflowY = 'hidden';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
      el.style.overflowY = el.scrollHeight > 160 ? 'auto' : 'hidden';
    }
  }, [input]);

  // Handle file selection
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setFileQuestion('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload and ask about the file
  const submitFileWithQuestion = async () => {
    if (!selectedFile) return alert('Please select a file.');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('followupQuestion', fileQuestion);
    formData.append('conversationId', activeConversationId || '');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const reply = res.data.reply;
      const fileName = selectedFile.name;

      setMessages(prev => [
        ...prev,
        {
          prompt: `📎 ${fileName}${fileQuestion ? `\n❓ ${fileQuestion}` : ''}`,
          response: reply
        }
      ]);

      setSelectedFile(null);
      setFileQuestion('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle send on Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle modal confirmations
  const handleAcceptanceCriteriaConfirm = (prompt) => {
    setInput(prompt);
    setShowAcceptanceModal(false);
  };

  const handleTestCharterConfirm = (prompt) => {
    setInput(prompt);
    setShowTestCharterModal(false);
  };

  const handleGherkinConfirm = (prompt) => {
    setInput(prompt);
    setShowGherkinModal(false);
  };

  const handleStepDefinitionConfirm = (prompt) => {
    setInput(prompt);
    setShowStepDefinitionModal(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Options Row */}
        <div className="mb-4">
          {/* Desktop: Original layout */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                <div className="grid grid-cols-4 gap-2 min-w-max">
                  <button
                    onClick={() => setShowAcceptanceModal(true)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Acceptance Criteria
                  </button>
                  <button
                    onClick={() => setShowTestCharterModal(true)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Test Charter
                  </button>
                  <button
                    onClick={() => setShowGherkinModal(true)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Generate Gherkin
                  </button>
                  <button
                    onClick={() => setShowStepDefinitionModal(true)}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Step Definitions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Scrollable layout */}
          <div className="md:hidden">
            <div className="mb-4 flex justify-center w-full">
              <div className="flex gap-3 max-w-[350px] min-w-[200px] overflow-x-auto">
                <button
                  onClick={() => setShowAcceptanceModal(true)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Acceptance Criteria
                </button>
                <button
                  onClick={() => setShowTestCharterModal(true)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Test Charter
                </button>
                <button
                  onClick={() => setShowGherkinModal(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Generate Gherkin
                </button>
                <button
                  onClick={() => setShowStepDefinitionModal(true)}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Step Definitions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        {selectedFile && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Remove file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask something about this file... (optional)"
                value={fileQuestion}
                onChange={(e) => setFileQuestion(e.target.value)}
                className="flex-1 px-3 py-2 border text-gray-700 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitFileWithQuestion();
                  }
                }}
              />
              <button
                onClick={submitFileWithQuestion}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload & Ask</span>
                  </>
                )}
              </button>
            </div>
            {/* Helper Text */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>This feature is still in progress.</span>
              <span>Max file size: 10MB</span>
            </div>
          </div>
        )}

        {/* Main Input Section */}
        <div className="flex items-end gap-1">
          {/* File Upload Button */}
          <div className="flex-shrink-0 mb-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.csv,.xlsx,.xls"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Upload file"
              disabled={isUploading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask anything..."
              className="w-full px-4 py-3 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none max-h-[160px] overflow-y-auto placeholder-gray-500"
            />
          </div>

          {/* Send Button */}
          <div className="flex-shrink-0 ml-2 mb-2">
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isUploading}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AcceptanceCriteriaModal
        isOpen={showAcceptanceModal}
        onClose={() => setShowAcceptanceModal(false)}
        onConfirm={handleAcceptanceCriteriaConfirm}
      />

      <TestCharterModal
        isOpen={showTestCharterModal}
        onClose={() => setShowTestCharterModal(false)}
        onConfirm={handleTestCharterConfirm}
      />

      <GherkinModal
        isOpen={showGherkinModal}
        onClose={() => setShowGherkinModal(false)}
        onConfirm={handleGherkinConfirm}
      />

      <StepDefinitionModal
        isOpen={showStepDefinitionModal}
        onClose={() => setShowStepDefinitionModal(false)}
        onConfirm={handleStepDefinitionConfirm}
      />
    </div>
  );
}