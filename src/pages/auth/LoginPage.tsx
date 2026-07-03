import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

type Step = 'login' | 'otp';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      setStep('otp');
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpVerify = () => {
    const code = otp.join('');
    if (code.length < 6) return setError('Please enter all 6 digits');
    navigate('/dashboard');
  };

  const handleSkipOtp = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            step === 'login' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}>1</div>
          <div className={`h-1 w-16 rounded ${step === 'otp' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            step === 'otp' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>2</div>
        </div>

        {step === 'login' ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-1">Step 1: Enter your credentials</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center gap-2 cursor-pointer p-3 border-2 rounded-xl transition" style={{borderColor: role === 'entrepreneur' ? '#3b82f6' : '#e5e7eb', backgroundColor: role === 'entrepreneur' ? '#f0f7ff' : 'white'}}>
                    <input
                      type="radio"
                      name="role"
                      value="entrepreneur"
                      checked={role === 'entrepreneur'}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Entrepreneur</span>
                  </label>
                  <label className="flex-1 flex items-center gap-2 cursor-pointer p-3 border-2 rounded-xl transition" style={{borderColor: role === 'investor' ? '#3b82f6' : '#e5e7eb', backgroundColor: role === 'investor' ? '#f0f7ff' : 'white'}}>
                    <input
                      type="radio"
                      name="role"
                      value="investor"
                      checked={role === 'investor'}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Investor</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition"
              >
                {loading ? 'Signing in...' : 'Continue →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🔐</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">2FA Verification</h1>
              <p className="text-gray-500 mt-1">Step 2: Enter the 6-digit OTP</p>
              <p className="text-sm text-gray-400 mt-1">Code sent to {email}</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            {/* OTP boxes */}
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-6 text-center">
              <p className="text-sm text-blue-600">💡 Demo: Enter any 6 digits to verify</p>
            </div>

            <button
              onClick={handleOtpVerify}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition mb-3"
            >
              ✅ Verify OTP
            </button>

            <button
              onClick={handleSkipOtp}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-medium transition"
            >
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
};