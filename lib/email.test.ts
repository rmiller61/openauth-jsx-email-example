import { it, expect, describe, vi } from "vitest";
import { EmailClient } from "./email";

const emailClientMock = {
  async send(args: any) {
    return 200;
  },
  async renderHtml(code: string) {
    return `<html><body><h1>Your code</h1><p>${code}</p></body></html>`;
  },
};
vi.mock("./email", () => {
  return {
    EmailClient: vi.fn(() => emailClientMock),
  };
});

describe("Email", () => {
  it("renders html email", async () => {
    const emailClient = new EmailClient({
      accessKeyId: "accessKeyId",
      secretAccessKey: "secretAccessKey",
    });
    const html = await emailClient.renderHtml("123456");
    expect(html).toMatchSnapshot();
  });
});
