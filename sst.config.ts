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
    const senderEmail = new sst.Secret("SenderEmail");
    const accessKeyId = new sst.Secret("SESAccessKeyId");
    const secretAccessKey = new sst.Secret("SESSecretAccessKey");

    const auth = new sst.cloudflare.Worker("CloudflareAuth", {
      handler: "./issuer.ts",
      url: true,
      environment: {
        SENDER_EMAIL: senderEmail.value,
        SES_ACCESS_KEY_ID: accessKeyId.value,
        SES_SECRET_ACCESS_KEY: secretAccessKey.value,
        //LOGO_URL: "https://image-deployment-storage.s3.us-east-1.amazonaws.com/logo.png",
      },
    });

    return {
      url: auth.url,
    };
  },
});
