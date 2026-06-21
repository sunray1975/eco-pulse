import React, { useState } from 'react';
import { getConversions, TARGETS } from '../data/carbonModel';
import { Flame, Trees, Smartphone, Lightbulb, TrendingDown, Target, Info, Sparkles } from 'lucide-react';

export default function Dashboard({ baselineFootprint, activeFootprint, loggedActions, ecoActions }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Compute values
  const totalCo2 = activeFootprint.total;
  const originalCo2 = baselineFootprint.total;
  const totalSaved = Math.max(0, originalCo2 - totalCo2);
  const percentReduced = originalCo2 > 0 ? ((totalSaved / originalCo2) * 100).toFixed(0) : 0;
  
  const conversions = getConversions(totalCo2);
  const savingsConversions = getConversions(totalSaved);

  // Categories data for donut chart
  const categories = [
    { name: 'Home Energy', value: activeFootprint.home, color: '#f59e0b', key: 'home' },
    { name: 'Transport', value: activeFootprint.travel, color: '#6366f1', key: 'travel' },
    { name: 'Diet & Food', value: activeFootprint.diet, color: '#10b981', key: 'diet' },
    { name: 'Consumption', value: activeFootprint.consumption, color: '#a855f7', key: 'consumption' }
  ].filter(c => c.value > 0);

  const totalCatValue = categories.reduce((acc, curr) => acc + curr.value, 0);

  // Donut SVG Calculations
  let accumulatedPercent = 0;
  const segments = categories.map(cat => {
    const percentage = totalCatValue > 0 ? cat.value / totalCatValue : 0;
    const startAngle = accumulatedPercent * 360;
    accumulatedPercent += percentage;
    const endAngle = accumulatedPercent * 360;
    
    // Convert polar coordinates to Cartesian
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    };

    const drawArc = (x, y, radius, startAngle, endAngle) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(' ');
    };

    // Radius of donut is 70, stroke-width is 16
    const pathData = drawArc(100, 100, 70, startAngle, endAngle);
    return {
      ...cat,
      percentage: (percentage * 100).toFixed(0),
      pathData
    };
  });

  // Target dial radial gauge
  const maxTargetGauge = 8000; // max reference value
  const gaugePercentage = Math.min(100, (totalCo2 / maxTargetGauge) * 100);
  const gaugeCircumference = 2 * Math.PI * 80; // r=80
  const strokeDashoffset = gaugeCircumference - (gaugePercentage / 100) * gaugeCircumference;

  // Track target rating
  let targetStatus = { label: 'Extremely Low', color: '#10b981' };
  if (totalCo2 > 6000) {
    targetStatus = { label: 'High Emission', color: '#f87171' };
  } else if (totalCo2 > 3500) {
    targetStatus = { label: 'Moderate Emission', color: '#f59e0b' };
  } else if (totalCo2 > 2000) {
    targetStatus = { label: 'Eco-Mindful', color: '#34d399' };
  } else {
    targetStatus = { label: 'Climate Hero', color: '#10b981' };
  }

  // Simulated progress data for line chart
  // Generates smooth monthly reduction points
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthData = [
    originalCo2,
    originalCo2 - totalSaved * 0.15,
    originalCo2 - totalSaved * 0.4,
    originalCo2 - totalSaved * 0.65,
    originalCo2 - totalSaved * 0.85,
    totalCo2
  ].map(val => Math.round(val));

  // SVGs coordinate mapping for Line Chart
  const svgWidth = 500;
  const svgHeight = 180;
  const padding = 30;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const minVal = 0;
  const maxVal = Math.max(originalCo2, 6000);
  
  const getX = (index) => padding + (index * (chartWidth / (months.length - 1)));
  const getY = (value) => {
    const scale = (value - minVal) / (maxVal - minVal);
    return svgHeight - padding - (scale * chartHeight);
  };

  const linePoints = monthData.map((val, idx) => `${getX(idx)},${getY(val)}`).join(' ');
  const areaPoints = `${padding},${svgHeight - padding} ${linePoints} ${svgWidth - padding},${svgHeight - padding}`;

  return (
    <div>
      {/* Overview Metric Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        {/* KPI 1: Active Footprint */}
        <div className="glass-panel glass-panel-glow-green" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-mint)' }}>
            <Flame size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Active Carbon Pulse</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{(totalCo2 / 1000).toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>tons/yr</span></h3>
            <span style={{ fontSize: '0.75rem', color: targetStatus.color, fontWeight: 600 }}>{targetStatus.label}</span>
          </div>
        </div>

        {/* KPI 2: Saved Carbon */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)' }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Carbon Prevented</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalSaved} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>kg/yr</span></h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-mint)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Sparkles size={10} /> Saved {percentReduced}% from baseline
            </span>
          </div>
        </div>

        {/* KPI 3: Climate Benchmark */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-gold)' }}>
            <Target size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>National Target</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{(TARGETS.indiaAverage / 1000).toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>tons/yr</span></h3>
            <span style={{ fontSize: '0.75rem', color: totalCo2 <= TARGETS.indiaAverage ? 'var(--accent-mint)' : 'var(--accent-coral)', fontWeight: 600 }}>
              {totalCo2 <= TARGETS.indiaAverage ? 'Below Indian Average' : `${((totalCo2 / TARGETS.indiaAverage - 1) * 100).toFixed(0)}% above Indian Avg`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: Radial Dial and Donut Breakdown */}
        <div className="col-5 glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '400px' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', alignSelf: 'flex-start' }}>Carbon Emission Profile</h4>
          
          <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '1rem' }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Track */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
              {/* Dynamic Progress Indicator */}
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke={targetStatus.color} 
                strokeWidth="12" 
                strokeDasharray={gaugeCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{(totalCo2 / 1000).toFixed(1)}</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase' }}>Tons CO2e</p>
              <span className="badge" style={{ marginTop: '0.3rem', background: 'rgba(255,255,255,0.05)', color: targetStatus.color, fontSize: '0.65rem' }}>
                {targetStatus.label}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', width: '100%', marginTop: '1rem' }}>
            {categories.map((c, i) => (
              <div 
                key={i} 
                className="glass-panel" 
                style={{ 
                  padding: '0.5rem 0.8rem', 
                  borderLeft: `4px solid ${c.color}`, 
                  textAlign: 'left',
                  background: 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.name}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  {(c.value / 1000).toFixed(2)} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>t</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Custom Donut Chart and Historical Line Graph */}
        <div className="col-7" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Donut Chart & Category Percentages */}
          <div className="glass-panel" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg width="160" height="160" viewBox="0 0 200 200">
                {segments.map((seg, idx) => (
                  <path 
                    key={idx}
                    d={seg.pathData}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={hoveredSegment === idx ? '22' : '16'}
                    style={{ transition: 'stroke-width 0.2s ease, filter 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredSegment(idx)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                ))}
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {hoveredSegment !== null ? segments[hoveredSegment].name : 'Distribution'}
                </span>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
                  {hoveredSegment !== null ? `${segments[hoveredSegment].percentage}%` : 'CO2e'}
                </h3>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Source Breakdown</h4>
              {segments.map((seg, idx) => (
                <div 
                  key={idx} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0.5rem', borderRadius: '6px', background: hoveredSegment === idx ? 'rgba(255,255,255,0.03)' : 'transparent', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredSegment(idx)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ display: 'block', width: '10px', height: '10px', borderRadius: '50%', background: seg.color }}></span>
                    <span style={{ color: hoveredSegment === idx ? '#fff' : 'var(--text-secondary)' }}>{seg.name}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{seg.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Trend Line Graph */}
          <div className="glass-panel" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>Historical Footprint Trajectory</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulated transition curve based on reduction initiatives</p>
              </div>
              {totalSaved > 0 && (
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-mint)' }}>
                  Declining Trajectory
                </span>
              )}
            </div>

            <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75, 1].map((f, i) => (
                  <line 
                    key={i}
                    x1={padding}
                    y1={svgHeight - padding - (f * chartHeight)}
                    x2={svgWidth - padding}
                    y2={svgHeight - padding - (f * chartHeight)}
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="1"
                  />
                ))}

                {/* Area under line */}
                <polygon 
                  points={areaPoints}
                  fill="url(#chartGrad)"
                  opacity="0.1"
                />

                {/* Line Path */}
                <polyline 
                  fill="none" 
                  stroke="var(--accent-indigo)" 
                  strokeWidth="3" 
                  points={linePoints}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points & Labels */}
                {monthData.map((val, idx) => (
                  <g key={idx}>
                    <circle 
                      cx={getX(idx)} 
                      cy={getY(val)} 
                      r="4" 
                      fill="#070a13" 
                      stroke="var(--accent-indigo)" 
                      strokeWidth="2.5" 
                    />
                    <text 
                      x={getX(idx)} 
                      y={getY(val) - 10} 
                      fill="var(--text-secondary)" 
                      fontSize="9" 
                      textAnchor="middle" 
                      fontWeight="600"
                    >
                      {(val / 1000).toFixed(1)}t
                    </text>
                    <text 
                      x={getX(idx)} 
                      y={svgHeight - padding + 15} 
                      fill="var(--text-muted)" 
                      fontSize="10" 
                      textAnchor="middle"
                    >
                      {months[idx]}
                    </text>
                  </g>
                ))}

                {/* Gradients */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-indigo)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* Carbon Offset Equivalents Section */}
      <div className="glass-panel" style={{ marginTop: '1.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Info size={18} style={{ color: 'var(--accent-indigo)' }} /> Reaching Climate Neutrality
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {[
            {
              icon: <Trees size={24} />,
              label: 'Yearly Forest Offset',
              value: `${conversions.treesPerYear} mature trees`,
              desc: 'required to completely absorb your remaining yearly footprint.'
            },
            {
              icon: <Smartphone size={24} />,
              label: 'Electricity Offset Equivalent',
              value: `${conversions.smartphonesCharged.toLocaleString()} charges`,
              desc: 'of standard smartphones matches your total annual carbon energy.'
            },
            {
              icon: <Lightbulb size={24} />,
              label: 'LED Bulb Lifetime equivalent',
              value: `${conversions.ledLightbulbsYear.toLocaleString()} yrs`,
              desc: 'of running one 10W LED bulb consumes equivalent energy.'
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{ 
                background: 'rgba(255,255,255,0.01)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.6rem',
                border: '1px solid rgba(255,255,255,0.04)'
              }}
            >
              <div style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {item.icon}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{item.value}</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
