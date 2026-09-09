class CashPayment { process(amount, reference) { return { method: 'CASH', amount, reference: reference || 'cash-drawer' }; } }
class CardPayment { process(amount, reference) { return { method: 'CARD', amount, reference: reference || `CARD-${Date.now()}` }; } }
class MobileMoneyPayment { process(amount, reference) { return { method: 'MOBILE_MONEY', amount, reference: reference || `MOMO-${Date.now()}` }; } }
class QrPayment { process(amount, reference) { return { method: 'QR', amount, reference: reference || `QR-${Date.now()}` }; } }
export function createPayment(method, amount, reference) {
  const strategies = { CASH: CashPayment, CARD: CardPayment, MOBILE_MONEY: MobileMoneyPayment, QR: QrPayment };
  const Payment = strategies[method];
  if (!Payment) throw Object.assign(new Error('Unsupported payment method'), { status: 400 });
  return new Payment().process(amount, reference);
}
