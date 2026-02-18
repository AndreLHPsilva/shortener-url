import os from 'os';

export function getPidWorkerId(maxWorkerId: number): number {
  const pid = process.pid;
  const workerId = pid % (maxWorkerId + 1);
  return workerId;
}