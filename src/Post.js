import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import './Post.css';
import { useLikes } from './likesContext';
import { IoIosArrowBack } from 'react-icons/io';

const Post = () => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDate, setPostDate] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const { likesData, updateLikesData } = useLikes();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const content = params.get('content');
    const title = params.get('title');
    const date = params.get('pubDate');
    const category = params.get('category');

    const cleanedContent = content ? content.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>').replace(/(<br>\s*<\/(ul|p|li)>)/gi, '</$2>') : '';
    
    setPostDate(date || '');
    setPostCategory(category || '');
    setPostContent(cleanedContent || '');
    setPostTitle(title || '');

    // Update likes count and liked status based on fetched likes data
    const postLikesData = likesData.find(like => like.title === title);
    if (postLikesData) {
      setLikesCount(postLikesData.likesCount);
      setIsLiked(postLikesData.isLiked);
    } else {
      setLikesCount(0);
      setIsLiked(false);
    }
  }, [location, likesData]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLikeToggle = async () => {
    const newIsLiked = !isLiked;
    const updatedLikesCount = newIsLiked ? parseInt(likesCount) + 1 : parseInt(likesCount) - 1;

    try {
      const response = await fetch('https://api.haripriya.org/update-likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: postTitle, likesCount: updatedLikesCount.toString() })
      });
      const data = await response.json();
      if (response.ok) {
        updateLikesData(likesData.map(like => like.title === postTitle ? { ...like, likesCount: updatedLikesCount, isLiked: newIsLiked } : like));
        setIsLiked(newIsLiked);
        setLikesCount(updatedLikesCount);
      } else {
        throw new Error(data.message || 'Failed to update the like status on the server.');
      }
    } catch (error) {
      console.error('Failed to update likes:', error);
      // No need to revert isLiked or likesCount since they weren't changed yet
    }
  };

  return (
    <div className="post-container">
      <div className="back-button" onClick={handleGoBack}>
        <IoIosArrowBack className="back-icon" style={{ cursor: 'pointer' }} />
      </div>
      <h1 className="post-title">{parse(postTitle)}</h1>
      <div className="post-meta">
        <span className="author-name">Haripriya Sridharan</span> &bull;
        <span className="post-date">{parse(new Date(postDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))}</span>
        <hr />
      </div>
      <div className="post-content">{parse(postContent)}</div>
      <span onClick={handleLikeToggle} style={{ cursor: 'pointer' }}>
        <svg stroke="currentColor" fill="currentColor" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" style={{ color: 'black', fill: isLiked ? 'red' : 'none', stroke: isLiked ? 'none' : 'red' }}>
          <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
        &nbsp;{likesCount}
      </span>
    </div>
  );
};

export default Post;
