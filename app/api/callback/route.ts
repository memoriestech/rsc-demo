import { client, setTokens } from "@/app/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(new Error("No code provided"), { status: 400 });
  }

  const exchanged = await client.exchange(code, `${url.origin}/api/callback`);

  if (exchanged.err) {
    return NextResponse.json(exchanged.err, { status: 400 });
  }

  await setTokens(exchanged.tokens.access, exchanged.tokens.refresh);

  return NextResponse.redirect(`${url.origin}/`);
}
