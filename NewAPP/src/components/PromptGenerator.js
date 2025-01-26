// src/components/PromptGenerator.js
import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';

function PromptGenerator() {
  const { user } = useAuthContext();
  const [category, setCategory] = useState('Writing');
  const [complexity, setComplexity] = useState('Easy');
  const [style, setStyle] = useState('Descriptive');
  const [prompt, setPrompt] = useState('');

  const handleGeneratePrompt = async () => {
    try {
      const response = await fetch('/generate_prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category,
          complexity,
          style
        })
      });

      const data = await response.json();
      setPrompt(data.prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

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
    <div className="prompt-generator">
      <h1>Creative AI Prompts Generator</h1>
      <div className="options">
        <label htmlFor="category">Category:</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Writing">Writing</option>
          <option value="Art">Art</option>
          <option value="Business Ideas">Business Ideas</option>
          <option value="Personal Projects">Personal Projects</option>
        </select>

        <label htmlFor="complexity">Complexity:</label>
        <select id="complexity" value={complexity} onChange={(e) => setComplexity(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <label htmlFor="style">Style:</label>
        <select id="style" value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="Descriptive">Descriptive</option>
          <option value="Intriguing">Intriguing</option>
          <option value="Surreal">Surreal</option>
          <option value="Humorous">Humorous</option>
        </select>
      </div>

      <button onClick={handleGeneratePrompt}>Generate Prompt</button>

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

export default PromptGenerator;