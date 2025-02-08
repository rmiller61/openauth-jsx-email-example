import { it, expect, describe, afterAll, afterEach, beforeAll } from "vitest";
import { EmailClient } from "./email";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const accessKeyId = "AKIDEXAMPLE";
const secretAccessKey = "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY";

const emailClient = new EmailClient({
  accessKeyId,
  secretAccessKey,
});

describe("EmailClient", () => {
  it("should send an email", async () => {
    server.use(
      http.post(emailClient.endpoint, () => {
        return HttpResponse.json({ message: "Email sent" }, { status: 200 });
      })
    );

    const response = await emailClient.send({
      from: "",
      to: "",
      subject: "",
      code: "",
    });

    expect(response).toEqual(200);
  });
  it("should throw an error if email fails", async () => {
    server.use(
      http.post(emailClient.endpoint, () => {
        return HttpResponse.json({ message: "Email failed" }, { status: 400 });
      })
    );

    await expect(
      emailClient.send({
        from: "",
        to: "",
        subject: "",
        code: "",
      })
    ).rejects.toThrow("Error sending email");
  });

  describe("renderHtml", () => {
    it("should render the email HTML", async () => {
      const html = await emailClient.renderHtml("123456");
      expect(html).toContain("123456");
      expect(html).toMatchSnapshot();
    });
  });
});
