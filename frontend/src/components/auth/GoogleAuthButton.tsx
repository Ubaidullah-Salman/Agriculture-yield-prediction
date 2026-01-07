import React, { useEffect } from 'react';

declare global {
    interface Window {
        google: any;
    }
}

interface GoogleAuthButtonProps {
    onSuccess: (token: string) => void;
    onError: () => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSuccess, onError }) => {
    const buttonRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (window.google && buttonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '', // Use Vite syntax
                    callback: (response: any) => {
                        if (response.credential) {
                            onSuccess(response.credential);
                        } else {
                            onError();
                        }
                    }
                });

                window.google.accounts.id.renderButton(
                    buttonRef.current,
                    { theme: 'outline', size: 'large', width: '350' }
                );
            }
        };

        const scriptId = 'google-client';
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            // Script already loaded, just initialize/render
            // We need to wait a tick if window.google isn't ready yet, or check it.
            // If script tag exists but window.google is undefined, it might still be loading.
            if (window.google) {
                initializeGoogleSignIn();
            } else {
                existingScript.addEventListener('load', initializeGoogleSignIn);
                return () => existingScript.removeEventListener('load', initializeGoogleSignIn);
            }
        } else {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.id = scriptId;
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script);
        }
    }, [onSuccess, onError]);

    return <div ref={buttonRef} className="w-full flex justify-center"></div>;
};
