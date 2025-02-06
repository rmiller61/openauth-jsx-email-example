import { render, Html, Body, Heading, Text, Container } from "jsx-email";
import * as React from "react";
import { type CreateEmailOptions } from "resend";

export const sendEmail = async (apiKey: string, args: CreateEmailOptions) => {
  const request = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!request.ok) {
    throw new Error("Failed to send email");
  }
  const response = await request.json();
  return response;
};

export const renderMessage = async (code: string) => {
  return render(
    <Html lang="en" dir="ltr">
      <Body>
        <Container
          style={{
            maxWidth: `600px`,
            margin: `0 auto`,
            fontSize: `16px`,
          }}
        >
          <Heading as="h1" style={{ textAlign: `left` }}>
            Your verification code
          </Heading>
          <Text style={{ textAlign: `left` }}>
            Use the one-time code below to continue:
          </Text>
          <Text
            style={{
              padding: `16px`,
              fontSize: `20px`,
              letterSpacing: `0.25em`,
              backgroundColor: `#f0f0f0`,
              textAlign: `center`,
            }}
          >
            {code}
          </Text>
          <Text
            style={{
              fontSize: `12px`,
              textAlign: `left`,
            }}
          >
            This code will expire in 10 minutes and can only be used once. For
            your security, do not share this code with anyone.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
