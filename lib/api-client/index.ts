import Cookies from "js-cookie";
import { API_URL, END_POINTS, RequestMethod } from "./constants";

export class APIClient {
  private static async request(
    url: string,
    method: RequestMethod,
    data?: Record<string, unknown>,
    headers?: Record<string, string>,
    query?: Record<string, string>,
    idQuery?: string
  ): Promise<unknown> {
    const queryParams = new URLSearchParams(query || {}).toString();
    const options: RequestInit = {
      method,
      headers: Object.assign(
        {
          "Content-Type": "application/json",
        },
        headers
      ),
      body: data ? JSON.stringify(data) : undefined,
    };

    if (idQuery) {
      url = `${url}/${idQuery}`;
    }

    const fullUrl = `${url}${queryParams ? `?${queryParams}` : ""}`;

    const response = await fetch(fullUrl, options);
    return response.json();
  }

  static async invoke<T = unknown>(params: {
    action: keyof typeof END_POINTS;
    data?: any;
    query?: Record<string, string>;
    idQuery?: string;
  }): Promise<T> {
    const { action, data, query, idQuery } = params;

    if (!END_POINTS[action]) {
      throw new Error(`Invalid action: ${action}`);
    }

    const { path, method, secure } = END_POINTS[action];

    const headers: HeadersInit = {};
    if (secure) {
      // Add access token to headers
      const access_token = Cookies.get("auth-token");
      console.log(access_token);
      if (access_token) {
        headers["Authorization"] = `Bearer ${access_token}`;
      }
    }

    const url = `${API_URL}${path}`;
    return this.request(
      url,
      method,
      data,
      headers,
      query,
      idQuery
    ) as Promise<T>;
  }
}
