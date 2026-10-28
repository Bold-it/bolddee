/**
 * BOLDDEE RENTALS — DATABASE RESTORATION INTEGRITY TEST
 * Conforms to: Phase 3 Reliability & Disaster Recovery (NFR-007)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/bolddee.db');
const BACKUP_DIR = path.join(__dirname, '../data/backups');
const SCRATCH_RESTORE_DB = path.join(__dirname, '../data/scratch_restore.db');

async function testBackupAndRestore() {
  console.log('🔄 [TEST] Starting Database Hot Backup and Scratch Restore Test...');

  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Primary database does not exist at ${DB_PATH}`);
  }

  // 1. Take a hot snapshot
  const timestamp = Date.now();
  const backupFileName = `test-backup-${timestamp}.db`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  const srcDb = new Database(DB_PATH);
  await srcDb.backup(backupFilePath);
  srcDb.close();
  console.log(`  ✅ Hot backup created: ${backupFileName}`);

  // 2. Perform restoration into scratch DB
  if (fs.existsSync(SCRATCH_RESTORE_DB)) {
    fs.unlinkSync(SCRATCH_RESTORE_DB);
  }

  fs.copyFileSync(backupFilePath, SCRATCH_RESTORE_DB);
  console.log(`  ✅ Restored snapshot into scratch DB: ${SCRATCH_RESTORE_DB}`);

  // 3. Verify integrity of restored scratch DB
  const restoredDb = new Database(SCRATCH_RESTORE_DB);
  const integrity = restoredDb.pragma('integrity_check');
  console.log('  ✅ Integrity check result:', integrity);
  if (integrity[0]?.integrity_check !== 'ok') {
    throw new Error('Restored database integrity check failed!');
  }

  // 4. Verify data records in scratch DB
  const userCount = restoredDb.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const productCount = restoredDb.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const assetCount = restoredDb.prepare('SELECT COUNT(*) as count FROM rental_assets').get().count;
  const settingCount = restoredDb.prepare('SELECT COUNT(*) as count FROM settings').get().count;

  console.log(`  📊 Verification metrics: ${userCount} users, ${productCount} products, ${assetCount} rental assets, ${settingCount} settings.`);

  if (userCount === 0 || productCount === 0) {
    throw new Error('Restored database contains 0 users or products!');
  }

  restoredDb.close();

  // 5. Cleanup scratch files
  fs.unlinkSync(SCRATCH_RESTORE_DB);
  fs.unlinkSync(backupFilePath);
  console.log('  🧹 Cleaned up scratch test databases.');

  console.log('🎉 [PASS] Backup & Scratch Restore Test successfully verified!\n');
}

testBackupAndRestore().catch((err) => {
  console.error('❌ Restore test failed:', err);
  process.exit(1);
});
