import test from 'node:test';
import assert from 'node:assert/strict';
import { createPayment } from '../models/paymentFactory.js';
test('payment factory creates supported payment strategies', () => { assert.equal(createPayment('CASH', 10).method, 'CASH'); assert.equal(createPayment('QR', 10).method, 'QR'); });
test('payment factory rejects unsupported methods', () => { assert.throws(() => createPayment('CHEQUE', 10), /Unsupported payment method/); });
