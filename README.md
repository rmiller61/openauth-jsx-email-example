This repository demonstrates how to use OpenAuth with JSX Email. The project also uses SST for app scaffolding and is designed to be deployed to Cloudflare Workers.

## Environment Set Up

After cloning the repo, you must set up your environment to use Cloudflare and Resend. You can follow [SST's guide](https://sst.dev/docs/start/cloudflare/worker#set-the-cloudflare-api-token) for setting Cloudflare's environment variables:

```
export CLOUDFLARE_API_TOKEN=aaaaaaaa_aaaaaaaaaaaa_aaaaaaaa
export CLOUDFLARE_DEFAULT_ACCOUNT_ID=aaaaaaaa_aaaaaaaaaaaa_aaaaaaaa
```

Next, leverage SST secrets to load your environment variables into the app:

```
sst secret set SenderEmail xxxxxxxxxxxxxxxxxxxxxxxxxxxx
sst secret set SESAccessKeyId xxxxxxxxxxxxxxxxxxxxxxxxxxxx
sst secret set SESSecretAccessKey xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Run the auth server

Run `pnpm exec sst dev` to start the server, and then send a post request to trigger the auth flow:

```
curl -X POST '{your-api-url}/code/authorize' -F action=request -F email=youremail@example.com
```
