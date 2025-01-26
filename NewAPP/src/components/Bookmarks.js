// src/components/Bookmarks.js
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';

function Bookmarks() {
  const { user } = useAuthContext();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`/bookmarks?user_id=${user}`);
        const data = await response.json();
        setBookmarks(data.bookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      const response = await fetch(`/bookmark/${bookmarkId}?user_id=${user}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      console.log(data.message);

      // Update bookmarks state
      setBookmarks(bookmarks.filter(bookmark => bookmark !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <div className="bookmarks">
      <h1>Bookmarks</h1>
      {bookmarks.length > 0 ? (
        <ul>
          {bookmarks.map((bookmark, index) => (
            <li key={index}>
              <p>{bookmark}</p>
              <button onClick={() => handleDeleteBookmark(bookmark)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no bookmarks yet.</p>
      )}
    </div>
  );
}

export default Bookmarks;