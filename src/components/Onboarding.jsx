import React, { useState } from 'react';
import { calculateFootprint } from '../data/carbonModel';
import { Zap, Flame, Car, Plane, Utensils, ShoppingBag, Sun, ArrowRight, ArrowLeft, CheckCircle, Leaf } from 'lucide-react';

const STEPS = [
  { id: 'welcome', name: 'Start' },
  { id: 'energy', name: 'Energy' },
  { id: 'transport', name: 'Transport' },
  { id: 'flights', name: 'Flights' },
  { id: 'diet', name: 'Diet' },
  { id: 'consumption', name: 'Consumption' }
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    // Energy
    electricityMonthlyKwh: '150',
    lpgMonthlyCylinders: '1',
    hasSolar: false,
    solarMonthlyKwh: '0',
    // Transport
    carType: 'petrol',
    carWeeklyKm: '100',
    bikeType: 'petrol',
    bikeWeeklyKm: '50',
    busWeeklyKm: '20',
    metroWeeklyKm: '30',
    trainWeeklyKm: '10',
    // Flights
    domesticFlightsYearly: '2',
    intlFlightsYearly: '0',
    // Diet
    dietType: 'mediumMeat',
    // Consumption
    consumptionLevel: 'moderate'
  });

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const liveFootprint = calculateFootprint(profile);

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'welcome':
        return (
          <div className="step-welcome" style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="float-animation" style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--accent-mint)' }}>
              <Leaf size={48} className="pulse-glow" style={{ borderRadius: '50%' }} />
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', background: 'linear-gradient(95deg, var(--text-primary), var(--accent-mint))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Discover Your Carbon Pulse
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', marginInline: 'auto' }}>
              Welcome to EcoPulse. Answer a few short questions about your lifestyle to establish your carbon benchmark, unlock rewards, and start your smart sustainability roadmap.
            </p>
            <button className="btn btn-primary" type="button" onClick={handleNext} style={{ width: '100%', padding: '1rem' }}>
              Begin Assessment <ArrowRight size={18} />
            </button>
          </div>
        );

      case 'energy':
        return (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={22} style={{ color: 'var(--accent-gold)' }} /> Home Energy Details
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Your home's heating and electricity grid composition.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="electricityMonthlyKwh">Monthly Electricity Consumption (kWh)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="range" 
                  id="electricityMonthlyKwh"
                  aria-describedby="electricityMonthlyKwh-value"
                  min="0" 
                  max="1000" 
                  step="10"
                  className="range-slider"
                  value={profile.electricityMonthlyKwh}
                  onChange={(e) => updateProfile('electricityMonthlyKwh', e.target.value)}
                />
                <span id="electricityMonthlyKwh-value" style={{ fontSize: '1.1rem', fontWeight: 600, width: '80px', textAlign: 'right' }}>{profile.electricityMonthlyKwh} kWh</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lpgMonthlyCylinders">Monthly LPG Cylinders (14.2kg standard)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="range" 
                  id="lpgMonthlyCylinders"
                  aria-describedby="lpgMonthlyCylinders-value"
                  min="0" 
                  max="5" 
                  step="0.5"
                  className="range-slider"
                  value={profile.lpgMonthlyCylinders}
                  onChange={(e) => updateProfile('lpgMonthlyCylinders', e.target.value)}
                />
                <span id="lpgMonthlyCylinders-value" style={{ fontSize: '1.1rem', fontWeight: 600, width: '80px', textAlign: 'right' }}>{profile.lpgMonthlyCylinders} cyls</span>
              </div>
            </div>

            <div className="glass-panel" style={{ borderStyle: 'dashed', background: 'rgba(255,255,255,0.01)', padding: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sun size={18} style={{ color: 'var(--accent-green)' }} /> Solar Generation Rooftop
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Check this if you generate clean solar energy</p>
                </div>
                <input 
                  type="checkbox" 
                  aria-label="I generate clean rooftop solar energy"
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)' }} 
                  checked={profile.hasSolar}
                  onChange={(e) => updateProfile('hasSolar', e.target.checked)}
                />
              </div>

              {profile.hasSolar && (
                <div className="form-group" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                  <label className="form-label" htmlFor="solarMonthlyKwh">Solar Power Produced Monthly (kWh)</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      type="range" 
                      id="solarMonthlyKwh"
                      min="0" 
                      max="800" 
                      step="10"
                      className="range-slider"
                      value={profile.solarMonthlyKwh}
                      onChange={(e) => updateProfile('solarMonthlyKwh', e.target.value)}
                    />
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, width: '80px', textAlign: 'right' }}>{profile.solarMonthlyKwh} kWh</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'transport':
        return (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Car size={22} style={{ color: 'var(--accent-indigo)' }} /> Land Transport
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Your weekly commuting habits and vehicle classes.
            </p>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="carType">Car Fuel Type</label>
                <select 
                  id="carType"
                  className="form-input" 
                  value={profile.carType}
                  onChange={(e) => updateProfile('carType', e.target.value)}
                >
                  <option value="petrol">Petrol / Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric (EV)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="carWeeklyKm">Car Weekly Distance (km)</label>
                <input 
                  type="number" 
                  id="carWeeklyKm"
                  min="0"
                  className="form-input" 
                  value={profile.carWeeklyKm} 
                  onChange={(e) => updateProfile('carWeeklyKm', e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="bikeType">Bike / Scooter Fuel Type</label>
                <select 
                  id="bikeType"
                  className="form-input" 
                  value={profile.bikeType}
                  onChange={(e) => updateProfile('bikeType', e.target.value)}
                >
                  <option value="petrol">Petrol Two-Wheeler</option>
                  <option value="electric">Electric Scooter</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bikeWeeklyKm">Bike Weekly Distance (km)</label>
                <input 
                  type="number" 
                  id="bikeWeeklyKm"
                  min="0"
                  className="form-input" 
                  value={profile.bikeWeeklyKm} 
                  onChange={(e) => updateProfile('bikeWeeklyKm', e.target.value)}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Weekly Public Transit (km)
              </h4>
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="busWeeklyKm">Bus</label>
                  <input 
                    type="number" 
                    id="busWeeklyKm"
                    min="0"
                    className="form-input" 
                    value={profile.busWeeklyKm} 
                    onChange={(e) => updateProfile('busWeeklyKm', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="metroWeeklyKm">Metro / Train</label>
                  <input 
                    type="number" 
                    id="metroWeeklyKm"
                    min="0"
                    className="form-input" 
                    value={profile.metroWeeklyKm} 
                    onChange={(e) => updateProfile('metroWeeklyKm', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="trainWeeklyKm">Long-distance Train</label>
                  <input 
                    type="number" 
                    id="trainWeeklyKm"
                    min="0"
                    className="form-input" 
                    value={profile.trainWeeklyKm} 
                    onChange={(e) => updateProfile('trainWeeklyKm', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'flights':
        return (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plane size={22} style={{ color: 'var(--accent-mint)' }} /> Flight Travels
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Aviation burns massive jet fuel. Estimate your yearly plane travel.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="domesticFlightsYearly">Yearly Domestic Flights (round-trips)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="range" 
                  id="domesticFlightsYearly"
                  min="0" 
                  max="15" 
                  step="1"
                  className="range-slider"
                  value={profile.domesticFlightsYearly}
                  onChange={(e) => updateProfile('domesticFlightsYearly', e.target.value)}
                />
                <span style={{ fontSize: '1.1rem', fontWeight: 600, width: '80px', textAlign: 'right' }}>{profile.domesticFlightsYearly} flights</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="intlFlightsYearly">Yearly International Flights (round-trips)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="range" 
                  id="intlFlightsYearly"
                  min="0" 
                  max="10" 
                  step="1"
                  className="range-slider"
                  value={profile.intlFlightsYearly}
                  onChange={(e) => updateProfile('intlFlightsYearly', e.target.value)}
                />
                <span style={{ fontSize: '1.1rem', fontWeight: 600, width: '80px', textAlign: 'right' }}>{profile.intlFlightsYearly} flights</span>
              </div>
            </div>
          </div>
        );

      case 'diet':
        return (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Utensils size={22} style={{ color: 'var(--accent-coral)' }} /> Food & Diet Patterns
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Livestock methane emissions represent a substantial portion of food footprints.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { type: 'heavyMeat', label: 'Frequent Meat Eater', desc: 'Frequent red meat, chicken, and dairy intake daily.' },
                { type: 'mediumMeat', label: 'Moderate Meat Eater', desc: 'Average amount of chicken/fish, occasional red meat.' },
                { type: 'lowMeat', label: 'Flexitarian / Low Meat', desc: 'Primarily plant-based, rarely eating meat/fish.' },
                { type: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish, regular dairy/egg consumption.' },
                { type: 'vegan', label: 'Vegan', desc: '100% plant-based food. No animal products.' }
              ].map(dietOpt => (
                <button 
                  key={dietOpt.type}
                  type="button"
                  aria-pressed={profile.dietType === dietOpt.type}
                  className="glass-panel"
                  style={{ 
                    cursor: 'pointer',
                    borderColor: profile.dietType === dietOpt.type ? 'var(--accent-mint)' : 'var(--border-color)',
                    background: profile.dietType === dietOpt.type ? 'rgba(52, 211, 153, 0.05)' : 'var(--bg-glass)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => updateProfile('dietType', dietOpt.type)}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: profile.dietType === dietOpt.type ? 'var(--accent-mint)' : 'var(--text-primary)' }}>
                      {dietOpt.label}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{dietOpt.desc}</p>
                  </div>
                  {profile.dietType === dietOpt.type && <CheckCircle size={18} style={{ color: 'var(--accent-mint)' }} />}
                </button>
              ))}
            </div>
          </div>
        );

      case 'consumption':
        return (
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={22} style={{ color: 'var(--accent-purple)' }} /> Shopping & Consumption Habits
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Manufacturing and raw extraction emissions of consumer products.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { level: 'high', label: 'Frequent Buyer / Tech Enthusiast', desc: 'Buy new gadgets often, follow fashion trends, rarely recycle.' },
                { level: 'moderate', label: 'Average Consumer', desc: 'Buy gadgets only when needed, average clothes spending, mindful of waste.' },
                { level: 'low', label: 'Minimalist / Eco-Conscious', desc: 'Thrift clothing, repair devices, active recycler, minimal new purchasing.' }
              ].map(consOpt => (
                <button 
                  key={consOpt.level}
                  type="button"
                  aria-pressed={profile.consumptionLevel === consOpt.level}
                  className="glass-panel"
                  style={{ 
                    cursor: 'pointer',
                    borderColor: profile.consumptionLevel === consOpt.level ? 'var(--accent-indigo)' : 'var(--border-color)',
                    background: profile.consumptionLevel === consOpt.level ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-glass)',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => updateProfile('consumptionLevel', consOpt.level)}
                >
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: profile.consumptionLevel === consOpt.level ? 'var(--accent-indigo)' : 'var(--text-primary)' }}>
                      {consOpt.label}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{consOpt.desc}</p>
                  </div>
                  {profile.consumptionLevel === consOpt.level && <CheckCircle size={18} style={{ color: 'var(--accent-indigo)' }} />}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container glass-panel">
      {currentStep > 0 && (
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      )}

      {renderStepContent()}

      {currentStep > 0 && (
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
          {/* Live Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Carbon Assessment
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {(liveFootprint.total / 1000).toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>metric tons/yr</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" type="button" onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" type="button" onClick={handleNext}>
              {currentStep === STEPS.length - 1 ? 'Finish Profile' : 'Next Step'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
