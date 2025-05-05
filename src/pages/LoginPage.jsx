import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Неверные данные');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Вход</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" required />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" required />
        <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-lg">{loading ? 'Входим...' : 'Войти'}</button>
      </form>
      <p className="text-sm text-center mt-4">
        Нет аккаунта? <Link to="/register" className="text-green-600 hover:underline">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
