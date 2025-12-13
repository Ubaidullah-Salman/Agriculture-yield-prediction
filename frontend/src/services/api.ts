const API_BASE = '/api';

interface RequestOptions extends RequestInit {
    token?: string;
}

const getHeaders = (token?: string) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    } else {
        // Check localStorage for token if not provided explicitly
        const stored = localStorage.getItem('token');
        if (stored) {
            headers.append('Authorization', `Bearer ${stored}`);
        }
    }

    return headers;
};

export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Error' }));
            throw new Error(error.message || `Error ${response.status}`);
        }

        return response.json();
    },

    post: async <T>(endpoint: string, data: any): Promise<T> => {
        const isFormData = data instanceof FormData;
        const headers = getHeaders();

        if (isFormData) {
            headers.delete('Content-Type'); // Let browser set boundary
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: headers, // Headers (like Auth) are preserved, Content-Type was deleted above if FormData
            body: isFormData ? data : JSON.stringify(data),
        });

        if (!response.ok) {
            // If 401, usually means token expired
            if (response.status === 401) {
                // Optional: redirect to login
            }
            const error = await response.json().catch(() => ({ message: 'API Error' }));
            throw new Error(error.message || `Error ${response.status}`);
        }

        return response.json();
    },

    put: async <T>(endpoint: string, data: any): Promise<T> => {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Error' }));
            throw new Error(error.message || `Error ${response.status}`);
        }

        return response.json();
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Error' }));
            throw new Error(error.message || `Error ${response.status}`);
        }

        return response.json();
    }
};
