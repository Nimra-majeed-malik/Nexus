import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'investor' | 'entrepreneur'>('entrepreneur');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (strength <= 1) return 'Very Weak';
    if (strength === 2) return 'Weak';
    if (strength === 3) return 'Fair';
    if (strength === 4) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = () => {
    if (strength <= 1) return 'text-red-500';
    if (strength === 2) return 'text-orange-500';
    if (strength === 3) return 'text-yellow-500';
    if (strength === 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match!');
    if (strength < 3) return setError('Please choose a stronger password!');
    setLoading(true);
    try {
      await register(name, email, password, role);
      setShowOtp(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');
    if (value && index < 5) {
      document.getElementById(`reg-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits to verify!');
      return;
    }
    if (role === 'entrepreneur') {
      navigate('/dashboard/entrepreneur');
    } else {
      navigate('/dashboard/investor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {showOtp ? (
          <>
            {/* OTP Screen */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🔐</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Verify Your Account</h1>
              <p className="text-gray-500 mt-1">Enter the 6-digit OTP sent to your email</p>
              <p className="text-sm text-blue-500 font-medium mt-1">{email}</p>
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm text-center">
                {otpError}
              </div>
            )}

            <div className="flex gap-2 justify-center mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`reg-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition ${
                    digit ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } focus:border-blue-500`}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center gap-1 mb-4">
              {otp.map((digit, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition ${
                    digit ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-6 text-center">
              <p className="text-sm text-blue-600 font-medium">💡 Demo: Enter any 6 digits to verify</p>
              <p className="text-xs text-blue-400 mt-1">All 6 boxes must be filled</p>
            </div>

            <button
              onClick={handleOtpVerify}
              className={`w-full py-3 rounded-xl font-medium transition text-white ${
                otp.join('').length === 6
                  ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              ✅ Verify & Go to Dashboard
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Entered {otp.filter(d => d !== '').length}/6 digits
            </p>
          </>
        ) : (
          <>
            {/* Register Form */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500 mt-1">Join the Nexus platform</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name..."
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('entrepreneur')}
                    className={`p-4 rounded-xl border-2 text-center transition ${
                      role === 'entrepreneur'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚀</div>
                    <p className="font-medium text-sm text-gray-800">Entrepreneur</p>
                    <p className="text-xs text-gray-500">I have a startup</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('investor')}
                    className={`p-4 rounded-xl border-2 text-center transition ${
                      role === 'investor'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">💼</div>
                    <p className="font-medium text-sm text-gray-800">Investor</p>
                    <p className="text-xs text-gray-500">I want to invest</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password..."
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i <= strength ? getStrengthColor() : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-xs font-medium ${getStrengthTextColor()}`}>
                        {getStrengthLabel()}
                      </p>
                      <p className="text-xs text-gray-400">Use uppercase, numbers & symbols</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password..."
                  required
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-400'
                      : 'border-gray-200'
                  }`}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition"
              >
                {loading ? 'Creating account...' : 'Create Account 🚀'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;