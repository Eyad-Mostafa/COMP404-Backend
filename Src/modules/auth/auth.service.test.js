import test from 'node:test';
import assert from 'node:assert';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';

test('AuthService - registerUser successfully', async (t) => {
  const originalFind = AuthRepository.findUserByEmail;
  const originalCreate = AuthRepository.createUser;

  AuthRepository.findUserByEmail = async () => null;
  AuthRepository.createUser = async (data) => ({ id: 1, ...data });

  const user = await AuthService.registerUser('Ahmed', 'test@test.com', '123456', '123456');
  
  assert.strictEqual(user.name, 'Ahmed');
  assert.strictEqual(user.email, 'test@test.com');

  AuthRepository.findUserByEmail = originalFind;
  AuthRepository.createUser = originalCreate;
});

test('AuthService - registerUser fails if passwords mismatch', async (t) => {
  try {
    await AuthService.registerUser('Ahmed', 'test@test.com', '123456', 'wrong');
    assert.fail('Should have thrown error');
  } catch (err) {
    assert.strictEqual(err.message, 'Password and Confirm Password must match');
  }
});

test('AuthService - loginUser fails with invalid email', async (t) => {
  const originalFind = AuthRepository.findUserByEmail;
  AuthRepository.findUserByEmail = async () => null;

  try {
    await AuthService.loginUser('wrong@test.com', '123456');
    assert.fail('Should have thrown error');
  } catch (err) {
    assert.strictEqual(err.message, 'Invalid Login Data');
  }

  AuthRepository.findUserByEmail = originalFind;
});
