import { fetcher } from "../fetcher";

const API_KEY = process.env.POSITION_STACK_KEY;
const API_HOST_URL = process.env.POSITION_STACK_URL;

export async function placeFetcher<T>(address: string): Promise<T> {
  const params = {
    access_key: API_KEY,
    query: address,
  };

  return await fetcher(
    {
      method: 'get',
      params,
    },
    `${API_HOST_URL}/forward`,
  );
}