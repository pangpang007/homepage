import { request, type FetchResponse } from "../utils/request.js";

/** 直连后端 `GET /hello`（与 `/api/common/hello` BFF 演示路由不同）。 */
export async function fetchBackendHello(): Promise<FetchResponse> {
  return request({
    method: "GET",
    path: "/hello",
    headers: { Accept: "text/plain,*/*" },
  });
}
