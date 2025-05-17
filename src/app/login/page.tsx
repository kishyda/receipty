"use client"
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await signIn('google', {
                callbackUrl: '/',
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            }
            if (!result?.error && !result?.ok) {
                setError("An unknown error occurred during sign in.");
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '600', textAlign: 'center', color: '#1f2937', marginBottom: '24px' }}>
                    Login
                </h1>

                <button
                    onClick={handleSignIn}
                    disabled={loading}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        backgroundColor: '#4285f4',
                        color: '#fff',
                        fontWeight: '600',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s ease',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3574e5';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4285f4';
                        }
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="24"
                        height="24"
                        style={{}}
                    >
                        <path
                            fill="#fbbc05"
                            d="M43.611 20.083H42.514v-5.821h-12.184v5.821H24.31v8.037h18.298v-8.037z"
                        />
                        <path
                            fill="#ea4335"
                            d="M6.306 14.691c.21-.656.83-1.233 1.577-1.594L13 4.407l7.931 3.068A24.091 24.091 0 0 0 8 14.691z"
                        />
                        <path
                            fill="#34a853"
                            d="M24 48c13.179 0 24-10.45 24-24s-10.821-24-24-24S0 10.45 0 24s10.821 24 24 24zM40 24c0-8-4-14.864-10-18.456v36.912c6.006-3.592 10-10.456 10-18.456z"
                        />
                        <path fill="#4285f4" d="M24 4c-11.875 0-22 9.405-22 20.843 0 9.707 5.82 18.33 14.07 22.948v-20.56h-7.19v-8.037h7.19V14.52s-4.753-1.16-4.753-4.064c0-2.836 2.544-5.213 5.27-5.213 1.451 0 2.736.607 3.464 1.292l2.19-2.125c-1.345-1.272-3.078-2.02-5.353-2.02-4.783 0-8.872 3.594-8.872 8.372 0 4.808 3.902 8.961 9.012 8.961 5.08 0 8.146-3.686 8.146-6.365 0-2.279-1.412-3.845-3.565-4.963z" />
                    </svg>
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                </button>

                {error && (
                    <div style={{ marginTop: '16px', backgroundColor: '#fee2e2', borderColor: '#fecaca', color: '#b91c1c', padding: '12px', borderRadius: '4px', borderWidth: '1px', borderStyle: 'solid' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width="20"
                                height="20"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#b91c1c' }}>Error</h2>
                        </div>
                        <p style={{ marginTop: '4px', fontSize: '14px' }}>{error}</p>
                    </div>
                )}

                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
                    This site uses Google authentication.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
