// Re-export the database client and all schema tables.
// Routes import from '../db' so they never need workspace aliases.
export * from '../lib/db/src/index';
