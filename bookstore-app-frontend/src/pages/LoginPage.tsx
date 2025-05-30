import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/profile');
    }
  }, [currentUser, navigate]);

  // Set page title
  useEffect(() => {
    document.title = `${t('login')} | BookHaven`;
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
