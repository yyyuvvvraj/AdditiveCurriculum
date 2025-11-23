// src/lib/api.ts
import db from '@/data/mock_database.json';

// --- TYPES ---
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  rop: number;
  status: string;
  vendor: string;
  leadTime: number;
}

export interface MachineItem {
  id: string;
  name: string;
  temp: number;
  vibration: number;
  health: number;
  status: string;
  prediction: string;
  lastUpdated: string;
  rootCause: string;
  suggestedActions: string[];
}

// --- 1. VASUS BRAKES MACHINE NAMES (The only names allowed) ---
const MACHINE_NAMES = [
  "Hydraulic Press 500T - Line A",  
  "Hydraulic Press 300T - Line B",
  "CNC Turning Center #1",          
  "CNC Turning Center #2",
  "Vertical Machining Center (VMC)",
  "Brake Pad Curing Oven A",        
  "Brake Pad Curing Oven B",
  "Surface Grinder Unit",           
  "Shot Blasting Machine",          
  "Auto-Riveting Station",          
  "Dynamometer Test Rig",           
  "Powder Coating Booth",
  "Conveyor Belt Motor - Main",
  "Dust Collection System",
  "Robotic Arm - Palletizer"
];

// --- 2. ERROR SCENARIOS (Specific to Brake Manufacturing) ---
const CRITICAL_SCENARIOS = [
  {
    prediction: "Spindle Bearing Detachment Risk",
    rootCause: "Inner race wear detected on main spindle bearings due to lubrication failure.",
    actions: ["Lockout machine immediately", "Replace Spindle Bearings (Kit #SP-99)", "Check auto-lubrication lines"],
    tempRange: [85, 95], 
    vibRange: [8.5, 12.0]
  },
  {
    prediction: "Hydraulic Pump Failure",
    rootCause: "Cavitation detected in main pump. Oil viscosity breakdown.",
    actions: ["Inspect Hydraulic Fluid Level", "Replace Suction Filter", "Check Pump Seals"],
    tempRange: [80, 95],
    vibRange: [6.0, 9.0]
  },
  {
    prediction: "Curing Oven Thermal Runaway",
    rootCause: "PID Controller malfunction. Heating elements stuck in 'ON' state.",
    actions: ["Reset PID Controller", "Inspect Solid State Relays", "Check Thermocouple calibration"],
    tempRange: [180, 220], 
    vibRange: [1.0, 2.0]
  },
  {
    prediction: "CNC Axis Servo Overload",
    rootCause: "High friction on X-Axis guideways. Lubrication blockage suspected.",
    actions: ["Clean Guide Rails", "Verify Lubrication Pump Pressure", "Inspect Servo Driver Logs"],
    tempRange: [65, 75],
    vibRange: [4.5, 6.5]
  },
  {
    prediction: "Shot Blast Impeller Imbalance",
    rootCause: "Blade wear uneven on blast wheel. High vibration affecting finish quality.",
    actions: ["Replace Blast Wheel Blades", "Balance Impeller Assembly", "Check abrasive feed mix"],
    tempRange: [50, 60],
    vibRange: [9.0, 11.0] 
  }
];

const WARNING_SCENARIOS = [
  {
    prediction: "Routine Maintenance Due",
    rootCause: "Runtime hours exceeded scheduled maintenance interval.",
    actions: ["Perform Level 1 Service", "Grease Guide Rails", "Clean Air Filters"],
  },
  {
    prediction: "Minor Vibration Drift",
    rootCause: "Harmonic oscillation detected. Loose mounting suspected.",
    actions: ["Tighten foundation bolts", "Check machine leveling feet"],
  },
  {
    prediction: "Filter Clog Warning",
    rootCause: "Differential pressure across intake filter is high.",
    actions: ["Clean or Replace Intake Filter", "Check Airflow sensor"],
  }
];

// --- API FUNCTIONS ---

export async function fetchInventory(): Promise<InventoryItem[]> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Faster load
  let rawData: any[] = [];
  if (Array.isArray(db)) rawData = db;
  else if ((db as any).inventory) rawData = (db as any).inventory;

  return rawData.map((row: any) => ({
    id: row.Part_ID || row.id || "UNK",
    name: row.Part_Name || row.name || "Unknown Part",
    category: row.Category || row.category || "General",
    stock: row.Current_Stock ?? row.stock ?? 0,
    rop: row.ROP ?? row.rop ?? 0,
    status: (row.Current_Stock ?? 0) <= (row.ROP ?? 0) ? 'Critical' : 'Normal',
    vendor: row.Vendor || row.vendor || "Unknown",
    leadTime: row.Lead_Time_Day ?? row.leadTime ?? 0
  }));
}

export async function fetchMachines(): Promise<MachineItem[]> {
  await new Promise(resolve => setTimeout(resolve, 100));

  // GENERATE DATA FRESH EVERY CALL
  return Array.from({ length: 50 }).map((_, i) => {
    
    // LOGIC: Assign names from the list above.
    // We use modulo (%) to cycle through the 15 names for 50 machines.
    const nameIndex = i % MACHINE_NAMES.length;
    let displayName = MACHINE_NAMES[nameIndex];

    // If we have repeated the name, add a number: "CNC Center (2)"
    if (i >= MACHINE_NAMES.length) {
        displayName = `${displayName} (${Math.floor(i / MACHINE_NAMES.length) + 1})`;
    }

    // 1. FORCE CRITICAL: Machine 0, 1, and every 10th one
    const isCritical = i === 0 || i === 1 || i % 10 === 0;
    // 2. FORCE WARNING: Machine 2, 3, and every 4th one (if not critical)
    const isWarning = !isCritical && (i === 2 || i === 3 || i % 4 === 0);

    let health, temp, vibration, status, prediction, rootCause, actions;

    if (isCritical) {
      // Pick specific scenarios for critical machines to vary the error
      const scenario = CRITICAL_SCENARIOS[i % CRITICAL_SCENARIOS.length];
      
      status = 'CRITICAL';
      health = Math.floor(Math.random() * 30) + 20; 
      prediction = scenario.prediction;
      rootCause = scenario.rootCause;
      actions = scenario.actions;
      temp = Math.floor(Math.random() * (scenario.tempRange[1] - scenario.tempRange[0])) + scenario.tempRange[0];
      vibration = parseFloat((Math.random() * (scenario.vibRange[1] - scenario.vibRange[0]) + scenario.vibRange[0]).toFixed(1));

    } else if (isWarning) {
      const scenario = WARNING_SCENARIOS[i % WARNING_SCENARIOS.length];
      status = 'WARNING';
      health = Math.floor(Math.random() * 15) + 60; 
      prediction = scenario.prediction;
      rootCause = scenario.rootCause;
      actions = scenario.actions;
      temp = Math.floor(Math.random() * 10) + 70;
      vibration = parseFloat((Math.random() * 2 + 3).toFixed(1));

    } else {
      status = 'NORMAL';
      health = Math.floor(Math.random() * 20) + 81;
      prediction = 'Optimal Performance';
      rootCause = 'System operating within normal parameters.';
      actions = ['No actions required'];
      temp = Math.floor(Math.random() * 15) + 45;
      vibration = parseFloat((Math.random() * 1.5).toFixed(1));
    }

    return {
      id: `MC-${1000 + i}`,
      name: displayName,
      temp: temp,
      vibration: vibration,
      health: health,
      status: status,
      prediction: prediction,
      lastUpdated: new Date().toISOString(),
      rootCause: rootCause,
      suggestedActions: actions
    };
  });
}

export async function fetchConsumption() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return (db as any).consumptionStats || [];
}