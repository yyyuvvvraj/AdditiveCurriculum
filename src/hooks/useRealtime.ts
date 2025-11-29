"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { optimizeMaintenanceSchedule, GeneticAlgorithmResult, Machine as MachineForGA } from "@/lib/geneticAlgorithm";
import { fetchMachines } from "@/lib/api";

export type Alert = any;
export type Part = any;
export type Machine = any;

export default function useRealtime() {
  const socketRef = useRef<Socket | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [partUpdate, setPartUpdate] = useState<Part | null>(null);
  const [machinesUpdate, setMachinesUpdate] = useState<Machine | null>(null);
  const [maintenanceOptimization, setMaintenanceOptimization] = useState<GeneticAlgorithmResult | null>(null);
  const machinesRef = useRef<Machine[]>([]);

  // Initialize GA with mock machine data
  useEffect(() => {
    const initializeMockData = async () => {
      try {
        const machines = await fetchMachines();
        machinesRef.current = machines;
        
        // Run GA optimization on mock data
        if (machines.length > 0) {
          // Transform MachineItem to GA-compatible format
          const gaCompatibleMachines = machines.map(m => ({
            id: m.id,
            name: m.name,
            health: m.health,
            temp: m.temp,
            vibration: m.vibration,
            lastMaintenance: Math.floor(Math.random() * 30) + 5, // days ago
            failureRisk: m.status === 'CRITICAL' ? 80 : m.status === 'WARNING' ? 50 : 20
          })) as MachineForGA[];
          
          const gaResult = optimizeMaintenanceSchedule(
            gaCompatibleMachines,
            40, // populationSize
            15, // generations
            0.2  // mutationRate
          );
          setMaintenanceOptimization(gaResult);
        }
      } catch (error) {
        console.error("Failed to initialize GA with mock data:", error);
      }
    };

    initializeMockData();
  }, []);

  // Optional: Try to connect to WebSocket for real-time updates if available
  useEffect(() => {
    const url = process.env.REACT_APP_API_WS || "http://localhost:4000";
    const s = io(url, { 
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3,
      forceNew: true
    });
    socketRef.current = s;

    s.on("connect", () => console.debug("ws connected", s.id));
    s.on("alert:new", (a: Alert) => setAlerts((prev) => [a, ...prev]));
    s.on("alert:ack", (a: Alert) => setAlerts((prev) => prev.filter((x) => x.id !== a.id)));
    s.on("part:update", (p: Part) => setPartUpdate(p));
    s.on("machine:update", (m: Machine) => {
      setMachinesUpdate(m);
      machinesRef.current = [...machinesRef.current.filter(x => x.id !== m.id), m];
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  const ackAlert = async (id: number, token?: string) => {
    await fetch(`/api/alerts/${id}/ack`, { method: "POST", headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), "content-type": "application/json" } });
  };

  return { alerts, partUpdate, machinesUpdate, ackAlert, maintenanceOptimization };
}
