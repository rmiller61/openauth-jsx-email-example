import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { type ExecutionContext } from "@cloudflare/workers-types";
import { subjects } from "./lib/subjects";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";

async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123";
}

interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return issuer({
      subjects,
      storage: MemoryStorage(),
      providers: {
        password: PasswordProvider(
          PasswordUI({
            sendCode: async (email, code) => {
              console.log(email, code);
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
            sendCode: async (email, code) => {
              console.log(email, code);
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
