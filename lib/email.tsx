import { render, Html, Body, Heading, Text } from "jsx-email";
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
        <Heading as="h1">OpenAuth</Heading>
        <Text>
          Your code is <strong>{code}</strong>.
        </Text>
      </Body>
    </Html>
  );
};
