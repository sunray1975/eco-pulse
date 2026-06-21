import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ActionTracker from './components/ActionTracker';
import Simulator from './components/Simulator';
import EcoAdvisor from './components/EcoAdvisor';
import { calculateFootprint } from './data/carbonModel';
import { ECO_ACTIONS } from './data/ecoActions';
import { Leaf, LayoutDashboard, Calendar, Compass, MessageSquare, RotateCcw, Award } from 'lucide-react';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [baselineFootprint, setBaselineFootprint] = useState({ home: 0, travel: 0, diet: 0, consumption: 0, total: 0 });
  const [activeFootprint, setActiveFootprint] = useState({ home: 0, travel: 0, diet: 0, consumption: 0, total: 0 });
  const [loggedActions, setLoggedActions] = useState([]);
  const [userPoints, setPoints] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');

  // Load state from localStorage on mount
  useEffect(() => {
    const savedOnboarded = localStorage.getItem('ecopulse_onboarded');
    const savedProfile = localStorage.getItem('ecopulse_profile');
    const savedActions = localStorage.getItem('ecopulse_logged_actions');
    const savedPoints = localStorage.getItem('ecopulse_points');

    if (savedOnboarded === 'true' && savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      const parsedActions = savedActions ? JSON.parse(savedActions) : [];
      const parsedPoints = savedPoints ? parseInt(savedPoints) : 0;

      setProfile(parsedProfile);
      setLoggedActions(parsedActions);
      setPoints(parsedPoints);
      setIsOnboarded(true);

      // Compute baseline
      const base = calculateFootprint(parsedProfile);
      setBaselineFootprint(base);

      // Compute active footprint subtracting savings from committed actions
      const active = computeActiveFootprint(base, parsedActions);
      setActiveFootprint(active);
    }
  }, []);

  // Compute active footprint based on committed actions
  const computeActiveFootprint = (base, actionsList) => {
    let homeRed = 0;
    let travelRed = 0;
    let dietRed = 0;
    let consumptionRed = 0;

    actionsList.forEach(actionId => {
      const action = ECO_ACTIONS.find(a => a.id === actionId);
      if (action) {
        if (action.category === 'home') homeRed += action.carbonSavings;
        if (action.category === 'travel') travelRed += action.carbonSavings;
        if (action.category === 'diet') dietRed += action.carbonSavings;
        if (action.category === 'consumption') consumptionRed += action.carbonSavings;
      }
    });

    const home = Math.max(0, base.home - homeRed);
    const travel = Math.max(0, base.travel - travelRed);
    const diet = Math.max(0, base.diet - dietRed);
    const consumption = Math.max(0, base.consumption - consumptionRed);

    return {
      home,
      travel,
      diet,
      consumption,
      total: home + travel + diet + consumption
    };
  };

  // Complete onboarding
  const handleCompleteOnboarding = (newProfile) => {
    setProfile(newProfile);
    setIsOnboarded(true);
    setLoggedActions([]);
    setPoints(0);
    
    const base = calculateFootprint(newProfile);
    setBaselineFootprint(base);
    setActiveFootprint(base);

    localStorage.setItem('ecopulse_onboarded', 'true');
    localStorage.setItem('ecopulse_profile', JSON.stringify(newProfile));
    localStorage.setItem('ecopulse_logged_actions', JSON.stringify([]));
    localStorage.setItem('ecopulse_points', '0');
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

    localStorage.setItem('ecopulse_logged_actions', JSON.stringify(updatedActions));
    localStorage.setItem('ecopulse_points', updatedPoints.toString());
  };

  // Reset Profile
  const handleResetProfile = () => {
    if (window.confirm("Are you sure you want to reset your EcoPulse profile? This will clear all onboarding metrics and points.")) {
      localStorage.clear();
      setIsOnboarded(false);
      setProfile(null);
      setLoggedActions([]);
      setPoints(0);
      setBaselineFootprint({ home: 0, travel: 0, diet: 0, consumption: 0, total: 0 });
      setActiveFootprint({ home: 0, travel: 0, diet: 0, consumption: 0, total: 0 });
      setCurrentView('dashboard');
    }
  };

  const getLevelName = (pts) => {
    if (pts >= 1000) return 'Lvl 5 Climate Hero';
    if (pts >= 600) return 'Lvl 4 Green Guardian';
    if (pts >= 300) return 'Lvl 3 Active Sapling';
    if (pts >= 100) return 'Lvl 2 Green Sprout';
    return 'Lvl 1 Eco Seed';
  };

  if (!isOnboarded) {
    return (
      <div style={{ padding: '2rem 1rem' }}>
        <Onboarding onComplete={handleCompleteOnboarding} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
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
            {getLevelName(userPoints)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>|</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-mint)' }}>
            {userPoints} XP
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleResetProfile} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RotateCcw size={14} /> Reset Profile
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <nav style={{ paddingInline: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="tabs-container" style={{ width: '100%', justifyContent: 'space-around', padding: '0.4rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'tracker', label: 'Quest Ledger', icon: <Compass size={18} /> },
            { id: 'simulator', label: 'Projections Sandbox', icon: <Calendar size={18} /> },
            { id: 'advisor', label: 'AI Advisor', icon: <MessageSquare size={18} /> }
          ].map(view => (
            <button
              key={view.id}
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
      <main style={{ flex: 1, paddingInline: '1.5rem', paddingBottom: '2.5rem' }}>
        <div className="fade-in">
          {currentView === 'dashboard' && (
            <Dashboard 
              baselineFootprint={baselineFootprint}
              activeFootprint={activeFootprint}
              loggedActions={loggedActions}
              ecoActions={ECO_ACTIONS}
            />
          )}

          {currentView === 'tracker' && (
            <ActionTracker 
              ecoActions={ECO_ACTIONS}
              loggedActions={loggedActions}
              onToggleAction={handleToggleAction}
              userPoints={userPoints}
              setPoints={setPoints}
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
