import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import parse from 'html-react-parser'; // Import parse function to parse HTML content
import './Post.css'; // Import CSS for styling

const Post = () => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const location = useLocation();

  useEffect(() => {
    const parsePostContent = () => {
      const searchParams = new URLSearchParams(location.search);
      const content = searchParams.get('content');
      const title = searchParams.get('title');
      setPostContent(content || '');
      setPostTitle(title || '');
    };

    parsePostContent();
  }, [location]);

  return (
    <div className="post-container">
      <h1 className="post-title">{parse(postTitle)}</h1>
      <div className="post-content">{parse(postContent)}</div> {/* Parse and render the post content */}
    </div>
  );
};

export default Post;
