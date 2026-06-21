import React, { useState } from 'react';
import { Award, Flame, Plus } from 'lucide-react';
import { getLevel } from '../data/levels';

export default function ActionTracker({ ecoActions, loggedActions, onToggleAction, userPoints }) {
  const [activeTab, setActiveTab] = useState('all');

  const levelInfo = getLevel(userPoints);
  const neededLvlXP = levelInfo.xpMax - levelInfo.xpMin;

  // Badge list and unlock calculations
  const badges = [
    {
      id: 'energy_saver',
      name: 'Grid Saver',
      desc: 'Unlock by completing 2 Home Energy actions.',
      icon: '⚡',
      unlocked: loggedActions.filter(id => ecoActions.find(a => a.id === id)?.category === 'home').length >= 2
    },
    {
      id: 'eco_commuter',
      name: 'Eco Commuter',
      desc: 'Unlock by completing 2 Transport actions.',
      icon: '🚴',
      unlocked: loggedActions.filter(id => ecoActions.find(a => a.id === id)?.category === 'travel').length >= 2
    },
    {
      id: 'plant_based',
      name: 'Herbivore Pioneer',
      desc: 'Unlock by committing to plant-based or meatless actions.',
      icon: '🥗',
      unlocked: loggedActions.includes('meatless_monday') || loggedActions.includes('plant_based_diet')
    },
    {
      id: 'zero_waste',
      name: 'Zero Waste Master',
      desc: 'Unlock by committing to secondhand or repair actions.',
      icon: '♻️',
      unlocked: loggedActions.includes('buy_secondhand') || loggedActions.includes('repair_appliances')
    }
  ];

  // Filter actions based on category tab
  const filteredActions = ecoActions.filter(action => {
    if (activeTab === 'all') return true;
    return action.category === activeTab;
  });

  return (
    <div className="dashboard-grid">
      
      {/* LEFT COLUMN: Gamification HUD (Level, XP, Badges) */}
      <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* User Level Card */}
        <div className="glass-panel glass-panel-glow-indigo" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Level</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{levelInfo.shortName}</h3>
            </div>
            <div style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%', 
              background: 'rgba(99, 102, 241, 0.1)', 
              color: 'var(--accent-indigo)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              Lvl {levelInfo.lvl}
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>{levelInfo.currentLevelXp} / {neededLvlXP} XP</span>
            <span>XP to Next Level: {levelInfo.xpToNext}</span>
          </div>

          <div className="progress-bar-container" style={{ marginBottom: '1rem', height: '8px' }}>
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${levelInfo.xpPercent}%`, 
                background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-purple))'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>
            <Flame size={14} style={{ color: 'var(--accent-gold)' }} />
            <span>Total Eco Points: <strong>{userPoints} XP</strong></span>
          </div>
        </div>

        {/* Badges Panel */}
        <div className="glass-panel">
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: 'var(--accent-gold)' }} /> Sustainability Badges
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  opacity: badge.unlocked ? 1 : 0.45,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  background: badge.unlocked ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.03)', 
                  border: badge.unlocked ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: badge.unlocked ? 'var(--glow-gold)' : 'none',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.8rem'
                }}>
                  {badge.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: badge.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {badge.name}
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Quest Board and Active Quests */}
      <div className="col-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Quest Filters & Header */}
        <div className="glass-panel" style={{ paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>Eco Quest Board</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Commit to actions and shrink your active carbon footprint.</p>
            </div>
            
            <div className="tabs-container" role="tablist" aria-label="Filter eco actions by category">
              {[
                { id: 'all', label: 'All' },
                { id: 'home', label: 'Home' },
                { id: 'travel', label: 'Travel' },
                { id: 'diet', label: 'Diet' },
                { id: 'consumption', label: 'Lifestyle' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action List Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {filteredActions.map((action) => {
              const isCommitted = loggedActions.includes(action.id);
              
              return (
                <div 
                  key={action.id}
                  className="glass-panel"
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    padding: '1.25rem',
                    background: isCommitted ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-glass)',
                    borderColor: isCommitted ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-color)',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{action.title}</h4>
                      <span className={`badge badge-${action.difficulty}`}>{action.difficulty}</span>
                      <span className={`badge badge-${action.cost}`}>{action.cost} cost</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      {action.description}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
                        -{action.carbonSavings} kg CO2e/year
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 600 }}>
                        +{action.points} XP Points
                      </span>
                    </div>
                  </div>

                  <div>
                    <button 
                      type="button"
                      className={`btn ${isCommitted ? 'btn-danger' : 'btn-primary'}`}
                      aria-pressed={isCommitted}
                      aria-label={`${isCommitted ? 'Opt out of' : 'Commit to'} ${action.title}`}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: '110px' }}
                      onClick={() => onToggleAction(action)}
                    >
                      {isCommitted ? (
                        <>Opt Out</>
                      ) : (
                        <>Commit <Plus size={14} /></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredActions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No sustainability actions found in this category.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
