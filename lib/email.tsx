import { render, Html, Body, Heading, Text, Container, Img } from "jsx-email";
import * as React from "react";
import { AwsClient } from "aws4fetch";

interface SendEmailArgs {
  to: string;
  subject: string;
  code: string;
  from: string;
}

export class EmailClient extends AwsClient {
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

  async renderHtml(code: string) {
    return render(
      <Html lang="en" dir="ltr">
        <Body>
          <Container
            style={{
              maxWidth: `460px`,
              margin: `0 auto`,
              fontSize: `16px`,
            }}
          >
            {/* <Img
              style={{
                display: `block`,
                height: `30px`,
                width: `auto`,
              }}
              src={`data:image/png;base64,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`}
            /> */}
            <Heading
              as="h1"
              style={{ textAlign: `left`, color: `#000000`, fontSize: `20px` }}
            >
              Your verification code
            </Heading>
            <Text style={{ textAlign: `left`, color: `#8B8B8B` }}>
              Use the one-time code below to continue:
            </Text>
            <Text
              style={{
                padding: `16px`,
                fontSize: `20px`,
                letterSpacing: `0.25em`,
                backgroundColor: `#FAFAFA`,
                textAlign: `center`,
                fontWeight: `bold`,
                margin: `32px 0`,
              }}
            >
              {code}
            </Text>
            <Text
              style={{
                fontSize: `12px`,
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
    const { to, subject, from, code } = args;
    const html = await this.renderHtml(code);
    let resp = await this.fetch(
      "https://email.us-east-1.amazonaws.com/v2/email/outbound-emails",
      {
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
      }
    );
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
