import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useFeedbackForm } from '../hooks/useFeedbackForm';
import '../styles/Feedback.css';

/**
 * Presentational form for submitting feedback. State and validation live in
 * the useFeedbackForm hook so this component stays focused on layout.
 */
const FeedbackForm = () => {
  const form = useFeedbackForm();
  const {
    email, setEmail,
    message, setMessage,
    submitting, error, submitted,
    charCount, maxLength, minLength,
    handleSubmit, reset,
  } = form;

  if (submitted) {
    return (
      <div className="feedback-success" role="status">
        <h2>Thank you!</h2>
        <p>Your feedback has been received. We appreciate you taking the time to share it.</p>
        <button type="button" className="feedback-submit" onClick={reset}>
          Submit another response
        </button>
      </div>
    );
  }

  const remaining = maxLength - charCount;
  const counterClass = remaining < 0 ? 'feedback-counter feedback-counter--over' : 'feedback-counter';

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={error} onClose={() => form.error && (form.error === error)} />

      <label htmlFor="feedback-email">Email address <span className="feedback-optional">(optional)</span></label>
      <input
        id="feedback-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email (optional)"
        disabled={submitting}
        aria-describedby="feedback-email-hint"
      />
      <small id="feedback-email-hint" className="feedback-hint">
        Leave blank to submit anonymously. We only use this to follow up if needed.
      </small>

      <label htmlFor="feedback-message">Your feedback</label>
      <textarea
        id="feedback-message"
        rows={8}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share an idea, a problem you ran into, a feature request, or a general comment..."
        disabled={submitting}
        aria-required="true"
        aria-describedby="feedback-message-hint feedback-counter"
        maxLength={maxLength + 50}
      />
      <div className="feedback-meta">
        <small id="feedback-message-hint" className="feedback-hint">
          {minLength}&ndash;{maxLength} characters.
        </small>
        <small id="feedback-counter" className={counterClass}>
          {charCount} / {maxLength}
        </small>
      </div>

      <button type="submit" className="feedback-submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send feedback'}
      </button>

      {submitting && <LoadingSpinner message="Sending feedback..." />}
    </form>
  );
};

export default FeedbackForm;
