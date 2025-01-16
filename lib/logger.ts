import { Logger } from "@aws-lambda-powertools/logger";
import { Resource } from "sst";

const stage = Resource.App.stage ?? process.env.STAGE ?? process.env.NEXT_PUBLIC_STAGE;

export const log = new Logger({
  logLevel: "INFO",
  persistentLogAttributes: {
    ...(stage && { stage }),
  },
});
