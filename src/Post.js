import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import parse from 'html-react-parser'; // Import parse function to parse HTML content
import './Post.css'; // Import CSS for styling

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
      const postDate = searchParams.get('pubDate');
      const postCategory = searchParams.get('category');
      setPostDate(postDate || '');
      setPostCategory(postCategory || '');
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

  const renderGallery = (content) => {
    const contentStr = content.toString(); // Convert content to a string

    // Split the content into separate images and titles
    const images = contentStr.match(/<img[^>]+>/g) || [];

    // Check if there are more than four images in a row
    if (images.length > 3) {
      const galleryItems = [];
      let imageCount = 0;
      let galleryRow = [];

      // Group images into rows of four
      images.forEach((image, index) => {
        galleryRow.push(parse(image));
        imageCount++;

        // If four images are added to the row or it's the last image, add the row to galleryItems
        if (imageCount === 2 || index === images.length - 1) {
          galleryItems.push(
            <div key={index} className="gallery-row">
              {galleryRow.map((item, idx) => (
                <div key={idx} className="gallery-item">{item}</div>
              ))}
            </div>
          );
          galleryRow = [];
          imageCount = 0;
        }
      });

      return (
        <div className="gallery">{galleryItems}</div>
      );
    } else {
      // Render images without gallery
      return parse(content); // Parse content as usual
    }
  };

  return (
    <div className="post-container">
      <h1 className="post-title">{parse(postTitle)}</h1>
      <p className="post-date">
        {parse(formatDate(postDate))}
        {postCategory && (
          <>
            {' | '}
            {parse(postCategory)}
          </>
        )}
      </p>
      <div className="post-content">
        {renderGallery(postContent)}
      </div>
    </div>
  );
};

export default Post;
