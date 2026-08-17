import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertCircle, Trash2 } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function ConfidenceBar({ sentiment, confidence }) {
  const percentage = Math.round(confidence * 100);
  return (
    <div className="confidence-section">
      <div className="confidence-header">
        <span>Confidence</span>
        <span>{percentage}%</span>
      </div>
      <div className="confidence-bar-bg">
        <div 
          className={`confidence-bar-fill fill-${sentiment}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data);
    } catch (err) {
      showError("Couldn't load your recent analyses.");
    }
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const analyze = async (e) => {
    e.preventDefault();
    if (text.trim().length < 3) {
      showError("Add at least a few words to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/analyze`, { text });
      setResult(res.data);
      setText('');
      loadHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || "Analysis is temporarily unavailable.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/history`);
      setHistory([]);
      setResult(null);
    } catch (err) {
      showError("Couldn't clear history right now. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>SentimentInsight AI</h1>
        <div className="status-badge">
          <div className="dot" />
          GPT-5.4 LIVE ENGINE
        </div>
      </header>

      <main className="main-content">
        <section className="panel">
          <h2>Analyze Text</h2>
          <form onSubmit={analyze}>
            <textarea
              className="input-area"
              placeholder="Paste a review or comment here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={4000}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn" 
              disabled={loading || text.trim().length < 3}
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Reading...</>
              ) : (
                'Analyze Signal'
              )}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>Result</h2>
          {result ? (
            <div className="result-display">
              <div className={`sentiment-label sentiment-${result.sentiment}`}>
                {result.sentiment}
              </div>
              <ConfidenceBar sentiment={result.sentiment} confidence={result.confidence} />
              <div className="analyzed-text">
                "{result.text}"
              </div>
            </div>
          ) : (
            <div className="result-empty">
              Your result will appear here.
            </div>
          )}
        </section>
      </main>

      <section className="history-section panel">
        <div className="history-header">
          <h2>Recent Analyses</h2>
          <button 
            onClick={clearHistory}
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
            disabled={history.length === 0}
          >
            <Trash2 size={16} /> Clear History
          </button>
        </div>
        
        {history.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sentiment</th>
                  <th>Confidence</th>
                  <th>Text</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge badge-${item.sentiment}`}>
                        {item.sentiment}
                      </span>
                    </td>
                    <td>{Math.round(item.confidence * 100)}%</td>
                    <td className="history-text" title={item.text}>{item.text}</td>
                    <td>{new Date(item.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="result-empty" style={{ padding: '1rem 0' }}>
            No recent analyses found.
          </div>
        )}
      </section>

      {error && (
        <div className="error-toast" role="alert">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
