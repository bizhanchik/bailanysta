
import React, { useState, useEffect } from 'react';
import { useParams }                from 'react-router-dom';
import api                          from '../api';
import Post                         from '../components/Post';

export default function UserPage() {
  const { id } = useParams();

  const [user,            setUser]            = useState(null);
  const [posts,           setPosts]           = useState([]);
  const [likedPosts,      setLikedPosts]      = useState([]);
  const [favoritePosts,   setFavoritePosts]   = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [tab,             setTab]             = useState('posts'); 

  
  useEffect(() => {
    api.get(`/users/${id}`)
      .then(({ data }) => setUser(data))
      .catch(console.error);
  }, [id]);

  
  useEffect(() => {
    setLoading(true);

    
    let params = {};
    if (tab === 'posts') {
      params = { author: id };
    } else if (tab === 'likes') {
      params = { likedBy: id };
    } else if (tab === 'favorites') {
      params = { favoritedBy: id };
    }

    api.get('/posts', { params })
      .then(({ data }) => {
        if (tab === 'posts') {
          setPosts(data);
        } else if (tab === 'likes') {
          setLikedPosts(data);
        } else {
          setFavoritePosts(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab, id]);

  if (!user) {
    return (
      <div className="text-center mt-12 text-gray-500">Загрузка пользователя…</div>
    );
  }

  
  const activePosts =
    tab === 'posts' ? posts :
    tab === 'likes' ? likedPosts :
    favoritePosts;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-1">{user.fullname}</h1>
      <p className="text-gray-500 mb-4">@{user.username}</p>

      {/* Tabs */}
      <div className="flex mb-4 space-x-2">
        {['posts', 'likes', 'favorites'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-center rounded-lg font-semibold ${
              tab === t
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t === 'posts'
              ? 'Посты'
              : t === 'likes'
              ? 'Лайки'
              : 'Избранное'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center text-gray-500">Загрузка…</div>
      ) : activePosts.length === 0 ? (
        <div className="text-gray-500 text-center">
          {tab === 'posts'
            ? 'У пользователя нет постов.'
            : tab === 'likes'
            ? 'Пользователь ещё не ставил лайки.'
            : 'У пользователя нет избранного.'}
        </div>
      ) : (
        activePosts.map(post => (
          <Post key={post._id} post={post} />
        ))
      )}
    </div>
  );
}
