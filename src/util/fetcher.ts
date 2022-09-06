const axios = require('axios').default;

const CMS_API_URL = process.env.CMS_API_URL;

export async function cmsfetcher<T>(resource: string): Promise<T> {
  const response = await axios.get(`${CMS_API_URL}/items/${resource}`);

  if (response.status === 200) {
    return response.data as unknown as T;
  } else {
    throw new Error("Service Unavailable");
  }
}