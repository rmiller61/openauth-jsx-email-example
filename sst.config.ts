/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "openauth-jsx-email-example",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    const resendApiKey = new sst.Secret("ResendApiKey");

    const auth = new sst.cloudflare.Worker("CloudflareAuth", {
      handler: "./issuer.ts",
      url: true,
      environment: {
        RESEND_API_KEY: resendApiKey.value,
      },
    });

    return {
      url: auth.url,
    };
  },
});
