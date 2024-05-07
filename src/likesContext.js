import React, { createContext, useState, useEffect } from 'react';

export const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [likesData, setLikesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikesData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.haripriya.org/scrape');
        const data = await response.json();
        setLikesData(data);
      } catch (error) {
        console.error('Error fetching likes data:', error);
      }
      setIsLoading(false);
    };

    fetchLikesData();
  }, []);

  return (
    <LikesContext.Provider value={{ likesData, isLoading }}>
      {children}
    </LikesContext.Provider>
  );
};
