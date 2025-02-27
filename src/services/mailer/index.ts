import { mailer as mailtrapMailer } from "./mailtrap-mailer";
import { mailer as consoleLogMailer } from "./console-log-mailer";
import config from "@/config";
import { IMailer } from "./interface";

let mailer: IMailer = mailtrapMailer;

if (config.consoleLogEmails) {
  mailer = consoleLogMailer;
}

export { mailer };
