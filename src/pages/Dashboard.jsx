import React, { useState, useRef, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import CodeDisplay from '../components/CodeDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Navbar from '../components/Navbar';
import AdSenseBanner from '../components/AdSenseBanner';
import { refactorCode } from '../services/apiService';
import '../styles/App.css';

/**
 * Authenticated dashboard hosting the Java code refactoring workflow.
 */
const Dashboard = () => {
  const [inputCode, setInputCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const displaySectionRef = useRef(null);

  useEffect(() => {
    if (refactoredCode && displaySectionRef.current) {
      setTimeout(() => {
        displaySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [refactoredCode]);

  const handleRefactorClick = async () => {
    if (!inputCode.trim()) {
      setError('Please enter Java code to refactor');
      return;
    }
    if (inputCode.length > 50000) {
      setError('Code size exceeds maximum limit of 50,000 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await refactorCode(inputCode);
      if (response.data && response.data.refactoredCode) {
        setOriginalCode(response.data.originalCode);
        setRefactoredCode(response.data.refactoredCode);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error refactoring code. Please try again.');
      } else if (err.message === 'Network Error') {
        setError('Network error. Please make sure the backend server is running at http://localhost:8080');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. The refactoring took too long. Please try with smaller code.');
      } else {
        setError(err.message || 'Error refactoring code. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setInputCode('');
    setOriginalCode('');
    setRefactoredCode('');
    setError('');
  };

  return (
    <div className="app-container">
      <Navbar />
      <header className="app-header">
        <div className="header-content">
          <h1>🔄 JAVA Code Refactor Assistant</h1>
          <p>AI-powered Java code refactoring</p>
        </div>
      </header>

      <main className="app-main">
        <ErrorMessage message={error} onClose={() => setError('')} />

        {loading && <LoadingSpinner />}

        <section className="editor-section">
          <CodeEditor code={inputCode} onChange={setInputCode} disabled={loading} />

          <div className="button-group">
            <button
              className="refactor-button"
              onClick={handleRefactorClick}
              disabled={loading || !inputCode.trim()}
              title="Click to refactor your Java code"
            >
              {loading ? 'Refactoring...' : '✨ Refactor Code'}
            </button>
            <button
              className="clear-button"
              onClick={handleClearAll}
              disabled={loading}
              title="Clear all content"
            >
              🗑️ Clear All
            </button>
          </div>
        </section>

        {(originalCode || refactoredCode) && (
          <section className="display-section" ref={displaySectionRef}>
            <CodeDisplay originalCode={originalCode} refactoredCode={refactoredCode} />
          </section>
        )}

        <AdSenseBanner adSlot={process.env.REACT_APP_ADSENSE_SLOT_DASHBOARD} responsive />
      </main>

      <footer className="app-footer">
        <p>Made with ❤️</p>
      </footer>
    </div>
  );
};

export default Dashboard;
