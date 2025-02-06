import { render, Html, Body, Heading, Text } from "jsx-email";
import * as React from "react";
import { Resend } from "resend";

export const createEmailClient = async (apiKey: string) => {
  return new Resend(apiKey);
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
