import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/fitness.db');
let db: SqlJsDatabase;

async function initDatabase(): Promise<SqlJsDatabase> {
  if (db) return db;

  const SQL = await initSqlJs();

  // 如果数据库文件存在，加载它
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    // 创建新数据库
    db = new SQL.Database();
  }

  // 初始化数据库表
  db.run(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      name TEXT NOT NULL,
      work_duration INTEGER NOT NULL,
      rest_duration INTEGER NOT NULL,
      rounds INTEGER NOT NULL,
      sets INTEGER DEFAULT 1,
      set_rest_duration INTEGER DEFAULT 60,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      template_id TEXT,
      template_name TEXT NOT NULL,
      work_duration INTEGER NOT NULL,
      rest_duration INTEGER NOT NULL,
      rounds INTEGER NOT NULL,
      sets INTEGER DEFAULT 1,
      completed_rounds INTEGER NOT NULL,
      completed_sets INTEGER NOT NULL,
      total_time INTEGER NOT NULL,
      completed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_templates_device ON templates(device_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_records_device ON records(device_id)`);

  // 保存到文件
  saveDatabase();

  return db;
}

function saveDatabase() {
  if (!db) return;

  const data = db.export();
  const buffer = Buffer.from(data);

  // 确保目录存在
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(dbPath, buffer);
}

function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export { initDatabase, getDatabase, saveDatabase };
