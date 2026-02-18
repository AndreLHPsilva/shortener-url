import { IIdGenerator } from "@application/ports/types";
import { EPOCH, MAX_SEQUENCE, MAX_WORKER_ID, MAX_WORKER_ID_NUMBER, TIMESTAMP_SHIFT, WORKER_ID_SHIFT } from "./snowFlake.constants";
import { WorkerIdInvalidError } from "@shared/errors/WorkerIdInvalidError";
import { InvalidLastTimestampError } from "@shared/errors/InvalidLastTimestampError";

export class Snowflake implements IIdGenerator {
  private lastTimestamp: bigint = 0n;
  private sequence: bigint = 0n;
  private readonly workerId: bigint;

  constructor(workerId: number) {
    if (workerId < 0 || workerId > MAX_WORKER_ID_NUMBER) {
      throw new WorkerIdInvalidError();
    }
    this.workerId = BigInt(workerId);
  }

  private currentTime(): bigint {
    return BigInt(Date.now());
  }

  private waitNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.currentTime();
    while (timestamp <= lastTimestamp) {
      timestamp = this.currentTime();
    }
    return timestamp;
  }

  public nextId(): bigint {
    let timestamp = this.currentTime();

    if (timestamp < this.lastTimestamp) {
      throw new InvalidLastTimestampError();
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & MAX_SEQUENCE;
      if (this.sequence === 0n) {
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const timestampPart = (timestamp - EPOCH) << TIMESTAMP_SHIFT;
    const workerPart = this.workerId << WORKER_ID_SHIFT;
    const sequencePart = this.sequence;

    const id = timestampPart | workerPart | sequencePart;
    return id;
  }

  public static deconstruct(id: bigint) {
    const timestamp = (id >> TIMESTAMP_SHIFT) + EPOCH;
    const workerId = (id >> WORKER_ID_SHIFT) & MAX_WORKER_ID;
    const sequence = id & MAX_SEQUENCE;

    return {
      timestamp: Number(timestamp),
      date: new Date(Number(timestamp)),
      workerId: Number(workerId),
      sequence: Number(sequence),
    };
  }
}
