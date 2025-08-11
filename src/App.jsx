import React, { useState } from 'react';
import './App.css';

function App() {
  const [prUrl, setPrUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Enter GitHub PR URL"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          className="pr-input"
        />
        <button type="submit" className="submit-btn">Submit</button>
      </form>
      <div className="result-area">
        {result}
      </div>
    </div>
  );
}

export default App;