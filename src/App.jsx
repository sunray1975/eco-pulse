import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ActionTracker from './components/ActionTracker';
import Simulator from './components/Simulator';
import EcoAdvisor from './components/EcoAdvisor';
import { calculateFootprint } from './data/carbonModel';
import { ECO_ACTIONS } from './data/ecoActions';
import { computeActiveFootprint } from './data/footprintUtils';
import { clearEcoPulseProfile, readStoredProfile, saveActionProgress, saveNewProfile } from './data/storage';
import { getLevel } from './data/levels';
import { Leaf, LayoutDashboard, Calendar, Compass, MessageSquare, RotateCcw, Award } from 'lucide-react';

export const emptyFootprint = { home: 0, travel: 0, diet: 0, consumption: 0, total: 0 };

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [baselineFootprint, setBaselineFootprint] = useState(emptyFootprint);
  const [activeFootprint, setActiveFootprint] = useState(emptyFootprint);
  const [loggedActions, setLoggedActions] = useState([]);
  const [userPoints, setPoints] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');

  // Load state from localStorage on mount
  useEffect(() => {
    const storedProfile = readStoredProfile();

    if (storedProfile) {
      setProfile(storedProfile.profile);
      setLoggedActions(storedProfile.actions);
      setPoints(storedProfile.points);
      setIsOnboarded(true);

      const base = calculateFootprint(storedProfile.profile);
      setBaselineFootprint(base);
      const active = computeActiveFootprint(base, storedProfile.actions);
      setActiveFootprint(active);
    }
  }, []);

  // Complete onboarding
  const handleCompleteOnboarding = (newProfile) => {
    setProfile(newProfile);
    setIsOnboarded(true);
    setLoggedActions([]);
    setPoints(0);
    
    const base = calculateFootprint(newProfile);
    setBaselineFootprint(base);
    setActiveFootprint(base);

    saveNewProfile(newProfile);
  };

  // Toggle Commit/Opt-out action
  const handleToggleAction = (action) => {
    let updatedActions;
    let updatedPoints = userPoints;

    if (loggedActions.includes(action.id)) {
      // Opt out
      updatedActions = loggedActions.filter(id => id !== action.id);
      updatedPoints = Math.max(0, userPoints - action.points);
    } else {
      // Commit
      updatedActions = [...loggedActions, action.id];
      updatedPoints = userPoints + action.points;
    }

    setLoggedActions(updatedActions);
    setPoints(updatedPoints);
    
    // Recalculate active footprint
    const active = computeActiveFootprint(baselineFootprint, updatedActions);
    setActiveFootprint(active);

    saveActionProgress(updatedActions, updatedPoints);
  };

  // Reset Profile
  const handleResetProfile = () => {
    if (window.confirm("Are you sure you want to reset your EcoPulse profile? This will clear all onboarding metrics and points.")) {
      clearEcoPulseProfile();
      setIsOnboarded(false);
      setProfile(null);
      setLoggedActions([]);
      setPoints(0);
      setBaselineFootprint(emptyFootprint);
      setActiveFootprint(emptyFootprint);
      setCurrentView('dashboard');
    }
  };

  const level = getLevel(userPoints);

  if (!isOnboarded) {
    return (
      <div style={{ padding: '2rem 1rem' }}>
        <Onboarding onComplete={handleCompleteOnboarding} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      
      {/* Header HUD */}
      <header className="glass-panel" style={{ 
        margin: '1.5rem', 
        marginBottom: '1rem',
        borderRadius: '16px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-mint)' }}>
            <Leaf size={24} className="pulse-glow" style={{ borderRadius: '50%' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, var(--accent-mint))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EcoPulse
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Smart Carbon Intelligence
            </p>
          </div>
        </div>

        {/* Global Level Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
          <Award size={18} style={{ color: 'var(--accent-gold)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {level.label}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>|</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-mint)' }}>
            {userPoints} XP
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" type="button" onClick={handleResetProfile} aria-label="Reset EcoPulse profile" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RotateCcw size={14} /> Reset Profile
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <nav aria-label="Primary views" style={{ paddingInline: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="tabs-container" role="tablist" aria-label="EcoPulse sections" style={{ width: '100%', justifyContent: 'space-around', padding: '0.4rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'tracker', label: 'Quest Ledger', icon: <Compass size={18} /> },
            { id: 'simulator', label: 'Projections Sandbox', icon: <Calendar size={18} /> },
            { id: 'advisor', label: 'AI Advisor', icon: <MessageSquare size={18} /> }
          ].map(view => (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={currentView === view.id}
              aria-controls={`${view.id}-panel`}
              className={`tab-btn ${currentView === view.id ? 'active' : ''}`}
              onClick={() => setCurrentView(view.id)}
              style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
            >
              {view.icon} {view.label}
            </button>
          ))}
        </div>
      </nav>

      {/* View Rendering */}
      <main id="main-content" style={{ flex: 1, paddingInline: '1.5rem', paddingBottom: '2.5rem' }}>
        <div className="fade-in" id={`${currentView}-panel`} role="tabpanel" tabIndex="-1">
          {currentView === 'dashboard' && (
            <Dashboard 
              baselineFootprint={baselineFootprint}
              activeFootprint={activeFootprint}
            />
          )}

          {currentView === 'tracker' && (
            <ActionTracker 
              ecoActions={ECO_ACTIONS}
              loggedActions={loggedActions}
              onToggleAction={handleToggleAction}
              userPoints={userPoints}
            />
          )}

          {currentView === 'simulator' && (
            <Simulator 
              activeFootprint={activeFootprint}
              profile={profile}
            />
          )}

          {currentView === 'advisor' && (
            <EcoAdvisor 
              ecoActions={ECO_ACTIONS}
              loggedActions={loggedActions}
              onToggleAction={handleToggleAction}
            />
          )}
        </div>
      </main>

    </div>
  );
}
