import fetch from "node-fetch";

const { USERNAME, PASSWORD } = process.env;

const AUTH =
  "Basic " +
  Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

const HEADERS = {
  Authorization: AUTH,
  "Content-Type": "application/x-www-form-urlencoded",
};

module.exports = {
  /**
   * REUSABLE METHOD
   * make request with required header to shuttlebus api
   */
  BASE_URL: "https://example.com", // no trailing slash
  toFormUrlEncoded(object) {
    if (!object) return "";
    object = JSON.parse(JSON.stringify(object));
    return Object.entries(object)
      .map(([key, value]) => {
        if (value === null || value === undefined) return "";
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");
  },
  async makeRequest({
    endpoint,
    method,
    params,
    body,
    customHeaders = {},
    isJsonRequest = false,
  } = {}) {
    let canBody = !["get", "head"].includes(method.toLowerCase());
    let requestHeaders = { ...HEADERS, ...customHeaders };
    if (isJsonRequest) {
      requestHeaders["Content-Type"] = "application/json";
    }
    let urlParams = this.toFormUrlEncoded(params);
    let url = `${this.BASE_URL}${endpoint}?${urlParams}`;
    if (!isJsonRequest) {
      body = this.toFormUrlEncoded(body);
    } else {
      body = JSON.stringify(body);
    }
    const response = await fetch(url, {
      method,
      body: canBody ? body : null,
      headers: requestHeaders,
    }).then((resp) => {
      return resp;
    });
    try {
      const data = await response.json();
      return data;
    } catch (err) {
      return { status: false, err: err.toString() };
    }
  },
};
