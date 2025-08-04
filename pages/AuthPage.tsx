import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../services/user';
import { useUser } from '../services/user';
import { Button, Card } from '../components/ui';
import { DumbbellIcon, GoogleIcon } from '../components/Icons';

const AuthPage: React.FC = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        if (!userLoading && user) {
             navigate('/dashboard');
        }
    }, [user, userLoading, navigate]);

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google.');
            setLoading(false);
        }
    };

    if (userLoading || user) {
        return <div className="min-h-screen flex items-center justify-center bg-primary-bg"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-1"></div></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-bg p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                     <DumbbellIcon className="w-16 h-16 text-accent-1 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-light-1">Fit Happens</h1>
                    <p className="text-medium-1 mt-1">Your journey to physical and mental wellness starts here.</p>
                </div>
                
                <div className="space-y-6">
                    {error && <p className="text-error text-sm text-center">{error}</p>}
                    
                    <Button 
                        onClick={handleGoogleSignIn} 
                        className="w-full flex items-center justify-center gap-3 !bg-white !text-gray-800 hover:!bg-gray-200"
                        disabled={loading}
                    >
                        <GoogleIcon className="w-6 h-6" />
                        {loading ? 'Signing in...' : 'Sign in with Google'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AuthPage;