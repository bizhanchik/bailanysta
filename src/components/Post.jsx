
import React from 'react';
import { Link } from 'react-router-dom';

export default function Post({ post }) {
  return (
    <Link to={`/post/${post._id}`} className="block">
      <div className="bg-white p-6 rounded-lg shadow mb-6 hover:bg-gray-50 transition">
        <div className="flex items-center mb-3">
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
        {/* Текст */}
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.text}</p>
        {/* Метки */}
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>👍 {post.likesCount}</span>
          <span>⭐ {post.favoritesCount}</span>
        </div>
      </div>
    </Link>
  );
}
