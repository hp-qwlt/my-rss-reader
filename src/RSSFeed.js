import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLoader2Line } from 'react-icons/ri'; // Import loader icon
import './RSSFeed.css'; // Import CSS for styling
import { MdHome } from 'react-icons/md'; // Import Material Design home icon

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
          enclosure: item.querySelector('enclosure') ? item.querySelector('enclosure').getAttribute('url') : null,
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

  const handleImageLoad = (index) => {
    const updatedFeedItems = [...feedItems];
    updatedFeedItems[index].imageLoading = false;
    setFeedItems(updatedFeedItems);
  };

  return (
    <div className="rss-feed">
      {/* Navigation Menu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: '#fff' }}>
        <nav className="rss-nav">
          <a href="https://haripriya.org" className="nav-home"><MdHome color= '#35495E' size='3em' /></a>
        </nav>
        <h1 className="rss-feed-title" style={{ flexGrow: 1, textAlign: 'center' }}>Posts</h1>
        <div style={{ width: '50px' }}> {/* Placeholder to balance the layout */}</div>
      </div>
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
                  <>
                    {item.imageLoading && <RiLoader2Line className="loader-icon" />}
                    <img
                      src={item.enclosure}
                      alt="Enclosure"
                      className={`enclosure-image ${item.imageLoading ? 'hide' : ''}`}
                      onLoad={() => handleImageLoad(index)}
                      onClick={() => handleReadMore(item.content, item.title, item.pubDate, item.category)}
                    />
                  </>
                )}
              </div>
              <div className="rss-feed-item-content">
                <h2 className="rss-feed-item-title" onClick={() => handleReadMore(item.content, item.title, item.pubDate, item.category)}>{item.title}</h2>
                <p className="rss-feed-item-description">{item.description}</p>
                <p className="rss-feed-item-date">Date: {new Date(item.pubDate).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RSSFeed;
