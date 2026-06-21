import React, { useState } from 'react';
import { Sparkles, Calendar, Leaf, Zap, Car, Utensils } from 'lucide-react';
import { EMISSION_FACTORS } from '../data/carbonModel';

export default function Simulator({ activeFootprint, profile }) {
  // Simulator Local States
  const [solarShare, setSolarShare] = useState(0); // 0% to 100% solar
  const [evCommuteShare, setEvCommuteShare] = useState(0); // 0% to 100% of car commute switched to EV
  const [dietLevel, setDietLevel] = useState(2); // 0: heavyMeat, 1: mediumMeat, 2: lowMeat, 3: vegetarian, 4: vegan
  const [wasteRefuse, setWasteRefuse] = useState(0); // 0% to 100% waste circular economy reduction

  // Financial rates (in Rupees ₹ for Indian Context)
  const COST_PER_KWH = 7.5; // Average Indian power tariff
  const PETROL_COST_PER_KM = 6.8; // Petrol cost per km
  const EV_CHARGE_COST_PER_KM = 1.4; // EV electric charge cost per km

  // Calculations based on sliders
  const currentHome = activeFootprint.home;
  const currentTravel = activeFootprint.travel;
  const currentDiet = activeFootprint.diet;
  const currentConsumption = activeFootprint.consumption;
  const currentTotal = activeFootprint.total;

  // 1. Solar calculations
  // Estimate baseline energy cost & emissions
  const electricityKwhYearly = (parseFloat(profile.electricityMonthlyKwh) || 0) * 12;
  const solarSavingsCo2 = electricityKwhYearly * (solarShare / 100) * EMISSION_FACTORS.solarOffset;
  const simulatedHome = Math.max(0, currentHome - solarSavingsCo2);
  const financialSolarSavings = electricityKwhYearly * (solarShare / 100) * COST_PER_KWH;

  // 2. EV calculations
  const carKmYearly = (parseFloat(profile.carWeeklyKm) || 0) * 52;
  const carType = profile.carType || 'petrol';
  const baselineCarFactor = EMISSION_FACTORS.car[carType];
  const evFactor = EMISSION_FACTORS.car.electric;
  
  // CO2 savings from transitioning km driven
  const evSavingsCo2 = carKmYearly * (evCommuteShare / 100) * (baselineCarFactor - evFactor);
  const simulatedTravel = Math.max(0, currentTravel - evSavingsCo2);
  
  // Financial savings: Petrol vs Charging
  const baselineCostKm = carType === 'electric' ? EV_CHARGE_COST_PER_KM : PETROL_COST_PER_KM;
  const evCostSavings = carKmYearly * (evCommuteShare / 100) * (baselineCostKm - EV_CHARGE_COST_PER_KM);

  // 3. Diet calculations
  const dietKeys = ['heavyMeat', 'mediumMeat', 'lowMeat', 'vegetarian', 'vegan'];
  const targetDietKey = dietKeys[dietLevel];
  const simulatedDiet = EMISSION_FACTORS.diet[targetDietKey];
  const dietSavingsCo2 = Math.max(0, currentDiet - simulatedDiet);
  // Vegetarian food is typically cheaper, let's estimate ₹15,000 saved yearly by eating plant-based
  const dietSavingsFin = Math.max(0, (2 - dietLevel) * -5000); // 0 saves 0, 1 saves -5000 (costs more), 3 saves 5000, 4 saves 10000

  // 4. Waste / consumption calculations
  // Reduce consumption emissions by up to 40% through recycling, reuse, second-hand
  const consumptionSavingsCo2 = currentConsumption * (wasteRefuse / 100) * 0.45;
  const simulatedConsumption = Math.max(0, currentConsumption - consumptionSavingsCo2);
  // Estimate ₹120 per kg CO2 saved in purchase avoiding
  const consumptionSavingsFin = consumptionSavingsCo2 * 12;

  // Aggregate simulated footprint
  const simulatedTotal = Math.round(simulatedHome + simulatedTravel + simulatedDiet + simulatedConsumption);
  const totalSavedCo2 = Math.max(0, currentTotal - simulatedTotal);
  const totalSavedFinancial = Math.round(financialSolarSavings + evCostSavings + dietSavingsFin + consumptionSavingsFin);

  const percentReduced = currentTotal > 0 ? ((totalSavedCo2 / currentTotal) * 100).toFixed(0) : 0;

  // Simulated chart metrics
  const barHeightCurrent = 200;
  const scale = barHeightCurrent / Math.max(currentTotal, 5000);
  const barHeightSimulated = simulatedTotal * scale;

  return (
    <div className="dashboard-grid">
      
      {/* LEFT COLUMN: Simulator Scenario Controls */}
      <div className="col-7 glass-panel">
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-mint)' }} /> What-If Sandbox
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Tweak lifestyle transition sliders to preview how large strategic shifts impact your footprint and wallet.
        </p>

        {/* Control 1: Solar */}
        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} style={{ color: 'var(--accent-gold)' }} /> Transition to Solar Energy
            </span>
            <span style={{ color: 'var(--accent-mint)', fontWeight: 700, fontSize: '0.95rem' }}>{solarShare}% Solar</span>
          </div>
          <input 
            type="range"
            aria-label="Solar energy transition percentage"
            min="0"
            max="100"
            step="5"
            className="range-slider"
            value={solarShare}
            onChange={(e) => setSolarShare(parseInt(e.target.value))}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Switching home energy to solar generation reduces high grid emission intensities.
          </p>
        </div>

        {/* Control 2: EV Commuting */}
        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Car size={16} style={{ color: 'var(--accent-indigo)' }} /> Switch Commute to Electric Vehicle
            </span>
            <span style={{ color: 'var(--accent-mint)', fontWeight: 700, fontSize: '0.95rem' }}>{evCommuteShare}% EV</span>
          </div>
          <input 
            type="range"
            aria-label="Electric vehicle commute percentage"
            min="0"
            max="100"
            step="5"
            className="range-slider"
            value={evCommuteShare}
            disabled={profile.carType === 'electric'}
            onChange={(e) => setEvCommuteShare(parseInt(e.target.value))}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {profile.carType === 'electric' 
              ? 'Your car is already fully Electric!' 
              : 'Switches a percentage of weekly combustion engine mileage to EV charging.'}
          </p>
        </div>

        {/* Control 3: Diet Upgrade */}
        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Utensils size={16} style={{ color: 'var(--accent-coral)' }} /> Food Transition Scale
            </span>
            <span style={{ color: 'var(--accent-mint)', fontWeight: 700, fontSize: '0.95rem' }}>
              {['Meat Lover', 'Medium Meat', 'Flexitarian', 'Vegetarian', 'Vegan'][dietLevel]}
            </span>
          </div>
          <input 
            type="range"
            aria-label="Food transition level"
            min="0"
            max="4"
            step="1"
            className="range-slider"
            value={dietLevel}
            onChange={(e) => setDietLevel(parseInt(e.target.value))}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Shifting diet patterns away from high-methane beef/mutton yields immediate planetary health benefits.
          </p>
        </div>

        {/* Control 4: Circular Economy Refuse & Repair */}
        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Leaf size={16} style={{ color: 'var(--accent-green)' }} /> Circular Economy & Waste Reduction
            </span>
            <span style={{ color: 'var(--accent-mint)', fontWeight: 700, fontSize: '0.95rem' }}>{wasteRefuse}% Circular</span>
          </div>
          <input 
            type="range"
            aria-label="Circular economy and waste reduction percentage"
            min="0"
            max="100"
            step="5"
            className="range-slider"
            value={wasteRefuse}
            onChange={(e) => setWasteRefuse(parseInt(e.target.value))}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Repairing electronics, buying secondhand, composting food scraps, and avoiding single-use plastics.
          </p>
        </div>

      </div>

      {/* RIGHT COLUMN: Simulator Impact Outputs (Charts & Projections) */}
      <div className="col-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Footprint Comparison Chart */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '280px' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>Projected Footprint Shift</h4>

          <div style={{ display: 'flex', gap: '3rem', height: '180px', alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
            
            {/* Current Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {(currentTotal / 1000).toFixed(1)}t
              </span>
              <div style={{ 
                width: '40px', 
                height: `${Math.max(20, barHeightCurrent)}px`, 
                background: 'linear-gradient(to top, rgba(99, 102, 241, 0.4), var(--accent-indigo))', 
                borderRadius: '6px 6px 0 0',
                boxShadow: 'var(--glow-indigo)'
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textTransform: 'uppercase' }}>Current</span>
            </div>

            {/* Simulated Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-mint)', marginBottom: '0.5rem' }}>
                {(simulatedTotal / 1000).toFixed(1)}t
              </span>
              <div style={{ 
                width: '40px', 
                height: `${Math.max(20, barHeightSimulated)}px`, 
                background: 'linear-gradient(to top, rgba(16, 185, 129, 0.4), var(--accent-green))', 
                borderRadius: '6px 6px 0 0',
                boxShadow: 'var(--glow-green)',
                transition: 'height 0.4s ease'
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textTransform: 'uppercase' }}>Projected</span>
            </div>

          </div>

          {totalSavedCo2 > 0 && (
            <div style={{ marginTop: '1.25rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
              Saves {percentReduced}% Carbon annually!
            </div>
          )}
        </div>

        {/* Timeline Projections Card */}
        <div className="glass-panel glass-panel-glow-green" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={18} style={{ color: 'var(--accent-mint)' }} /> Multi-Year Accumulations
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { years: 1, co2: totalSavedCo2, money: totalSavedFinancial },
              { years: 5, co2: totalSavedCo2 * 5, money: totalSavedFinancial * 5 },
              { years: 10, co2: totalSavedCo2 * 10, money: totalSavedFinancial * 10 }
            ].map((proj) => (
              <div 
                key={proj.years} 
                className="glass-panel" 
                style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid rgba(255,255,255,0.04)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{proj.years} Year Projection</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                    {(proj.co2 / 1000).toFixed(1)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>tons CO2 saved</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Financial Savings</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-mint)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.1rem' }}>
                    ₹{proj.money.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
