import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLoader2Line } from 'react-icons/ri'; // Import loader icon
import { MdHome, MdFavorite } from 'react-icons/md'; // Import Material Design home and favorite icons
import './RSSFeed.css'; // Import CSS for styling

const targetUrl = 'http://localhost:3001/rss-feed';
const targetUrlScrape = 'http://localhost:3001/scrape';

const RSSFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredFeedItems, setFilteredFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likesLoading, setLikesLoading] = useState(true);
  const [likedItems, setLikedItems] = useState([]); // State to keep track of liked items
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const rssItems = Array.from(items).map(item => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
          pubDate: item.querySelector('pubDate').textContent,
          description: item.querySelector('description').textContent,
          category: item.querySelector('category') ? item.querySelector('category').textContent : '',
          content: item.querySelector('content\\:encoded, encoded').textContent,
          enclosure: item.querySelector('enclosure') ? item.querySelector('enclosure').getAttribute('url') : null,
        }));

        setFeedItems(rssItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        const response = await fetch(targetUrlScrape);
        const data = await response.json();
        setLikesData(data);
        setLikesLoading(false);
      } catch (error) {
        console.error('Error fetching likes data:', error);
        setLikesLoading(false);
      }
    };
    fetchLikesData();
  }, []);

  const handleReadMore = (content, title, pubDate, category,likesCount) => {
    navigate(`/post?likesCount=${encodeURIComponent(likesCount)}&pubDate=${encodeURIComponent(pubDate)}&category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`);
  };
  
  const handleImageLoad = (index) => {
    const updatedFeedItems = [...feedItems];
    updatedFeedItems[index].imageLoading = false;
    setFeedItems(updatedFeedItems);
  };

  const handleLikeToggle = (title) => {
    setLikedItems(prevLikedItems => {
      if (prevLikedItems.includes(title)) {
        return prevLikedItems.filter(item => item !== title);
      } else {
        return [...prevLikedItems, title];
      }
    });
  };

  return (
    <div className="rss-feed">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: '#fff' }}>
        <nav className="rss-nav">
          <a href="https://haripriya.org" className="nav-home"><MdHome color= '#35495E' size='3em' /></a>
        </nav>
        <h1 className="rss-feed-title">Posts</h1>
        <div style={{ width: '50px' }}></div> {/* Placeholder for balance */}
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
        <div className="loader"><RiLoader2Line /></div>
      ) : (
        <ul className="rss-feed-list">
          {filteredFeedItems.map((item, index) => (
            <li key={index} className="rss-feed-item">
              <div className="rss-feed-item-image">
                {item.enclosure && (
                  <>
                    <img
                      src={item.enclosure}
                      alt="Enclosure"
                      className={`enclosure-image ${item.imageLoading ? 'hide' : ''}`}
                      onLoad={() => handleImageLoad(index)}
                      onClick={() => {
                        const postLikesData = likesData.find(like => like.title === item.title);
                        const likesCount = postLikesData ? postLikesData.likesCount : 0;
                        handleReadMore(item.content, item.title, item.pubDate, item.category, likesCount)}
                      }
                    />
                  </>
                )}
              </div>
              <div className="rss-feed-item-content">
                <h2 className="rss-feed-item-title" onClick={() => {
                  const postLikesData = likesData.find(like => like.title === item.title);
                  const likesCount = postLikesData ? postLikesData.likesCount : 0;
                  handleReadMore(item.content, item.title, item.pubDate, item.category, likesCount)}
                }>{item.title}</h2>
                <p className="rss-feed-item-description">{item.description}</p>
                <p className="rss-feed-item-date">Date: {new Date(item.pubDate).toLocaleDateString()}</p>
                <span onClick={() => handleLikeToggle(item.title)}>
                <span className="favorite-icon">
                  
                  {likesData.find(like => like.title === item.title) ? (
                    <span>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="2" viewBox="0 0 24 24" color="black" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ color: 'black', fill: likedItems.includes(item.title) ? 'red' : 'white', stroke: likedItems.includes(item.title) ? 'none' : 'red' }}>
                      <path style={{display:'none'}} fill="none" d="M0 0h24v24H0z"></path>
                      <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                     </svg>
                     &nbsp;
                    <span>{likesData.find(like => like.title === item.title).likesCount}</span>
                    </span>
                  ) : (
                    <div id="heart">
                                          <img class="bottom" src="https://images.freeimages.com/image/previews/a7f/pink-love-heart-png-design-5692900.png" width="20px" />
                    </div>
                  )}
                </span>
              </span>

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RSSFeed;
