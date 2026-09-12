const { calculateTotal, getPrice } = require('./pricing.service');

describe('pricing.service', () => {
  test('calcula el total multiplicando precio por cantidad', () => {
    expect(calculateTotal('laptop', 2)).toBe(3000);
  });

  test('devuelve 0 para un producto que no existe en el catálogo', () => {
    expect(calculateTotal('teclado', 5)).toBe(0);
  });

  test('getPrice devuelve el precio correcto de un producto conocido', () => {
    expect(getPrice('mouse')).toBe(20);
  });
});