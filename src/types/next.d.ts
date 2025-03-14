import type { NextRequest } from "next/server"

declare module "next/server" {
  export interface RouteHandlerContext {
    params: Record<string, string | string[]>
  }

  export type RouteHandler<T = any> = (
    request: NextRequest,
    context: RouteHandlerContext,
  ) => Response | Promise<Response> | T | Promise<T>
}

