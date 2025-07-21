const API_URL = process.env.REACT_APP_API_URL;

// --- Helper: Unified response handler ---
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || `Request failed with status ${response.status}`);
    }
    return data;
};

// --- Helper: Auth headers including guest mode ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    return {
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
        'x-guest-mode': isGuest ? 'true' : 'false'
    };
};

// --- Optional: Simulate delay for dev testing ---
const simulateDelay = () => {
    if (process.env.NODE_ENV === 'development') {
        return new Promise(resolve => setTimeout(resolve, 500));
    }
    return Promise.resolve();
};

export const api = {
    // --- Auth ---
    login: async (email, password) => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (email, password) => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // --- Progress ---
    fetchProgress: async () => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}/progress`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Fetch progress error:', error);
            if (localStorage.getItem('isGuest') === 'true') {
                return { progress: [] };
            }
            throw error;
        }
    },

    saveProgress: async (progressData) => {
        await simulateDelay();
        try {
            if (localStorage.getItem('isGuest') === 'true') {
                console.warn('Progress not saved - guest mode active');
                return { success: true, guest: true };
            }

            const response = await fetch(`${API_URL}/progress`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(progressData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Save progress error:', error);
            throw error;
        }
    },

    // --- Guest Mode ---
    initializeGuestSession: async () => {
        await simulateDelay();
        try {
            return { success: true, guest: true };
        } catch (error) {
            console.error('Guest initialization error:', error);
            throw error;
        }
    },

    // --- Submit Feedback ---
    submitFeedback: async ({ message, email, issueType, name }) => {
        await simulateDelay();
        try {
          const response = await fetch(`${API_URL}/submit-feedback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message,
              email: email || undefined, // Send undefined instead of empty string
              issueType,
              name: name || undefined,
              pageUrl: window.location.href
            }),
          });
    
          return await handleResponse(response);
        } catch (error) {
          console.error('Feedback submission error:', error);
          
          // Enhance the error message for common cases
          let enhancedError = error;
          if (error.message.includes('Failed to fetch')) {
            enhancedError = new Error('Network error. Please check your connection.');
          } else if (error.message.includes('<!DOCTYPE html>')) {
            enhancedError = new Error('Server error occurred. Please try again later.');
          }
          
          throw enhancedError;
        }
      }
    };