import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pbkdf2Sync } from 'node:crypto';
import { createPasswordDeriver } from '../lib/password-kdf.ts';

const ceilingError = () => new Error(
  'Pbkdf2 failed: iteration counts above 100000 are not supported (requested 600000).',
);

test('hosted 100,000-iteration ceiling preserves the exact 600,000-iteration output', async () => {
  let calls = 0;
  const derive = createPasswordDeriver(async () => { calls++; throw ceilingError(); });
  const password = 'Public regression fixture: not an account password';
  const salt = '0123456789abcdef'.repeat(4);
  const actual = await derive(password, salt, 600_000);
  assert.deepEqual(actual, pbkdf2Sync(password, salt, 600_000, 32, 'sha256'));
  assert.notDeepEqual(actual, pbkdf2Sync(password, salt, 100_000, 32, 'sha256'));
  await derive(password + '2', salt, 600_000);
  assert.equal(calls, 1, 'cache only the identified native iteration ceiling');
});

test('portable hashing preserves UTF-8 passwords and salt semantics', async () => {
  const derive = createPasswordDeriver(async () => { throw ceilingError(); });
  const password = 'Тестовый пароль — литература 2026';
  const salt = 'Соль для открытого тестового примера';
  assert.deepEqual(
    await derive(password, salt, 600_000),
    pbkdf2Sync(password, salt, 600_000, 32, 'sha256'),
  );
});

test('native implementation remains preferred when it supports the work factor', async () => {
  let calls = 0;
  const expected = Buffer.alloc(32, 42);
  const derive = createPasswordDeriver(async (_p, _s, count) => {
    assert.equal(count, 600_000);
    calls++;
    return expected;
  });
  assert.equal(await derive('fixture', 'salt', 600_000), expected);
  assert.equal(calls, 1);
});

test('unrelated crypto failures propagate instead of silently changing the algorithm', async () => {
  const error = new Error('Unexpected native crypto failure');
  const derive = createPasswordDeriver(async () => { throw error; });
  await assert.rejects(derive('fixture', 'salt', 600_000), e => e === error);
});
