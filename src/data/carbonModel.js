/**
 * EcoPulse Carbon Calculation Model & Conversions
 * Emission factors are in kg CO2e based on global averages, adjusted for Indian context (e.g., electricity grid mix).
 */

export const EMISSION_FACTORS = {
  // Home Energy
  electricity: 0.78, // kg CO2e per kWh (India average grid intensity)
  lpg: 2.98,        // kg CO2e per kg (Liquefied Petroleum Gas)
  coal: 2.42,       // kg CO2e per kg
  solarOffset: 0.78, // kg CO2e saved per kWh of solar generated
  
  // Transport (kg CO2e per km)
  car: {
    petrol: 0.18,
    diesel: 0.16,
    electric: 0.08, // accounting for grid mix charging
    hybrid: 0.11,
  },
  bike: {
    petrol: 0.06,
    electric: 0.02,
  },
  publicTransport: {
    bus: 0.05,
    metro: 0.025,
    train: 0.015,
  },
  flights: {
    domestic: 0.13, // short haul
    international: 0.11, // long haul
  },

  // Diet & Lifestyle (kg CO2e per year based on diet type)
  diet: {
    heavyMeat: 2600,
    mediumMeat: 1800,
    lowMeat: 1300,
    vegetarian: 950,
    vegan: 650,
  },

  // Consumption (kg CO2e per year based on level)
  consumption: {
    high: 2200,    // frequent electronics, fast fashion, new items
    moderate: 1100, // average buyer, mindful electronics
    low: 400,      // minimalist, thrifter, low-waste
  }
};

/**
 * Calculates carbon footprint in kg CO2e per year
 */
export function calculateFootprint(profile) {
  const homeElectricity = (parseFloat(profile.electricityMonthlyKwh) || 0) * 12 * EMISSION_FACTORS.electricity;
  const homeLpg = (parseFloat(profile.lpgMonthlyCylinders) || 0) * 14.2 * 12 * EMISSION_FACTORS.lpg; // 14.2 kg per standard cylinder
  const solarSavings = profile.hasSolar ? (parseFloat(profile.solarMonthlyKwh) || 0) * 12 * EMISSION_FACTORS.solarOffset : 0;
  
  const homeTotal = Math.max(0, homeElectricity + homeLpg - solarSavings);

  // Travel
  const carType = profile.carType || 'petrol';
  const carKm = (parseFloat(profile.carWeeklyKm) || 0) * 52;
  const carTotal = carKm * (EMISSION_FACTORS.car[carType] || EMISSION_FACTORS.car.petrol);

  const bikeType = profile.bikeType || 'petrol';
  const bikeKm = (parseFloat(profile.bikeWeeklyKm) || 0) * 52;
  const bikeTotal = bikeKm * (EMISSION_FACTORS.bike[bikeType] || EMISSION_FACTORS.bike.petrol);

  const busKm = (parseFloat(profile.busWeeklyKm) || 0) * 52;
  const metroKm = (parseFloat(profile.metroWeeklyKm) || 0) * 52;
  const trainKm = (parseFloat(profile.trainWeeklyKm) || 0) * 52;
  const publicTransitTotal = (busKm * EMISSION_FACTORS.publicTransport.bus) +
                             (metroKm * EMISSION_FACTORS.publicTransport.metro) +
                             (trainKm * EMISSION_FACTORS.publicTransport.train);

  const domesticFlights = (parseFloat(profile.domesticFlightsYearly) || 0) * 1200 * EMISSION_FACTORS.flights.domestic; // average 1200 km per flight
  const internationalFlights = (parseFloat(profile.intlFlightsYearly) || 0) * 6000 * EMISSION_FACTORS.flights.international; // average 6000 km per flight
  const travelTotal = carTotal + bikeTotal + publicTransitTotal + domesticFlights + internationalFlights;

  // Diet & Lifestyle
  const dietType = profile.dietType || 'mediumMeat';
  const dietTotal = EMISSION_FACTORS.diet[dietType] || EMISSION_FACTORS.diet.mediumMeat;

  // Consumption
  const consumptionLevel = profile.consumptionLevel || 'moderate';
  const consumptionTotal = EMISSION_FACTORS.consumption[consumptionLevel] || EMISSION_FACTORS.consumption.moderate;

  const total = homeTotal + travelTotal + dietTotal + consumptionTotal;

  return {
    home: Math.round(homeTotal),
    travel: Math.round(travelTotal),
    diet: Math.round(dietTotal),
    consumption: Math.round(consumptionTotal),
    total: Math.round(total)
  };
}

/**
 * Converts kg CO2e to relatable everyday metrics
 */
export function getConversions(kgCO2) {
  return {
    treesPerYear: Math.round(kgCO2 / 22), // 1 mature tree absorbs ~22kg CO2/year
    carKmSaved: Math.round(kgCO2 / EMISSION_FACTORS.car.petrol),
    smartphonesCharged: Math.round(kgCO2 / 0.008), // ~8g CO2 per full charge
    ledLightbulbsYear: Math.round(kgCO2 / (0.01 * 5 * 365 * EMISSION_FACTORS.electricity)) // 10W bulb running 5 hours a day
  };
}

/**
 * India & Global Targets
 */
export const TARGETS = {
  indiaAverage: 1900, // kg CO2e per capita per year
  globalAverage: 4700, // kg CO2e per capita per year
  climateGoal2030: 2000, // Sustainable target per person to limit warming to 1.5C
};
