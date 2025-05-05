import { useEffect, useState } from 'react';
import { useParams }       from 'react-router-dom';
import { Heart, Bookmark, MessageSquare } from 'lucide-react';
import api                from '../api';

export default function PostPage() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.userId;

  const [post, setPost]         = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [newComment, setNewComment] = useState('');

  const fetchPost = async () => {
    const { data } = await api.get(`/posts/${id}`);
    setPost(data.post);
    setComments(data.comments);
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const toggleLike = async () => {
    const { data } = await api.post(`/posts/${id}/like`, { userId });
    setPost(prev => ({ ...prev, likesCount: data.likesCount }));
  };
  const toggleFav = async () => {
    const { data } = await api.post(`/posts/${id}/favorite`, { userId });
    setPost(prev => ({ ...prev, favoritesCount: data.favoritesCount }));
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const { data } = await api.post(`/posts/${id}/comments`, { userId, text: newComment });
    setComments(prev => [data, ...prev]);
    setNewComment('');
  };

  const toggleCommentLike = async commentId => {
    const { data } = await api.post(`/posts/comments/${commentId}/like`, { userId });
    setComments(prev =>
      prev
        .map(c => c._id === commentId ? { ...c, likesCount: data.likesCount } : c)
        .sort((a, b) => b.likesCount - a.likesCount)
    );
  };

  if (loading) return <div className="text-center mt-12">Загрузка...</div>;
  if (!post)   return <div className="text-center mt-12 text-red-500">Пост не найден</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {post.author.username[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-800">
              {post.author.fullname}{' '}
              <span className="text-gray-500 text-sm">@{post.author.username}</span>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.text}</p>
        <div className="flex space-x-6">
          <button onClick={toggleLike} className="flex items-center space-x-1">
            <Heart className="w-5 h-5 text-red-500" />
            <span>{post.likesCount}</span>
          </button>
          <button onClick={toggleFav} className="flex items-center space-x-1">
            <Bookmark className="w-5 h-5 text-yellow-500" />
            <span>{post.favoritesCount}</span>
          </button>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Форма нового комментария */}
      <div className="mb-6">
        <textarea
          rows="2"
          className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Добавить комментарий..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button
          onClick={addComment}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Комментировать
        </button>
      </div>

      {/* Список комментариев (отсортированы по лайкам) */}
      <h3 className="text-xl font-semibold mb-4">Комментарии</h3>
      {comments.length === 0
        ? <div className="text-gray-500">Нет комментариев.</div>
        : comments.map(c => (
            <div key={c._id} className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    {c.author.username[0].toUpperCase()}
                  </div>
                  <span className="font-semibold">{c.author.username}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{c.text}</p>
              <button
                onClick={() => toggleCommentLike(c._id)}
                className="flex items-center space-x-1 text-sm"
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span>{c.likesCount}</span>
              </button>
            </div>
          ))
      }
    </div>
);
}
