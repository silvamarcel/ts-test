import { httpGet } from './mock-http-interface';

type TResult = Record<string, string>;

export const getKeyNameByStatus = (status: number): string => {
  return status === 200 ? 'Arnie Quote' : 'FAILURE';
};

export const getResult = async (response: Promise<{ body: string; status: number }>) => {
  const result = await response;
  const key = getKeyNameByStatus(result.status);
  const value = JSON.parse(result.body)['message'];
  return {
    [key]: value,
  }
}

export const getArnieQuotes = async (urls : string[]) : Promise<TResult[]> => {
  const results: Promise<TResult>[] = [];
  for (const url of urls) {
    results.push(getResult(httpGet(url)));
  }
  return Promise.all(results);
};
