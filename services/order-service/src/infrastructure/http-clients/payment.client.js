function createPaymentClient({ baseUrl, timeoutMs = 3000 }) {
  return {
    async charge({ orderId, amount }) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(`${baseUrl}/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount }),
          signal: controller.signal,
        });

        if (!response.ok) {
          return { success: false, reason: `payment-service respondió ${response.status}` };
        }

        const data = await response.json();
        return { success: true, payment: data };
      } catch (err) {
        if (err.name === 'AbortError') {
          return { success: false, reason: 'timeout: payment-service no respondió a tiempo' };
        }
        return { success: false, reason: `payment-service no disponible: ${err.message}` };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

module.exports = { createPaymentClient };