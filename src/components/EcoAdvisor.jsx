import React, { useState, useEffect, useRef } from 'react';
import { queryEcoActions } from '../data/ecoActions';
import { Send, Sparkles, User, AlertCircle, Plus, Check } from 'lucide-react';

const SUGGESTIONS = [
  { text: 'How do I save electricity?', query: 'electricity energy led power' },
  { text: 'Tips for travel emissions', query: 'travel car commute flight bike' },
  { text: 'Reduce food footprint', query: 'diet meat veggie food waste seasonal' },
  { text: 'Low-waste buying ideas', query: 'consumption secondhand repair plastic tech' }
];

export default function EcoAdvisor({ ecoActions, loggedActions, onToggleAction }) {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Hello! I am your EcoPulse AI Advisor. Ask me anything about how to understand, track, or reduce your carbon footprint, or click one of the suggestions below!",
      actions: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInputText('');
    
    // Simulate AI thinking
    setIsTyping(true);
    
    setTimeout(() => {
      // 1. Search database via keyword semantic index
      const matchedActions = queryEcoActions(query);
      
      // 2. Generate contextual response text
      let responseText = '';
      if (matchedActions.length > 0) {
        responseText = `Based on your query, I found ${matchedActions.length} highly effective actions in our database. Implementing these will directly reduce your annual carbon footprint and save you energy costs. You can commit to these quests directly below:`;
      } else {
        // Fallback rule-based matching for general questions
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('electric') || lowerQuery.includes('power') || lowerQuery.includes('light') || lowerQuery.includes('ac')) {
          responseText = "To lower household energy emissions, focus on high-load equipment. Adjusting your AC to 24°C, cleaning the air filters regularly, and turning off phantom standby devices are free actions that yield immediate 5-10% cuts in carbon. Over the longer term, transitioning to LED lighting and installing rooftop solar panel systems can nearly erase your utility carbon output.";
        } else if (lowerQuery.includes('car') || lowerQuery.includes('commute') || lowerQuery.includes('travel') || lowerQuery.includes('flight')) {
          responseText = "Transport footprint is driven heavily by individual combustion vehicle mileage and aviation fuel. You can reduce this by carpooling just once a week, shifting short commutes (<2km) to walking or cycling, and choosing train travel or digital meetings over short-haul flights. Buying an Electric Vehicle (EV) can also lower lifetime travel emissions by over 60%.";
        } else if (lowerQuery.includes('meat') || lowerQuery.includes('diet') || lowerQuery.includes('food') || lowerQuery.includes('eat')) {
          responseText = "Dietary carbon is heavily loaded in red meat and dairy due to livestock enteric fermentation (methane). Shifting to a vegetarian or vegan diet is the single most powerful food choice. Alternatively, practicing 'Meatless Mondays' and eliminating kitchen food waste (which releases methane in landfills) are simple, high-impact starting blocks.";
        } else {
          responseText = "Reducing carbon comes down to simple, repeated changes: consuming mindfully, buying pre-owned products first, fixing devices rather than replacing them, reducing home heating/cooling, and adopting public transit where possible. Try checking our Quest Board or typing a more specific query like 'solar power' or 'vegan food'.";
        }
      }

      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: responseText,
        actions: matchedActions.slice(0, 3) // Show top 3 matched actions
      }]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="glass-panel" style={{ height: '620px', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
      
      {/* Advisor Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', color: 'var(--accent-indigo)' }}>
          <Sparkles size={20} className="pulse-glow" style={{ borderRadius: '50%' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>EcoPulse Smart Advisor</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            ● Active Semantic Advice Engine
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              gap: '0.8rem', 
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}
          >
            {/* Avatar */}
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: msg.sender === 'user' ? 'var(--accent-indigo)' : 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.8rem'
            }}>
              {msg.sender === 'user' ? <User size={14} /> : '🌱'}
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.85rem 1.1rem', 
                borderRadius: msg.sender === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', 
                background: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: '#f8fafc'
              }}>
                {msg.text}
              </div>

              {/* Render actions linked inside bubble */}
              {msg.actions && msg.actions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.2rem' }}>
                  {msg.actions.map(action => {
                    const isCommitted = loggedActions.includes(action.id);
                    return (
                      <div 
                        key={action.id}
                        className="glass-panel" 
                        style={{ 
                          background: 'rgba(16, 185, 129, 0.02)', 
                          border: isCommitted ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(255,255,255,0.05)',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{action.title}</span>
                            <span className={`badge badge-${action.difficulty}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{action.difficulty}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>-{action.carbonSavings} kg CO2e/year</p>
                        </div>
                        
                        <button 
                          onClick={() => onToggleAction(action)}
                          style={{
                            padding: '0.4rem',
                            borderRadius: '8px',
                            background: isCommitted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: isCommitted ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                            color: isCommitted ? 'var(--accent-mint)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isCommitted ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.8rem', paddingLeft: '8px' }}>🌱</div>
            <div style={{ padding: '0.6rem 1rem', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.3rem' }}>
              <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'float 1s infinite' }}></span>
              <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'float 1.2s infinite' }}></span>
              <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'float 1.4s infinite' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', marginBottom: '0.5rem' }}>
        {SUGGESTIONS.map((s, i) => (
          <button 
            key={i} 
            onClick={() => handleSend(s.query)}
            style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--border-color)', 
              padding: '0.4rem 0.8rem', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent-indigo)'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            {s.text}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem' }}
      >
        <input 
          type="text" 
          placeholder="Ask me: 'how to cut electric bills?' or 'tips on flying'..." 
          className="form-input" 
          style={{ flex: 1 }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="btn btn-indigo" style={{ padding: '0.8rem' }}>
          <Send size={18} />
        </button>
      </form>

    </div>
  );
}
