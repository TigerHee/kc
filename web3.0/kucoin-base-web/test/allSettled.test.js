import allSettled from 'utils/allSettled';

describe('allSettled', () => {
  it('should resolve with an array of fulfilled promises', async () => {
    const promises = [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ];
    const result = await allSettled(promises);
    expect(result).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 2 },
      { status: 'fulfilled', value: 3 },
    ]);
  });

  it('should resolve with an array of rejected promises', async () => {
    const promises = [
      Promise.reject(new Error('Error 1')),
      Promise.reject(new Error('Error 2')),
    ];
    const result = await allSettled(promises);
    expect(result).toEqual([
      { status: 'rejected', reason: new Error('Error 1') },
      { status: 'rejected', reason: new Error('Error 2') },
    ]);
  });

  it('should resolve with an array of mixed promises (fulfilled and rejected)', async () => {
    const promises = [
      Promise.resolve(1),
      Promise.reject(new Error('Error 1')),
      Promise.resolve(2),
      Promise.reject(new Error('Error 2')),
    ];
    const result = await allSettled(promises);
    expect(result).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: new Error('Error 1') },
      { status: 'fulfilled', value: 2 },
      { status: 'rejected', reason: new Error('Error 2') },
    ]);
  });

  it('should resolve with an empty array if no promises are passed', async () => {
    const promises = [];
    const result = await allSettled(promises);
    expect(result).toEqual([]);
  });

  it('should handle promises that resolve to non-Promise values', async () => {
    const promises = [
      1,               // Non-Promise value
      Promise.resolve(2),
      'string',        // Non-Promise value
      Promise.reject(new Error('Rejection')),
    ];
    const result = await allSettled(promises);
    expect(result).toEqual([
      { status: 'fulfilled', value: 1 }, // Non-Promise value treated as a resolved value
      { status: 'fulfilled', value: 2 },
      { status: 'fulfilled', value: 'string' }, // Non-Promise value treated as a resolved value
      { status: 'rejected', reason: new Error('Rejection') },
    ]);
  });
});
