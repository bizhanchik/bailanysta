
import React, { useState, useEffect } from 'react';
import { useNavigate }             from 'react-router-dom';
import { MoreVertical, Edit2 }     from 'lucide-react';
import api                         from '../api';
import Post                        from '../components/Post';
import Loader from '../components/Loader';

export default function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const userId     = storedUser?.userId;
  const navigate   = useNavigate();

  const [user,          setUser]          = useState(null);
  const [posts,         setPosts]         = useState([]);
  const [likedPosts,    setLikedPosts]    = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const [tab,       setTab]       = useState('posts');    
  const [isEditing, setIsEditing] = useState(false);
  const [fullname,  setFullname]  = useState('');
  const [username,  setUsername]  = useState('');
  const [bio,       setBio]       = useState('');
  const [location,  setLocation]  = useState('');
  const [saving,    setSaving]    = useState(false);

  
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  
  const [menuPostId,   setMenuPostId]   = useState(null);
  const [editPostId,   setEditPostId]   = useState(null);
  const [editText,     setEditText]     = useState('');
  const [editSaving,   setEditSaving]   = useState(false);

  
  useEffect(() => {
    if (!userId) return navigate('/login');
    api.get(`/users/${userId}`)
      .then(({ data }) => {
        setUser(data);
        setFullname(data.fullname);
        setUsername(data.username);
        setBio(data.bio || '');
        setLocation(data.location || '');
      })
      .catch(console.error);
  }, [userId, navigate]);

  
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    let params = {};
    if (tab === 'posts')      params = { author: userId };
    if (tab === 'likes')      params = { likedBy: userId };
    if (tab === 'favorites')  params = { favoritedBy: userId };
    api.get('/posts', { params })
      .then(({ data }) => {
        if (tab === 'posts')      setPosts(data);
        if (tab === 'likes')      setLikedPosts(data);
        if (tab === 'favorites')  setFavoritePosts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab, userId, deletePostId, editPostId]);

  
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/users/${userId}`, {
        fullname, username, bio, location
      });
      setUser(data);
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        fullname: data.fullname,
        username: data.username
      }));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${deletePostId}`);
      setDeletePostId(null);
    } catch (err) {
      console.error(err);
    }
    setDeleting(false);
  };

  
  const openEdit = post => {
    setEditPostId(post._id);
    setEditText(post.text);
    setMenuPostId(null);
  };

  
  const confirmEdit = async () => {
    setEditSaving(true);
    try {
      await api.put(`/posts/${editPostId}`, { text: editText });
      setEditPostId(null);
    } catch (err) {
      console.error(err);
    }
    setEditSaving(false);
  };

  if (!user) {
    return <div className="text-center mt-12 text-gray-500">Загрузка профиля…</div>;
  }

  const initials = user.username.slice(0,2).toUpperCase();
  const activePosts = tab === 'posts' ? posts : tab === 'likes' ? likedPosts : favoritePosts;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.fullname}</h1>
          <p className="text-gray-500">@{user.username}</p>
        </div>
        <button
          onClick={() => setIsEditing(prev => !prev)}
          className="ml-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          {isEditing ? 'Отменить' : 'Редактировать профиль'}
        </button>
      </div>

      {/* Edit Form / Display */}
      {isEditing ? (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Полное имя</label>
            <input
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Местоположение</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Сохраняем...' : 'Сохранить'}
          </button>
        </div>
      ) : (
        <div className="mb-6 space-y-2">
          {user.bio && <p className="text-gray-700">{user.bio}</p>}
          {user.location && (
            <p className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2C6.686 2 4 4.686 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z"/>
              </svg>
              {user.location}
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {['posts','likes','favorites'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-center rounded-lg font-semibold ${
              tab===t ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t==='posts'?'Посты':t==='likes'?'Лайки':'Избранное'}
          </button>
        ))}
      </div>

      {/* Posts List with Edit/Delete Menu */}
      {loading ? (
        <Loader/>
      ) : activePosts.length === 0 ? (
        <div className="text-gray-500">
          {tab==='posts'
            ? 'У вас пока нет постов.'
            : tab==='likes'
            ? 'Вы ещё не ставили лайки.'
            : 'У вас нет избранного.'}
        </div>
      ) : (
        activePosts.map(p => (
          <div key={p._id} className="relative group">
            {tab==='posts' && (
              <button
                onClick={() => setMenuPostId(menuPostId===p._id ? null : p._id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100"
                aria-label="Меню поста"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            )}
            {menuPostId === p._id && (
              <div className="absolute top-8 right-2 bg-white border rounded-lg shadow-md z-10">
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center px-4 py-2 space-x-2 hover:bg-gray-100 w-full text-left"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Редактировать</span>
                </button>
                <button
                  onClick={() => { setDeletePostId(p._id); setMenuPostId(null); }}
                  className="px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                >
                  Удалить
                </button>
              </div>
            )}
            <Post post={p} />
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Удалить пост?</h3>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeletePostId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Нет
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Удаляем...' : 'Да, удалить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Редактировать пост</h3>
            <textarea
              rows="4"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditPostId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Отменить
              </button>
              <button
                onClick={confirmEdit}
                disabled={editSaving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {editSaving ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
