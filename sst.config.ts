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
    // const hono = new sst.cloudflare.Worker("Hono", {
    //   url: true,
    //   handler: "index.ts",
    // });

    // const auth = new sst.cloudflare.Worker("Auth", {
    //   url: true,
    //   handler: "auth.ts",
    //   environment: {
    //     HONO_API: hono.url,
    //   },
    // });

    // return {
    //   api: hono.url,
    //   auth: auth.url,
    // };

    const auth = new sst.cloudflare.Worker("CloudflareAuth", {
      handler: "./issuer.ts",
      url: true,
    });

    return {
      url: auth.url,
    };
  },
});
