import { subjects } from "@/auth/subjects";
import { db } from "@/db";
import { favorite, movie, user } from "@/db/schema";
import { log } from "@/lib/logger";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { issuer } from "@openauthjs/openauth";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { THEME_SST } from "@openauthjs/openauth/ui/theme";
import { eq } from "drizzle-orm";
import { handle } from "hono/aws-lambda";
import { Resource } from "sst";

const app = issuer({
  theme: {
    ...THEME_SST,
    //logo: "https://i.imgur.com/0e0u4wH.png",
  },
  subjects,
  // Remove after setting custom domain
  allow: async () => true,
  providers: {
    password: PasswordProvider(PasswordUI({ sendCode })),
  },
  success: async (ctx, value) => {
    if (value.provider === "password") {
      const user = await getUser(value.email);

      return ctx.subject("user", { ...user, id: user.id.toString() });
    }

    throw new Error("Invalid provider");
  },
});

export const handler = handle(app);

async function getUser(email: string) {
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existingUser) {
    log.info(`Fetched user: ${email}`, { existingUser });
    return existingUser;
  }

  const result = await db.insert(user).values({ email, last_login: new Date() }).returning();

  log.info(`Created new user: ${email}`, { result });

  return result?.[0];
}

export const sesClient = new SESv2Client();

async function sendCode(email: string, code: string) {
  log.info(`Sending code to ${email}`, { email, code });

  await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: Resource.Email.sender,
      Destination: {
        ToAddresses: [email],
      },
      Content: {
        Simple: {
          Subject: { Data: "Code for your account" },
          Body: { Text: { Data: `Your code is ${code}` } },
        },
      },
    }),
  );
}

async function getUserFavoriteMovies(userId: number) {
  return db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, userId))
    .innerJoin(movie, eq(favorite.movieId, movie.id));
}
