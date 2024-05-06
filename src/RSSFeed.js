import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RSSFeed.css'; // Import CSS for styling

const targetUrl = 'https://a4c5-106-51-78-16.ngrok-free.app/rss-feed';

const RSSFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredFeedItems, setFilteredFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const parsedItems = Array.from(items).map(item => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
          pubDate: item.querySelector('pubDate').textContent,
          description: item.querySelector('description').textContent,
          category: item.querySelector('category') ? item.querySelector('category').textContent : '',
          content: item.querySelector('content\\:encoded, encoded').textContent,
          enclosure: item.querySelector('enclosure') ? item.querySelector('enclosure').getAttribute('url') : null
        }));
        setFeedItems(parsedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
        setLoading(false);
      }
    };
    fetchRSSFeed();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filteredItems = feedItems.filter(item => item.category === selectedCategory);
      setFilteredFeedItems(filteredItems);
    } else {
      setFilteredFeedItems(feedItems);
    }
  }, [selectedCategory, feedItems]);

  const handleReadMore = (content, title, pubDate, category) => {
    navigate(`/post?pubDate=${encodeURIComponent(pubDate)}&category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`);
  };

  return (
    <div className="rss-feed">
      <h1 className="rss-feed-title">Posts</h1>
      <div className="category-dropdown">
        <label htmlFor="category">Category</label>
        <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All</option>
          {[...new Set(feedItems.map(item => item.category))].map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <ul className="rss-feed-list">
          {filteredFeedItems.map((item, index) => (
            <li key={index} className="rss-feed-item">
              <div className="rss-feed-item-image">
                {item.enclosure && (
                  <img src={item.enclosure} alt="Enclosure" className="enclosure-image" onClick={() => handleReadMore(item.content, item.title, item.pubDate, item.category)}/>
                )}
              </div>
              <div className="rss-feed-item-content">
              <h2 className="rss-feed-item-title" onClick={() => handleReadMore(item.content, item.title, item.pubDate, item.category)}>{item.title}</h2>
                <p className="rss-feed-item-description">{item.description}</p>
                <p className="rss-feed-item-date">Date: {new Date(item.pubDate).toLocaleDateString()}</p>
                {/* <button className="rss-feed-item-button" onClick={() => handleReadMore(item.content, item.title, item.pubDate, item.category)}>
                  Read more
                </button> */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RSSFeed;
