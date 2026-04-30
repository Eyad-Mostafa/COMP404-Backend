import test from 'node:test';
import assert from 'node:assert';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import { hash } from '../../utils/HashAndCompare.js';

test('AuthService - registerUser success', async (t) => {
  const originalFind = AuthRepository.findUserByEmail;
  const originalCreate = AuthRepository.createUser;

  t.after(() => {
    AuthRepository.findUserByEmail = originalFind;
    AuthRepository.createUser = originalCreate;
  });

  AuthRepository.findUserByEmail = async () => null;
  AuthRepository.createUser = async (data) => ({ id: 1, ...data });

  const user = await AuthService.registerUser(
    'Ahmed',
    'TEST@test.com',
    '123456',
    '123456'
  );

  assert.strictEqual(user.name, 'Ahmed');
  assert.strictEqual(user.email, 'test@test.com'); // lowercased

  // password should be hashed (not plain)
  assert.ok(user.password);
  assert.notStrictEqual(user.password, '123456');
});

test('AuthService - registerUser fails (password mismatch)', async () => {
  await assert.rejects(
    () =>
      AuthService.registerUser(
        'Ahmed',
        'test@test.com',
        '123456',
        'wrong'
      ),
    { message: 'Password and Confirm Password must match' }
  );
});

test('AuthService - registerUser fails (email exists)', async (t) => {
  const originalFind = AuthRepository.findUserByEmail;

  t.after(() => {
    AuthRepository.findUserByEmail = originalFind;
  });

  AuthRepository.findUserByEmail = async () => ({ id: 1 });

  await assert.rejects(
    () =>
      AuthService.registerUser(
        'Ahmed',
        'test@test.com',
        '123456',
        '123456'
      ),
    { message: 'Email is Already Exist' }
  );
});

test('AuthService - loginUser success', async (t) => {
  const originalFind = AuthRepository.findUserByEmail;

  t.after(() => {
    AuthRepository.findUserByEmail = originalFind;
  });

  const hashedPassword = hash({ plaintext: '123456' });

  AuthRepository.findUserByEmail = async () => ({
    email: 'test@test.com',
    password: hashedPassword,
  });

  const user = await AuthService.loginUser('TEST@test.com', '123456');

  assert.strictEqual(user.email, 'test@test.com');
});

test('AuthService - loginUser fails (invalid email)', async (t) => {
  const originalFind = AuthRepository.findUserByEmail;

  t.after(() => {
    AuthRepository.findUserByEmail = originalFind;
  });

  AuthRepository.findUserByEmail = async () => null;

  await assert.rejects(
    () => AuthService.loginUser('wrong@test.com', '123456'),
    { message: 'Invalid Login Data' }
  );
});

test('AuthService - loginUser fails (wrong password)', async (t) => {
  const originalFind = AuthRepository.findUserByEmail;

  t.after(() => {
    AuthRepository.findUserByEmail = originalFind;
  });

  const hashedPassword = hash({ plaintext: 'correct' });

  AuthRepository.findUserByEmail = async () => ({
    email: 'test@test.com',
    password: hashedPassword,
  });

  await assert.rejects(
    () => AuthService.loginUser('test@test.com', 'wrong'),
    { message: 'Invalid Login Data' }
  );
});