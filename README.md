# EcoPulse

EcoPulse is a React + Vite personal carbon intelligence app that helps users calculate their annual carbon footprint, track sustainability actions, simulate lifestyle changes, and get action recommendations from a built-in eco advisor.

## Features

- Carbon footprint onboarding for home energy, transport, flights, diet, and consumption
- Dashboard with footprint totals, category breakdowns, targets, and offset equivalents
- Eco Quest Board with carbon-saving actions, XP points, levels, and badges
- What-if simulator for solar, EV commuting, diet changes, and circular economy habits
- Smart advisor with keyword-based sustainability recommendations
- Local persistence using browser localStorage
- Accessibility improvements including labels, ARIA tabs, skip link, focus states, and reduced-motion support
- Security hardening with CSP and safer localStorage parsing
- Test coverage for calculation logic, action metadata, search, and footprint reductions

## Tech Stack

- React
- Vite
- JavaScript
- Lucide React icons
- Node.js test runner

## Getting Started

Install dependencies:

```bash
npm install
Run the development server:
npm run dev
Build for production:
npm run build
Run tests:
npm test

-- Preview the production build:

npm run preview

--Project Structure
src/
  components/
    ActionTracker.jsx
    Dashboard.jsx
    EcoAdvisor.jsx
    Onboarding.jsx
    Simulator.jsx
  data/
    carbonModel.js
    ecoActions.js
    footprintUtils.js
  App.jsx
  main.jsx
  index.css

--License
This project is for educational and hackathon/demo use.
```