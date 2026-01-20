import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try{
            await login(email,password);
        } catch(error) {
            console.error('Login error: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex item-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-grey-900">School Dashboard</h1>
                    <p className="text-grey-600 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-grey-700">
                            Email Address
                        </label>
                        <input 
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter you email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-grey-700">
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter you password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-centre py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disables:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...': 'Sign In'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
    
};

export default Login;