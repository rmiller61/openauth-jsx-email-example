import {
  render,
  Html,
  Body,
  Heading,
  Text,
  Container,
  Img,
  Font,
  Head,
} from "jsx-email";
import * as React from "react";
import { AwsClient } from "aws4fetch";

interface SendEmailArgs {
  to: string;
  subject: string;
  code: string;
  from: string;
  logoUrl?: string;
}

export class EmailClient extends AwsClient {
  endpoint: string =
    "https://email.us-east-1.amazonaws.com/v2/email/outbound-emails";
  constructor({
    accessKeyId,
    secretAccessKey,
  }: {
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    super({
      accessKeyId,
      secretAccessKey,
    });
  }

  async renderHtml(code: string, logoUrl?: string) {
    return render(
      <Html lang="en" dir="ltr">
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Body>
          <Container
            style={{
              maxWidth: `460px`,
              margin: `0 auto`,
              fontSize: `16px`,
            }}
          >
            {logoUrl ? (
              <div style={{ textAlign: `left` }}>
                <Img
                  style={{
                    display: `block`,
                    height: `24px`,
                    width: `auto`,
                    marginBottom: `24px`,
                  }}
                  src={logoUrl}
                />
              </div>
            ) : null}
            <Heading
              as="h1"
              style={{
                textAlign: `left`,
                color: `#000000`,
                fontSize: `20px`,
                fontWeight: 500,
                margin: 0,
              }}
            >
              Your verification code
            </Heading>
            <Text
              style={{
                textAlign: `left`,
                color: `#8B8B8B`,
                fontSize: `16px`,
                marginTop: 0,
              }}
            >
              Use the one-time code below to continue:
            </Text>
            <Text
              style={{
                padding: `16px`,
                fontSize: `24px`,
                letterSpacing: `10px`,
                backgroundColor: `#FAFAFA`,
                textAlign: `center`,
                fontWeight: 500,
                margin: `32px 0`,
                borderRadius: `10px`,
              }}
            >
              {code}
            </Text>
            <Text
              style={{
                fontSize: `14px`,
                textAlign: `left`,
                lineHeight: `125%`,
                color: `#8B8B8B`,
              }}
            >
              This code will expire in 10 minutes and can only be used once. For
              your security, do not share this code with anyone.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  async send(args: SendEmailArgs) {
    const { to, subject, from, code, logoUrl } = args;
    const html = await this.renderHtml(code, logoUrl);
    let resp = await this.fetch(this.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        Destination: {
          ToAddresses: [to],
        },
        FromEmailAddress: from,
        Content: {
          Simple: {
            Subject: {
              Data: subject,
            },
            Body: {
              Html: {
                Data: html,
              },
            },
          },
        },
      }),
    });
    const respText = await resp.json();
    console.log(resp.status + " " + resp.statusText);
    console.log(respText);
    if (resp.status != 200 && resp.status != 201) {
      throw new Error(
        "Error sending email: " +
          resp.status +
          " " +
          resp.statusText +
          " " +
          respText
      );
    }
    return resp.status;
  }
}
