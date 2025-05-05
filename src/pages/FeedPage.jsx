
import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import Post from '../components/Post';
import { UserContext } from '../context/UserContext';
import { Pen } from 'lucide-react';
import Loader from '../components/Loader';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  
  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [creating, setCreating] = useState(false);

  const userId = user?.userId;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleCreate = async () => {
    if (!newText.trim()) return;
    setCreating(true);
    try {
      await api.post('/posts', { author: userId, text: newText.trim() });
      setNewText('');
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
    setCreating(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h2 className="text-3xl font-bold mb-6">Лента</h2>

      {loading ? (
        <Loader/>
      ) : (
        posts.map(post => <Post key={post._id} post={post} />)
      )}

      {userId && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl transition"
          aria-label="Новый пост"
        >
          <Pen className="w-6 h-6" />
        </button>
      )}

      {/* Модалка для создания поста */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Новый пост</h3>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              rows="4"
              placeholder="О чём вы думаете?"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {creating ? 'Публикуем...' : 'Опубликовать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
);
}
