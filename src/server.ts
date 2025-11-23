// src/server.ts
import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// socket connection typing
io.on('connection', (socket: Socket) => {
  console.log('socket connected', socket.id);

  socket.on('subscribe', (payload: { partId: string }) => {
    if (payload?.partId) {
      socket.join(payload.partId);
      console.log(`socket ${socket.id} subscribed to ${payload.partId}`);
    }
  });

  socket.on('unsubscribe', (payload: { partId: string }) => {
    if (payload?.partId) {
      socket.leave(payload.partId);
      console.log(`socket ${socket.id} unsubscribed from ${payload.partId}`);
    }
  });

  socket.on('get_parts', async () => {
    try {
      const parts = await prisma.part.findMany();
      socket.emit('parts_list', parts);
    } catch (err) {
      console.error('get_parts error', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

// Zod validation schema for incoming updates
const UpdateSchema = z.object({
  partId: z.string().min(1),
  partName: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  currentStock: z.number().int(),
  rop: z.number().int().nullable().optional(),
  warningLevel: z.number().int().nullable().optional(),
  vendor: z.string().nullable().optional(),
  leadTimeDay: z.number().int().nullable().optional(),
  lastUpdated: z.string().nullable().optional(),
  note: z.string().nullable().optional()
});

// GET all parts (snapshot)
app.get('/api/parts', async (req: Request, res: Response) => {
  try {
    const parts = await prisma.part.findMany();
    res.json(parts);
  } catch (err) {
    console.error('GET /api/parts error', err);
    res.status(500).json({ error: 'internal' });
  }
});

/** history endpoint: /api/part/:partId/history?limit=100 */
app.get('/api/part/:partId/history', async (req: Request, res: Response) => {
  const partId = req.params.partId;
  const limit = Math.min(1000, parseInt((req.query.limit as string) || '200', 10));
  try {
    const part = await prisma.part.findUnique({ where: { partId } });
    if (!part) return res.status(404).json({ error: 'part not found' });

    const history = await prisma.partHistory.findMany({
      where: { partRef: part.id },      // use partRef FK
      orderBy: { changeAt: 'asc' },
      take: limit
    });
    res.json({ part, history });
  } catch (err) {
    console.error('GET /api/part/:partId/history error', err);
    res.status(500).json({ error: 'internal' });
  }
});

/**
 * POST /api/update
 * body: { partId, currentStock, ... }
 * Upserts Part (snapshot) and creates PartHistory (append)
 * Emits websocket event to room partId
 */
app.post('/api/update', async (req: Request, res: Response) => {
  const parse = UpdateSchema.safeParse(req.body);
  if (!parse.success) {
    // use .format() to give structured errors
    return res.status(400).json({ error: parse.error.format() });
  }
  const payload = parse.data;

  // parse lastUpdated if given
  const lastUpdated = payload.lastUpdated ? new Date(payload.lastUpdated) : new Date();

  try {
    // upsert snapshot by partId
    const upserted = await prisma.part.upsert({
      where: { partId: payload.partId },
      update: {
        partName: payload.partName ?? undefined,
        category: payload.category ?? undefined,
        currentStock: payload.currentStock,
        rop: payload.rop ?? undefined,
        warningLevel: payload.warningLevel ?? undefined,
        vendor: payload.vendor ?? undefined,
        leadTimeDay: payload.leadTimeDay ?? undefined,
        lastUpdated
      },
      create: {
        partId: payload.partId,
        partName: payload.partName ?? null,
        category: payload.category ?? null,
        currentStock: payload.currentStock,
        rop: payload.rop ?? null,
        warningLevel: payload.warningLevel ?? null,
        vendor: payload.vendor ?? null,
        leadTimeDay: payload.leadTimeDay ?? null,
        lastUpdated
      }
    });

    // append history via relation connect
    const hist = await prisma.partHistory.create({
      data: {
        part: { connect: { id: upserted.id } },
        stock: payload.currentStock,
        changeAt: lastUpdated,
        note: payload.note ?? null
      }
    });

    // Broadcast to subscribers of this partId (room)
    const broadcastPayload = {
      part: upserted,
      historyEntry: { id: hist.id, stock: hist.stock, changeAt: hist.changeAt, note: hist.note }
    };

    io.to(payload.partId).emit('part_update', broadcastPayload);
    io.emit('part_updated_global', { partId: payload.partId, currentStock: payload.currentStock });

    return res.json({ ok: true, part: upserted, history: hist });
  } catch (err) {
    console.error('POST /api/update error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

const PORT = parseInt(process.env.PORT || '4000', 10);
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
