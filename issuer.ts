import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { type ExecutionContext } from "@cloudflare/workers-types";
import { subjects } from "./lib/subjects";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { renderMessage, sendEmail } from "./lib/email";

async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123";
}

interface Env {
  RESEND_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return issuer({
      subjects,
      storage: MemoryStorage(),
      providers: {
        password: PasswordProvider(
          PasswordUI({
            sendCode: async (email, code) => {
              const html = await renderMessage(code);
              const response = await sendEmail(env.RESEND_API_KEY, {
                from: "onboarding@resend.dev",
                to: email,
                subject: "Your code",
                html,
              });
              console.log(response);
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
              const html = await renderMessage(code);
              const response = await sendEmail(env.RESEND_API_KEY, {
                from: "onboarding@resend.dev",
                to: email,
                subject: "Your code",
                html,
              });
              console.log(response);
            },
          })
        ),
      },
      async allow() {
        return true;
      },
      success: async (ctx, value) => {
        if (value.provider === "password") {
          return ctx.subject("user", {
            id: await getUser(value.email),
          });
        }
        throw new Error("Invalid provider");
      },
    }).fetch(request, env, ctx);
  },
};
