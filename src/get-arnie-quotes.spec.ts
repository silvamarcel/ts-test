import { getResult, getArnieQuotes, getKeyNameByStatus } from './get-arnie-quotes';

const urls = [
  'http://www.smokeballdev.com/arnie0',
  'http://www.smokeballdev.com/arnie1',
  'http://www.smokeballdev.com/arnie2',
  'http://www.smokeballdev.com/arnie3',
];

test('expect no throws', () => {
  expect.assertions(1);
  expect(async () => await getArnieQuotes(urls)).not.toThrow();
});

test('responses to be correct', async () => {
  expect.assertions(5);

  const results = await getArnieQuotes(urls);

  expect(results.length).toBe(4);

  expect(results[0]).toEqual({ 'Arnie Quote': 'Get to the chopper' });
  expect(results[1]).toEqual({ 'Arnie Quote': 'MY NAME IS NOT QUAID' });
  expect(results[2]).toEqual({ 'Arnie Quote': `What's wrong with Wolfie?` });
  expect(results[3]).toEqual({ 'FAILURE': 'Your request has been terminated' });
});

test('code to be executed in less than 400ms', async () => {
  expect.assertions(2);

  const startTime = process.hrtime();
  await getArnieQuotes(urls);
  const [ seconds, nanos ] = process.hrtime(startTime);

  expect(seconds).toBe(0);
  expect(nanos / 1000 / 1000).toBeLessThan(400);
});

describe('getKeyNameByStatus()', () => {
  test('return Arnie Quote when status is 200', async () => {
    expect(getKeyNameByStatus(200)).toEqual('Arnie Quote');
  });

  test('return FAILURE when status is NOT 200', async () => {
    expect(getKeyNameByStatus(500)).toEqual('FAILURE');
  });
});

describe('getResult()', () => {
  test('return Arnie Quote key with any message', async () => {
    const response = await getResult(Promise.resolve({
      status: 200,
      body: JSON.stringify({ message: 'any message' }),
    }));
    expect(response).toEqual({ 'Arnie Quote': 'any message' });
  });

  test('return FAILURE key with any message', async () => {
    const response = await getResult(Promise.resolve({
      status: 400,
      body: JSON.stringify({ message: 'any message' }),
    }));
    expect(response).toEqual({ 'FAILURE': 'any message' });
  });
});
