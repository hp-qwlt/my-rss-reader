import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RSSFeed.css'; // Import CSS for styling

const targetUrl = 'https://a4c5-106-51-78-16.ngrok-free.app/rss-feed';

const RSSFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        const response = await fetch(targetUrl, {
          method: 'GET',
        });
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const parsedItems = Array.from(items).map(item => {
            const newItem = {
                title: item.querySelector('title').textContent,
                link: item.querySelector('link').textContent,
                pubDate: item.querySelector('pubDate').textContent,
                description: item.querySelector('description').textContent,
                content: item.querySelector('content\\:encoded, encoded').textContent, // Select 'content:encoded' with escaped colon
              };
              return newItem;
      });
        setFeedItems(parsedItems);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
      }
    };

    fetchRSSFeed();
  }, []);

  const handleReadMore = (content,title) => {
    navigate(`/post?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`);
  };

  return (
    <div className="rss-feed">
      <h1 className="rss-feed-title">RSS Feed</h1>
      {feedItems.length ? (
        <ul className="rss-feed-list">
          {feedItems.map((item, index) => 
          (
            <li key={index} className="rss-feed-item">
              <h2 className="rss-feed-item-title">{item.title}</h2>
              <p className="rss-feed-item-description">{item.description}</p>
              <p className="rss-feed-item-date">Date: {item.pubDate}</p>
              <button
                className="rss-feed-item-button"
                onClick={() => handleReadMore(item.content, item.title)}
              >
                Read more
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RSSFeed;
