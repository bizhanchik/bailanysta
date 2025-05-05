
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Post from '../components/Post';
import Loader from '../components/Loader';

export default function SearchPage() {
  const [searchType, setSearchType] = useState('users'); 
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        if (searchType === 'users') {
          const res = await api.get('/users', { params: { search: query } });
          setUsers(res.data);
        } else {
          const res = await api.get('/posts', { params: { search: query } });
          setPosts(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    
    const timeout = setTimeout(fetch, 300);
    return () => clearTimeout(timeout);
  }, [searchType, query]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Поиск</h2>

      {/* Toggle between Users & Posts */}
      <div className="flex mb-4 space-x-2">
        {['users','posts'].map(type => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            className={`flex-1 py-2 text-center rounded-lg font-semibold ${
              searchType === type
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type === 'users' ? 'Пользователи' : 'Посты'}
          </button>
        ))}
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder={searchType === 'users' ? 'Поиск пользователей...' : 'Поиск по тексту постов...'}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Results */}
      {loading ? (
        <Loader/>
      ) : searchType === 'users' ? (
        users.length > 0 ? (
          <ul>
            {users.map(u => (
              <li key={u._id} className="p-4 bg-white rounded-lg shadow mb-3">
                <Link to={`/user/${u._id}`}>
                  <div className="font-semibold">{u.username}</div>
                  <div className="text-gray-600 text-sm">{u.fullname}</div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center">Пользователи не найдены.</div>
        )
      ) : posts.length > 0 ? (
        posts.map(p => <Post key={p._id} post={p} />)
      ) : (
        <div className="text-gray-500 text-center">Посты не найдены.</div>
      )}
    </div>
  );
}
