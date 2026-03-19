const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Health check - verify backend is running
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Failed to connect to backend');
  }
};

/**
 * Upload and ingest a PDF document
 * @param {File} file - PDF file to upload
 * @returns {Promise<Object>} - Response with status and message
 */
export const ingestPDF = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Only PDF files are supported');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/ingest`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to ingest document');
    }

    return await response.json();
  } catch (error) {
    console.error('PDF ingestion failed:', error);
    throw error;
  }
};

/**
 * Ask a question based on ingested documents
 * @param {string} question - The question to ask
 * @returns {Promise<Object>} - Response with answer and metadata
 */
export const askQuestion = async (question) => {
  if (!question || question.trim() === '') {
    throw new Error('Question cannot be empty');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question.trim() }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get answer');
    }

    return await response.json();
  } catch (error) {
    console.error('Question failed:', error);
    throw error;
  }
};
