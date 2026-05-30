import { useCallback, useMemo, useState } from 'react';
import { submitFeedback } from '../services/apiService';

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ email, message }) => {
  const trimmedMessage = message.trim();
  if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
    return `Feedback must be at least ${MIN_MESSAGE_LENGTH} characters.`;
  }
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return `Feedback must be at most ${MAX_MESSAGE_LENGTH} characters.`;
  }
  if (email && !EMAIL_PATTERN.test(email.trim())) {
    return 'Please enter a valid email address, or leave the field blank.';
  }
  return null;
};

/**
 * Encapsulates feedback form state, validation, and submission. UI components
 * stay thin and focused on layout.
 */
export const useFeedbackForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const charCount = message.length;

  const handleSubmit = useCallback(async (event) => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const validationError = validate({ email, message });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await submitFeedback({ email: email.trim(), message: message.trim() });
      setSubmitted(true);
      setMessage('');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not send your feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [email, message]);

  const reset = useCallback(() => {
    setEmail('');
    setMessage('');
    setError('');
    setSubmitted(false);
  }, []);

  return useMemo(
    () => ({
      email,
      setEmail,
      message,
      setMessage,
      submitting,
      error,
      submitted,
      charCount,
      maxLength: MAX_MESSAGE_LENGTH,
      minLength: MIN_MESSAGE_LENGTH,
      handleSubmit,
      reset,
    }),
    [email, message, submitting, error, submitted, charCount, handleSubmit, reset]
  );
};

export default useFeedbackForm;
