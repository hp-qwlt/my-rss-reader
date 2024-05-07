import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import './Post.css';
import { LikesContext } from './likesContext';
import { IoIosArrowBack } from 'react-icons/io';

const Post = () => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDate, setPostDate] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const { likesData } = useContext(LikesContext);
  const [likesCount, setLikesCount] = useState(0); // State for likes count
  const location = useLocation();
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  useEffect(() => {
    const parsePostContent = () => {
      const searchParams = new URLSearchParams(location.search);
      const content = searchParams.get('content');
      const title = searchParams.get('title');
      const date = searchParams.get('pubDate');
      const category = searchParams.get('category');
      const cleanedContent = content ? content.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>').replace(/(<br>\s*<\/(ul|p|li)>)/gi, '</$2>') : '';
      setPostDate(date || '');
      setPostCategory(category || '');
      setPostContent(cleanedContent || '');
      setPostTitle(title || '');
    };

    parsePostContent();
  }, [location]);

  useEffect(() => {
    if (likesData) {
      const postLikesData = likesData.find(like => like.title === postTitle);
      setLikesCount(postLikesData ? postLikesData.likesCount : 0);
    }
  }, [likesData, postTitle]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step
  };

  return (
    <div className="post-container">
      <div className="back-button" onClick={handleGoBack}>
        <IoIosArrowBack className="back-icon" style={{cursor:'pointer'}}/>
      </div>
      <h1 className="post-title">{parse(postTitle)}</h1>
      <div className="post-meta">
        <span className="author-name">Haripriya Sridharan</span> &bull;&nbsp;
        <span className="post-date">{parse(formatDate(postDate))}</span> 
        <hr/>
      </div>
      <div className="post-content">{parse(postContent)}</div>
      {likesCount ? (
        <span>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="2" viewBox="0 0 24 24" color="black" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ color: 'black', fill: 'white', stroke: 'red' }}>
            <path style={{display:'none'}} fill="none" d="M0 0h24v24H0z"></path>
            <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
          &nbsp;
          <span>{likesCount}</span>
        </span>
      ) : (
        <div id="heart">
          <img className="bottom" src="https://images.freeimages.com/image/previews/a7f/pink-love-heart-png-design-5692900.png" width="20px" />
        </div>
      )}
    </div>
  );
};

export default Post;
