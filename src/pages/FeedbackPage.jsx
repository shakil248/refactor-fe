import React from 'react';
import Navbar from '../components/Navbar';
import FeedbackForm from '../components/FeedbackForm';
import '../styles/Feedback.css';

/**
 * Public feedback page (anonymous submissions allowed). Route: /feedback
 */
const FeedbackPage = () => (
  <div className="feedback-page">
    <Navbar />
    <main className="feedback-main">
      <header className="feedback-header">
        <h1>Help Us Improve</h1>
        <p>We value your feedback. Share your ideas, suggestions, issues, or comments.</p>
      </header>
      <section className="feedback-card">
        <FeedbackForm />
      </section>
    </main>
  </div>
);

export default FeedbackPage;
