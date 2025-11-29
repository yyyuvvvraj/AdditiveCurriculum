import { NextRequest, NextResponse } from 'next/server';
import { optimizeMaintenanceSchedule } from '@/lib/geneticAlgorithm';
import type { Machine } from '@/lib/geneticAlgorithm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { machines, populationSize = 50, generations = 25, mutationRate = 0.15 } = body;

    if (!machines || !Array.isArray(machines)) {
      return NextResponse.json(
        { error: 'Invalid machines array' },
        { status: 400 }
      );
    }

    // Validate machine objects have required fields
    const validatedMachines: Machine[] = machines.map((m: any) => ({
      id: m.id || `machine-${Math.random()}`,
      name: m.name || 'Unknown Machine',
      health: m.health || 50,
      temp: m.temp || 60,
      vibration: m.vibration || 5,
      lastMaintenance: m.lastMaintenance || 10,
      failureRisk: m.failureRisk || 30
    }));

    // Run genetic algorithm
    const result = optimizeMaintenanceSchedule(
      validatedMachines,
      populationSize,
      generations,
      mutationRate
    );

    return NextResponse.json({
      success: true,
      optimization: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GA optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize maintenance schedule' },
      { status: 500 }
    );
  }
}
