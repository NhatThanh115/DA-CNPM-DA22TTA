import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('login')}</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 relative">
          <button
            onClick={clearError}
            className="absolute right-2 top-2 text-red-400 hover:text-red-600"
          >
            ×
          </button>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('enterEmail')}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            {t('password')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('enterPassword')}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? t('hide') : t('show')}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          disabled={loading}
        >
          {loading ? t('loggingIn') : t('login')}
        </button>

        <div className="mt-4 text-center text-gray-600">
          {t('dontHaveAccount')}{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            {t('registerNow')}
          </Link>
        </div>

        <div className="mt-4 text-center text-gray-600">
          <p className="text-sm text-gray-500">{t('demoCredentials')}</p>
          <p className="text-sm text-gray-500">Email: user1@example.com</p>
          <p className="text-sm text-gray-500">{t('password')}: password123</p>
        </div>
      </form>
    </div>
  );
}
