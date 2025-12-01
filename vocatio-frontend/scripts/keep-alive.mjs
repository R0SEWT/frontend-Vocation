#!/usr/bin/env node

/**
 * Simple keep-alive script that pings the provided endpoints on a fixed cadence.
 * Configure endpoints via command-line arguments or the KEEP_ALIVE_TARGETS env var (comma separated).
 */

const DEFAULT_INTERVAL_MS = Number(process.env.KEEP_ALIVE_INTERVAL_MS ?? 4 * 60 * 1000);
const REQUEST_TIMEOUT_MS = Number(process.env.KEEP_ALIVE_TIMEOUT_MS ?? 8000);

const args = process.argv.slice(2);
const targets =
  args.length > 0
    ? args
    : (process.env.KEEP_ALIVE_TARGETS ?? '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);

if (!targets.length) {
  console.error(
    '❌ Provide at least one endpoint via CLI (node scripts/keep-alive.mjs https://api...) or KEEP_ALIVE_TARGETS.',
  );
  process.exit(1);
}

const abortableFetch = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    console.log(`${new Date().toISOString()} ${url} → ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(`${new Date().toISOString()} ${url} → ERROR ${error.name}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
};

const pingAll = async () => {
  await Promise.all(targets.map((target) => abortableFetch(target, REQUEST_TIMEOUT_MS)));
};

console.log(
  `🔥 Keep-alive started for ${targets.length} endpoint(s). Interval: ${DEFAULT_INTERVAL_MS / 1000}s`,
);

pingAll();

const intervalId = setInterval(pingAll, DEFAULT_INTERVAL_MS);

const cleanup = () => {
  clearInterval(intervalId);
  console.log('👋 Keep-alive stopped.');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);


//https://vocatio.onrender.com/api/v1/auth/login
// node scripts/keep-alive.mjs https://vocatio.onrender.com/api/v1/health https://vocatio.onrender.com/api/v1/dbping
// node scripts/keep-alive.mjs https://vocatio.onrender.com/api/v1/health https://vocatio.onrender.com/api/v1/health/db
