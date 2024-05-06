import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import './Post.css';

const Post = () => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDate, setPostDate] = useState('');
  const [postCategory, setPostCategory] = useState('');

  const location = useLocation();

  useEffect(() => {
    const parsePostContent = () => {
      const searchParams = new URLSearchParams(location.search);
      const content = searchParams.get('content');
      const title = searchParams.get('title');
      const date = searchParams.get('pubDate');
      const category = searchParams.get('category');
      setPostDate(date || '');
      setPostCategory(category || '');
      setPostContent(content || '');
      setPostTitle(title || '');
    };

    parsePostContent();
  }, [location]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="post-container">
      <h1 className="post-title">{parse(postTitle)}</h1>
      <div className="post-meta">
        <span className="author-name">Haripriya Sridharan</span> &bull;
        <span className="post-date">{parse(formatDate(postDate))}</span>
      </div>
      <div className="post-content">{parse(postContent)}</div>
    </div>
  );
};

export default Post;
