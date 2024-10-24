import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next|assets|.*\\..*).*)"],
};

export default async function middleware(request: NextRequest) {
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "ru";

  if (request.nextUrl.locale !== locale) {
    return NextResponse.redirect(
      new URL(
        `/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`,
        request.url
      )
    );
  }
}
