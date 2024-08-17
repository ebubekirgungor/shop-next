type Method = "POST" | "PUT" | "DELETE";
type Body = Array<Object> | Object;
type Data = { message: string; body: any };
type Headers = {
  "Content-Type": string;
};

async function fetcher(
  url: string,
  method: Method,
  headers?: Headers,
  body?: string | FormData
) {
  const response = await fetch(url, {
    method,
    headers,
    body: body,
  });

  return await response.json().then((data: Data) => {
    return {
      status: response.status,
      message: data.message,
      body: data.body,
    };
  });
}

export async function jsonFetcher(url: string, method: Method, body?: Body) {
  return await fetcher(
    url,
    method,
    {
      "Content-Type": "application/json",
    },
    JSON.stringify(body)
  );
}

export async function formFetcher(
  url: string,
  method: Method,
  body?: FormData
) {
  return await fetcher(url, method, undefined, body);
}
