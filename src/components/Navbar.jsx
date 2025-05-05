
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <h1 className="text-2xl font-bold text-green-600">Bailanysta</h1>
        <div className="ml-auto flex items-center space-x-6">
          <Link
            to="/feed"
            className={`hover:text-green-600 ${pathname === '/feed' && 'font-semibold text-green-600'}`}
          >
            Лента
          </Link>

          {user && (
            <Link
              to="/profile"
              className={`hover:text-green-600 ${pathname === '/profile' && 'font-semibold text-green-600'}`}
            >
              Профиль
            </Link>
          )}

          {/* Вот он, Поиск — показываем только залогиненным */}
          {user && (
            <Link
              to="/search"
              className={`hover:text-green-600 ${pathname === '/search' && 'font-semibold text-green-600'}`}
            >
              Поиск
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/register"
                className={`hover:text-green-600 ${pathname === '/register' && 'font-semibold text-green-600'}`}
              >
                Регистрация
              </Link>
              <Link
                to="/login"
                className={`hover:text-green-600 ${pathname === '/login' && 'font-semibold text-green-600'}`}
              >
                Вход
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 font-semibold"
            >
              Выход
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
