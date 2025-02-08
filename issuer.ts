import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { type ExecutionContext } from "@cloudflare/workers-types";
import { subjects } from "./lib/subjects";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { EmailClient } from "./lib/email";

async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123";
}

interface Env {
  SENDER_EMAIL: string;
  SES_ACCESS_KEY_ID: string;
  SES_SECRET_ACCESS_KEY: string;
  LOGO_URL?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const emailClient = new EmailClient({
      accessKeyId: env.SES_ACCESS_KEY_ID,
      secretAccessKey: env.SES_SECRET_ACCESS_KEY,
    });
    return issuer({
      subjects,
      storage: MemoryStorage(),
      providers: {
        password: PasswordProvider(
          PasswordUI({
            sendCode: async (email, code) => {
              await emailClient.send({
                from: env.SENDER_EMAIL,
                to: email,
                subject: "Your code",
                code,
                logoUrl: env.LOGO_URL,
              });
            },
            validatePassword: (password) => {
              if (password.length < 8) {
                return "Password must be at least 8 characters";
              }
            },
          })
        ),
        code: CodeProvider(
          CodeUI({
            sendCode: async (claims, code) => {
              if (!Object.prototype.hasOwnProperty.call(claims, "email")) {
                throw new Error("Email is required");
              }
              const { email } = claims;
              await emailClient.send({
                from: env.SENDER_EMAIL,
                to: email,
                subject: "Your code",
                code,
                logoUrl: env.LOGO_URL,
              });
            },
          })
        ),
      },
      async allow() {
        return true;
      },
      success: async (ctx, value) => {
        if (value.provider === "code") {
          return ctx.subject("user", {
            id: await getUser(value.claims.email),
          });
        }
        throw new Error("Invalid provider");
      },
    }).fetch(request, env, ctx);
  },
};
