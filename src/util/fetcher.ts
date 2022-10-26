const axios = require('axios').default;

type Method = 'post' | 'get' | 'delete' | 'put';

type Config = {
  method: Method;
  headers?: any;
  params?: any;
};

export async function fetcher<T>(config: Config, url: string, data?: any): Promise<T> {
  const response = await axios({
    method: config.method,
    headers: config.headers,
    params: config.params,
    url: url,
    data,
  });

  if (response.status === 200) {
    return response.data as unknown as T;
  } else {
    throw new Error('Service Unavailable');
  }
}
