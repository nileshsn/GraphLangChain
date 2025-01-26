// src/components/DailyChallenge.js
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';

function DailyChallenge() {
  const { user } = useAuthContext();
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch('/daily_challenge');
        const data = await response.json();
        setPrompt(data.prompt);
      } catch (error) {
        console.error('Error fetching daily challenge:', error);
      }
    };

    fetchChallenge();
  }, []);

  const handleBookmarkPrompt = async () => {
    try {
      const response = await fetch('/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          user_id: user
        })
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error bookmarking prompt:', error);
    }
  };

  return (
    <div className="daily-challenge">
      <h1>Daily Challenge</h1>
      {prompt && (
        <div className="prompt">
          <h2>Prompt:</h2>
          <p>{prompt}</p>
          <button onClick={handleBookmarkPrompt}>Bookmark</button>
        </div>
      )}
    </div>
  );
}

export default DailyChallenge;