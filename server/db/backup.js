/**
 * BOLDDEE RENTALS — DATABASE BACKUP & RESTORE UTILITY
 * Conforms to: NFR-003, NFR-005, Phase 3 Reliability
 * 
 * Usage:
 *   node server/db/backup.js backup            - Creates a timestamped WAL snapshot in data/backups/
 *   node server/db/backup.js restore <file>    - Safely restores from backup with safety validation
 *   node server/db/backup.js list              - Lists all available snapshots
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../data/bolddee.db');
const BACKUP_DIR = path.join(__dirname, '../../data/backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export function performBackup() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ Source database file not found at: ${DB_PATH}`);
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `bolddee-backup-${timestamp}.db`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  console.log(`📦 Initiating hot backup of ${DB_PATH}...`);

  try {
    const db = new Database(DB_PATH);
    // Use SQLite's online backup API for safe, concurrent-safe snapshots even under load
    db.backup(backupFilePath)
      .then(() => {
        const stats = fs.statSync(backupFilePath);
        console.log(`✅ Backup successfully created: ${backupFileName} (${(stats.size / 1024).toFixed(2)} KB)`);
        db.close();
      })
      .catch((err) => {
        console.error('❌ Hot backup failed:', err);
        db.close();
        process.exit(1);
      });
  } catch (err) {
    console.error('❌ Failed to open database for backup:', err);
    process.exit(1);
  }
}

export function performRestore(backupFileName) {
  if (!backupFileName) {
    console.error('❌ Please specify a backup file name to restore.');
    console.log('Usage: node server/db/backup.js restore <filename>');
    process.exit(1);
  }

  const targetBackup = path.isAbsolute(backupFileName)
    ? backupFileName
    : path.join(BACKUP_DIR, backupFileName);

  if (!fs.existsSync(targetBackup)) {
    console.error(`❌ Specified backup file does not exist: ${targetBackup}`);
    process.exit(1);
  }

  console.log(`⚠️ Restoring database from: ${targetBackup}`);

  // Create safety pre-restore backup of current db if it exists
  if (fs.existsSync(DB_PATH)) {
    const preRestoreFile = path.join(BACKUP_DIR, `pre-restore-safety-${Date.now()}.db`);
    fs.copyFileSync(DB_PATH, preRestoreFile);
    console.log(`🛡️ Safety snapshot of existing database saved to: ${preRestoreFile}`);
  }

  try {
    fs.copyFileSync(targetBackup, DB_PATH);
    // Verify restored database integrity
    const db = new Database(DB_PATH);
    const result = db.pragma('integrity_check');
    console.log(`✅ Integrity check result:`, result);
    db.close();
    console.log(`🎉 Database restoration complete!`);
  } catch (err) {
    console.error('❌ Failed to restore database:', err);
    process.exit(1);
  }
}

export function listBackups() {
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.db'));
  console.log(`\n📋 Available Database Snapshots in ${BACKUP_DIR}:`);
  if (files.length === 0) {
    console.log('  (No snapshots found)');
    return;
  }
  for (const f of files) {
    const stats = fs.statSync(path.join(BACKUP_DIR, f));
    console.log(`  • ${f} (${(stats.size / 1024).toFixed(2)} KB, created: ${stats.mtime.toLocaleString()})`);
  }
  console.log('');
}

// CLI Command Dispatcher
const command = process.argv[2] || 'backup';
const targetArg = process.argv[3];

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  switch (command) {
    case 'backup':
      performBackup();
      break;
    case 'restore':
      performRestore(targetArg);
      break;
    case 'list':
      listBackups();
      break;
    default:
      console.log('Commands: backup | restore <file> | list');
  }
}
