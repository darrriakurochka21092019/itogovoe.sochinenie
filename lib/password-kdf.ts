import { pbkdf2 } from 'node:crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

type NativeDeriver = (password: string, salt: string, iterations: number) => Promise<Buffer>;

const nativeDerive: NativeDeriver = (password, salt, iterations) =>
  new Promise((resolve, reject) =>
    pbkdf2(password, salt, iterations, 32, 'sha256', (error, key) =>
      error ? reject(error) : resolve(key),
    ),
  );

// Some hosted Workers cap the native PBKDF2 implementation at 100,000
// iterations, although Node.js and local Workers accept the full work factor.
// The portable implementation computes the SAME standard PBKDF2 output;
// neither the iteration count nor the stored password format is reduced.
export function createPasswordDeriver(native: NativeDeriver = nativeDerive): NativeDeriver {
  let nativeIterationLimit = false;
  return async (password, salt, iterations) => {
    if (!nativeIterationLimit || iterations <= 100_000) {
      try {
        return await native(password, salt, iterations);
      } catch (error) {
        if (
          iterations <= 100_000 ||
          !(error instanceof Error) ||
          !/iteration counts above \d+ are not supported/i.test(error.message)
        ) {
          throw error;
        }
        nativeIterationLimit = true;
      }
    }
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    const saltBytes = encoder.encode(salt);
    try {
      return Buffer.from(await pbkdf2Async(sha256, passwordBytes, saltBytes, {
        c: iterations,
        dkLen: 32,
        asyncTick: 10,
      }));
    } finally {
      passwordBytes.fill(0);
    }
  };
}

export const derivePasswordKey = createPasswordDeriver();
