import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../db/database';

const router = Router();

interface Record {
  id: string;
  device_id: string;
  template_id: string | null;
  template_name: string;
  work_duration: number;
  rest_duration: number;
  rounds: number;
  sets: number;
  completed_rounds: number;
  completed_sets: number;
  total_time: number;
  completed_at: string;
}

// 获取训练记录
router.get('/', (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const db = getDatabase();

  const stmt = db.prepare('SELECT * FROM records WHERE device_id = ? ORDER BY completed_at DESC LIMIT ? OFFSET ?');
  stmt.bind([deviceId, limit, offset]);

  const records: Record[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Record;
    records.push(row);
  }
  stmt.free();

  const countStmt = db.prepare('SELECT COUNT(*) as count FROM records WHERE device_id = ?');
  countStmt.bind([deviceId]);
  countStmt.step();
  const total = (countStmt.getAsObject() as { count: number }).count;
  countStmt.free();

  res.json({
    records,
    total,
    limit,
    offset
  });
});

// 保存训练记录
router.post('/', (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const {
    template_id,
    template_name,
    work_duration,
    rest_duration,
    rounds,
    sets = 1,
    completed_rounds,
    completed_sets,
    total_time
  } = req.body;

  if (!template_name || work_duration === undefined || rest_duration === undefined ||
      rounds === undefined || completed_rounds === undefined ||
      completed_sets === undefined || total_time === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuidv4();
  const completed_at = new Date().toISOString();

  const db = getDatabase();
  db.run(
    `INSERT INTO records (id, device_id, template_id, template_name, work_duration, rest_duration,
                          rounds, sets, completed_rounds, completed_sets, total_time, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, deviceId, template_id || null, template_name, work_duration, rest_duration,
     rounds, sets, completed_rounds, completed_sets, total_time, completed_at]
  );
  saveDatabase();

  const record: Record = {
    id,
    device_id: deviceId,
    template_id: template_id || null,
    template_name,
    work_duration,
    rest_duration,
    rounds,
    sets,
    completed_rounds,
    completed_sets,
    total_time,
    completed_at
  };

  res.status(201).json(record);
});

// 获取统计数据
router.get('/stats', (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT
      COUNT(*) as total_workouts,
      COALESCE(SUM(total_time), 0) as total_time,
      COALESCE(SUM(completed_rounds), 0) as total_rounds,
      COALESCE(AVG(total_time), 0) as avg_workout_time
    FROM records
    WHERE device_id = ?
  `);
  stmt.bind([deviceId]);
  stmt.step();
  const stats = stmt.getAsObject();
  stmt.free();

  res.json(stats);
});

export default router;
