// src/lib/api.ts
import db from '@/data/mock_database.json';

// ==========================================
// 1. TYPE DEFINITIONS
// ==========================================

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

export interface ConsumptionMetrics {
  trend: { label: string; cost: number; units: number }[];
  breakdown: { category: string; value: number; color: string }[];
  topParts: { id: string; name: string; usage: number; cost: number; status: string }[];
  kpi: {
    totalCost: number;
    totalUnits: number;
    efficiency: number;
  }
}

// ==========================================
// 2. CONSTANTS & SCENARIOS (For Generators)
// ==========================================

const MACHINE_NAMES = [
  "Hydraulic Press 500T", "Hydraulic Press 300T", "CNC Turning Center #1", "CNC Turning Center #2",
  "Vertical Machining Center", "Brake Pad Curing Oven A", "Brake Pad Curing Oven B", "Surface Grinder Unit",
  "Shot Blasting Machine", "Auto-Riveting Station", "Dynamometer Test Rig", "Powder Coating Booth",
  "Conveyor Belt Motor", "Dust Collection System", "Robotic Palletizer"
];

const CRITICAL_SCENARIOS = [
  { prediction: "Spindle Bearing Detachment Risk", rootCause: "Inner race wear detected on main spindle bearings.", actions: ["Lockout machine immediately", "Replace Spindle Bearings", "Check auto-lubrication"], tempRange: [85, 95], vibRange: [8.5, 12.0] },
  { prediction: "Hydraulic Pump Failure", rootCause: "Cavitation detected in main pump.", actions: ["Inspect Hydraulic Fluid", "Replace Suction Filter", "Check Pump Seals"], tempRange: [80, 95], vibRange: [6.0, 9.0] },
  { prediction: "Curing Oven Thermal Runaway", rootCause: "PID Controller malfunction.", actions: ["Reset PID Controller", "Inspect Relays", "Check Thermocouple"], tempRange: [180, 220], vibRange: [1.0, 2.0] },
  { prediction: "CNC Axis Servo Overload", rootCause: "High friction on X-Axis guideways.", actions: ["Clean Guide Rails", "Verify Lubrication", "Inspect Servo Logs"], tempRange: [65, 75], vibRange: [4.5, 6.5] },
  { prediction: "Shot Blast Impeller Imbalance", rootCause: "Blade wear uneven on blast wheel.", actions: ["Replace Blast Wheel Blades", "Balance Impeller", "Check abrasive mix"], tempRange: [50, 60], vibRange: [9.0, 11.0] }
];

const WARNING_SCENARIOS = [
  { prediction: "Routine Maintenance Due", rootCause: "Runtime hours exceeded interval.", actions: ["Perform Level 1 Service", "Grease Rails", "Clean Filters"] },
  { prediction: "Minor Vibration Drift", rootCause: "Harmonic oscillation detected.", actions: ["Tighten foundation bolts", "Check leveling feet"] },
  { prediction: "Filter Clog Warning", rootCause: "High differential pressure.", actions: ["Clean Intake Filter", "Check Airflow"] }
];

// ==========================================
// 3. INTERNAL DATA GENERATORS
// ==========================================

function generateMachines(count: number): MachineItem[] {
  return Array.from({ length: count }).map((_, i) => {
    const isCritical = i === 0 || i === 1 || i % 10 === 0;
    const isWarning = !isCritical && (i === 2 || i === 3 || i % 4 === 0);
    
    const nameIndex = i % MACHINE_NAMES.length;
    let displayName = MACHINE_NAMES[nameIndex];
    if (i >= MACHINE_NAMES.length) displayName = `${displayName} (${Math.floor(i / MACHINE_NAMES.length) + 1})`;

    let m: any = {
      id: `MC-${1000 + i}`,
      name: displayName,
      lastUpdated: new Date().toISOString()
    };

    if (isCritical) {
      const s = CRITICAL_SCENARIOS[i % CRITICAL_SCENARIOS.length];
      m.status = 'CRITICAL'; m.health = Math.floor(Math.random()*30)+20; m.prediction = s.prediction; m.rootCause = s.rootCause; m.suggestedActions = s.actions;
      m.temp = Math.floor(Math.random()*(s.tempRange[1]-s.tempRange[0]))+s.tempRange[0];
      m.vibration = parseFloat((Math.random()*(s.vibRange[1]-s.vibRange[0])+s.vibRange[0]).toFixed(1));
    } else if (isWarning) {
      const s = WARNING_SCENARIOS[i % WARNING_SCENARIOS.length];
      m.status = 'WARNING'; m.health = Math.floor(Math.random()*15)+60; m.prediction = s.prediction; m.rootCause = s.rootCause; m.suggestedActions = s.actions;
      m.temp = Math.floor(Math.random()*10)+70; m.vibration = parseFloat((Math.random()*2+3).toFixed(1));
    } else {
      m.status = 'NORMAL'; m.health = Math.floor(Math.random()*20)+81; m.prediction = 'Optimal Performance'; m.rootCause = 'Normal parameters.'; m.suggestedActions = ['No actions required'];
      m.temp = Math.floor(Math.random()*15)+45; m.vibration = parseFloat((Math.random()*1.5).toFixed(1));
    }
    return m;
  });
}

function generateConsumptionData(range: 'Monthly' | 'Quarterly' | 'Yearly'): ConsumptionMetrics {
  const isMonthly = range === 'Monthly';
  const isQuarterly = range === 'Quarterly';
  
  // Multipliers
  const costMult = isMonthly ? 1 : isQuarterly ? 3.2 : 12.5; 
  const efficiencyScore = isMonthly ? 94.2 : isQuarterly ? 88.5 : 91.8;

  const labels = isMonthly 
    ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] 
    : isQuarterly 
    ? ['Month 1', 'Month 2', 'Month 3'] 
    : ['Q1', 'Q2', 'Q3', 'Q4'];

  const trend = labels.map((label) => ({
    label,
    cost: Math.floor((Math.random() * 250000 + 150000) * costMult),
    units: Math.floor((Math.random() * 200 + 50) * (isMonthly ? 1 : isQuarterly ? 3 : 12))
  }));

  const breakdown = [
    { category: "Mechanical", value: 45, color: "bg-indigo-500" },
    { category: "Electrical", value: 30, color: "bg-emerald-500" },
    { category: "Consumables", value: 25, color: "bg-amber-500" }
  ];

  const topParts = [
    { id: "SP-001", name: "Hydraulic Pump", usage: Math.floor(12 * costMult/2), cost: Math.floor(85000 * costMult/3), status: "High Cost" },
    { id: "SP-024", name: "Brake Pad Set", usage: Math.floor(145 * costMult/2), cost: Math.floor(12500 * costMult/3), status: "High Volume" },
    { id: "SP-099", name: "Spindle Bearing", usage: Math.floor(4 * costMult/2), cost: Math.floor(120000 * costMult/3), status: "Critical" },
    { id: "SP-102", name: "Coolant Filter", usage: Math.floor(55 * costMult/2), cost: Math.floor(4500 * costMult/3), status: "Normal" },
    { id: "SP-205", name: "Servo Driver", usage: Math.floor(2 * costMult/2), cost: Math.floor(210000 * costMult/3), status: "Critical" },
  ];

  return {
    trend,
    breakdown,
    topParts,
    kpi: {
      totalCost: trend.reduce((a, b) => a + b.cost, 0),
      totalUnits: trend.reduce((a, b) => a + b.units, 0),
      efficiency: efficiencyScore
    }
  };
}

// ==========================================
// 4. PUBLIC API FUNCTIONS (The ones you import)
// ==========================================

// --- INVENTORY ---
export async function fetchInventory(): Promise<InventoryItem[]> {
  if (typeof window === 'undefined') return [];
  
  // 1. Check Persistence
  const cached = localStorage.getItem('vasus_inventory_v1');
  if (cached) return JSON.parse(cached);

  // 2. Fallback to Mock JSON
  await new Promise(resolve => setTimeout(resolve, 100));
  let rawData: any[] = [];
  if (Array.isArray(db)) rawData = db;
  else if ((db as any).inventory) rawData = (db as any).inventory;

  const mappedData = rawData.map((row: any) => ({
    id: row.Part_ID || row.id || "UNK",
    name: row.Part_Name || row.name || "Unknown Part",
    category: row.Category || row.category || "General",
    stock: row.Current_Stock ?? row.stock ?? 0,
    rop: row.ROP ?? row.rop ?? 0,
    status: (row.Current_Stock ?? 0) <= (row.ROP ?? 0) ? 'Critical' : 'Normal',
    vendor: row.Vendor || row.vendor || "Unknown",
    leadTime: row.Lead_Time_Day ?? row.leadTime ?? 0
  }));

  // 3. Save for later
  localStorage.setItem('vasus_inventory_v1', JSON.stringify(mappedData));
  return mappedData;
}

export async function addInventoryItem(item: InventoryItem) {
  if (typeof window === 'undefined') return;
  const items = await fetchInventory();
  const newItems = [item, ...items]; 
  localStorage.setItem('vasus_inventory_v1', JSON.stringify(newItems));
  return newItems;
}

// --- MACHINES ---
export async function fetchMachines(): Promise<MachineItem[]> {
  if (typeof window === 'undefined') return generateMachines(50); 
  const cached = localStorage.getItem('vasus_machines_v1');
  if (cached) return JSON.parse(cached);
  
  const newMachines = generateMachines(50);
  localStorage.setItem('vasus_machines_v1', JSON.stringify(newMachines));
  return newMachines;
}

export async function updateMachineStatus(id: string, status: string, prediction: string) {
  if (typeof window === 'undefined') return;
  const machines = await fetchMachines();
  const updated = machines.map(m => m.id === id ? { ...m, status, prediction } : m);
  localStorage.setItem('vasus_machines_v1', JSON.stringify(updated));
}

// --- CONSUMPTION ---
export async function fetchConsumptionMetrics(range: 'Monthly' | 'Quarterly' | 'Yearly') {
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateConsumptionData(range);
}

// Legacy support
export async function fetchConsumption() {
    return (db as any).consumptionStats || [];
}