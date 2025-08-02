import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = React.useState(false);
  
  // Better text extraction function that handles React elements recursively
  const extractTextFromChildren = (children) => {
    if (typeof children === 'string') {
      return children;
    }
    
    if (typeof children === 'number') {
      return children.toString();
    }
    
    if (Array.isArray(children)) {
      return children.map(extractTextFromChildren).join('');
    }
    
    if (React.isValidElement(children)) {
      return extractTextFromChildren(children.props.children);
    }
    
    if (children && typeof children === 'object' && children.props) {
      return extractTextFromChildren(children.props.children);
    }
    
    return '';
  };

  const codeText = React.useMemo(() => {
    return extractTextFromChildren(children);
  }, [children]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (inline) {
    return (
      <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-xs font-mono break-all whitespace-pre-wrap max-w-full inline-block">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group w-full my-2 max-w-full">
      <div className="bg-gray-900 rounded-md overflow-hidden max-w-full">
        <div className="flex items-center justify-between bg-gray-800 px-2 sm:px-3 py-1 min-w-0">
          <span className="text-gray-400 text-xs font-medium truncate">
            {className ? className.replace('language-', '') : 'Code'}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white text-xs px-1 sm:px-2 py-1 rounded transition-colors flex-shrink-0"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="overflow-x-auto max-w-full">
          <pre className="p-2 sm:p-3 text-xs sm:text-sm min-w-0 max-w-full">
            <code 
              {...props} 
              className={`language-${className?.replace('language-', '') ?? ''} text-green-400 font-mono block whitespace-pre max-w-full`}
              style={{ 
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap'
              }}
            >
              {children}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  // Function to convert markdown to HTML
  const markdownToHtml = (markdown) => {
    return markdown
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Headers
      .replace(/^### (.+$)/gm, '<h3>$1</h3>')
      .replace(/^## (.+$)/gm, '<h2>$1</h2>')
      .replace(/^# (.+$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Blockquotes
      .replace(/^> (.+$)/gm, '<blockquote>$1</blockquote>')
      // Unordered lists
      .replace(/^[-*+] (.+$)/gm, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+$)/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Wrap list items in ul tags
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      // Clean up multiple ul tags
      .replace(/<\/ul>\s*<ul>/g, '');
  };

  const handleCopy = async () => {
    try {
      const htmlContent = markdownToHtml(text);
      const plainText = text.replace(/[#*`_\[\]()>-]/g, '').replace(/\n+/g, '\n').trim();
      
      // Create a ClipboardItem with both HTML and plain text
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlContent], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback to plain text if rich text copying fails
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy text: ', fallbackErr);
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors ${className}`}
      title="Copy response"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function ChatMessages({ messages, chatRef }) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 w-full">
      <div className="w-full max-w-4xl mx-auto px-3 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center px-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to QA ChatBot</h2>
              <p className="text-gray-600 text-sm">Ask me anything to get started!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="w-full space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-slate-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] shadow-sm">
                  <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {msg.prompt}
                  </div>
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex justify-start w-full">
                <div className="bg-white rounded-2xl rounded-bl-md px-3 sm:px-4 py-3 max-w-[95%] sm:max-w-[85%] shadow-sm border border-gray-100 min-w-0 overflow-hidden">
                  <div className="prose prose-sm max-w-none text-gray-800 min-w-0 overflow-hidden">
                    <ReactMarkdown
                      children={msg.response}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{ 
                        code: CodeBlock,
                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0 text-sm leading-relaxed break-words">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-3 pl-4 space-y-1 text-sm">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-3 pl-4 space-y-1 text-sm list-decimal">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="break-words text-sm leading-relaxed">
                            {children}
                          </li>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-3 text-gray-900 break-words">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-bold mb-2 text-gray-900 break-words">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-bold mb-2 text-gray-900 break-words">
                            {children}
                          </h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-3 border-blue-500 pl-3 my-3 italic text-gray-700 bg-blue-50 py-2 rounded-r">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3 rounded border max-w-full">
                            <table className="min-w-full text-xs border-collapse">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-gray-200 px-2 py-1 bg-gray-50 font-medium text-left text-xs">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-gray-200 px-2 py-1 text-xs break-words">
                            {children}
                          </td>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-700">
                            {children}
                          </em>
                        ),
                        a: ({ children, href }) => (
                          <a 
                            href={href} 
                            className="text-blue-600 hover:text-blue-800 underline break-all"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        )
                      }}
                    />
                  </div>
                  
                  {/* Copy Response Button */}
                  <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
                    <CopyButton text={msg.response} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatRef} />
      </div>
    </div>
  );
}