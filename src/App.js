import React from 'react';
import './App.css';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="App">
      <h1 style={{
        textAlign: 'center',
        margin: '20px 0 30px',
        background: 'linear-gradient(135deg, #6C63FF, #9D4EFF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2.2em',
        fontWeight: '700',
        letterSpacing: '-0.5px',
        padding: '10px 0',
        textShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>NaraBot - Asisten Virtual Siap Bantu</h1>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(80vh - 60px)',
        padding: '20px'
      }}>
        <Chatbot />
      </div>
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#666',
        fontSize: '0.9em',
        marginTop: 'auto',
        borderTop: '1px solid #eee'
      }}>
        © {new Date().getFullYear()} narabot - Nabilah Shafa Nur Sofyani
      </footer>
    </div>
  );
}

export default App;
