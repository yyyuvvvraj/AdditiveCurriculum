"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type Alert = any;
export type Part = any;
export type Machine = any;

export default function useRealtime() {
  const socketRef = useRef<Socket | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [partUpdate, setPartUpdate] = useState<Part | null>(null);
  const [machinesUpdate, setMachinesUpdate] = useState<Machine | null>(null);

  useEffect(() => {
    const url = process.env.REACT_APP_API_WS || "http://localhost:4000";
    const s = io(url);
    socketRef.current = s;

    s.on("connect", () => console.debug("ws connected", s.id));
    s.on("alert:new", (a: Alert) => setAlerts((prev) => [a, ...prev]));
    s.on("alert:ack", (a: Alert) => setAlerts((prev) => prev.filter((x) => x.id !== a.id)));
    s.on("part:update", (p: Part) => setPartUpdate(p));
    s.on("machine:update", (m: Machine) => setMachinesUpdate(m));

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  const ackAlert = async (id: number, token?: string) => {
    await fetch(`/api/alerts/${id}/ack`, { method: "POST", headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), "content-type": "application/json" } });
  };

  return { alerts, partUpdate, machinesUpdate, ackAlert };
}
