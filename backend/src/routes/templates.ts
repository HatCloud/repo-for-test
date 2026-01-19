import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, saveDatabase } from '../db/database';

const router = Router();

interface Template {
  id: string;
  device_id: string;
  name: string;
  work_duration: number;
  rest_duration: number;
  rounds: number;
  sets: number;
  set_rest_duration: number;
  created_at: string;
}

// 获取模板列表
router.get('/', (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM templates WHERE device_id = ? ORDER BY created_at DESC');
  stmt.bind([deviceId]);

  const templates: Template[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Template;
    templates.push(row);
  }
  stmt.free();

  res.json(templates);
});

// 创建模板
router.post('/', (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const { name, work_duration, rest_duration, rounds, sets = 1, set_rest_duration = 60 } = req.body;

  if (!name || !work_duration || !rest_duration || !rounds) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuidv4();
  const created_at = new Date().toISOString();

  const db = getDatabase();
  db.run(
    `INSERT INTO templates (id, device_id, name, work_duration, rest_duration, rounds, sets, set_rest_duration, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, deviceId, name, work_duration, rest_duration, rounds, sets, set_rest_duration, created_at]
  );
  saveDatabase();

  const template: Template = {
    id,
    device_id: deviceId,
    name,
    work_duration,
    rest_duration,
    rounds,
    sets,
    set_rest_duration,
    created_at
  };

  res.status(201).json(template);
});

// 删除模板
router.delete('/:id', (req: Request, res: Response) => {
  const deviceId = req.headers['x-device-id'] as string;
  const { id } = req.params;

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }

  const db = getDatabase();

  // 先检查模板是否存在
  const stmt = db.prepare('SELECT id FROM templates WHERE id = ? AND device_id = ?');
  stmt.bind([id, deviceId]);
  const exists = stmt.step();
  stmt.free();

  if (!exists) {
    return res.status(404).json({ error: 'Template not found' });
  }

  db.run('DELETE FROM templates WHERE id = ? AND device_id = ?', [id, deviceId]);
  saveDatabase();

  res.status(204).send();
});

export default router;
