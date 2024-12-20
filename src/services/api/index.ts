function buildQueryString(objectParam: any) {
  let query = Object.keys(objectParam)
      .map(param => param + "=" + objectParam[param])
      .join('&');

  return query;
}

async function raw(url: string, params: any, data_key: string | undefined) {
  try {
      let res = (await fetch(url, params).then((response: any) => {
          return response.json()
      }));
      if (!!res) {
          return [null, res];
      } else {
          return [res.msg || "API Error", null];
      }
  } catch (err) {
      console.warn(url, params, err);
      return [`error.operation_failed: ${err}, url: ${url}`, null];
  }
}

const post = (api: string, data: any, data_key?: string) => {
  return raw(api, {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
  }, data_key);
}

const put = (api: string, data: any, data_key?: string) => {
  return raw(api, {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT'
  }, data_key);
}

const get = (api: string, data: any, data_key?: string) => {
  const query = data ? buildQueryString(data) : "";
  return raw(api + "?" + query, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET"
  }, data_key);
}

export {
  post,
  put,
  get,
}
