import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'sonner';

interface GoogleAuthButtonProps {
    text?: string;
    onSuccess?: () => void;
}

export function GoogleAuthButton({ text = 'Continue with Google', onSuccess }: GoogleAuthButtonProps) {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                throw new Error('No credential received from Google');
            }

            console.log('Google credential received', credentialResponse);

            // Send token to backend
            const data: any = await api.post('/auth/google-login', {
                token: credentialResponse.credential,
            });

            console.log('Backend response', data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                toast.success('Successfully logged in with Google!');

                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            // api.ts throws new Error(message), so we use error.message
            const message = error.message || 'Failed to login with Google';
            toast.error(message);
        }
    };

    const handleError = () => {
        console.error('Google Login Failed');
        toast.error('Google Login connection failed');
    };

    return (
        <div className="flex justify-center w-full my-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                text={text === 'signup_with' ? 'signup_with' : 'signin_with'}
                shape="rectangular"
                width="100%"
                theme="outline"
            />
        </div>
    );
}
