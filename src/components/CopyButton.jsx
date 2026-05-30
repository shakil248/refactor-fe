import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import '../styles/CopyButton.css';

/**
 * CopyButton Component
 * Provides copy-to-clipboard functionality with visual feedback.
 */
const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      className={`copy-button ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      title={label}
    >
      <FiCopy className="copy-icon" />
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
};

export default CopyButton;
