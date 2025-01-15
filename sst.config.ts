/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "optimistic-rsc-demo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("Vpc", { bastion: true, nat: "ec2" });

    const rds = new sst.aws.Postgres("Postgres", { vpc, proxy: true });

    new sst.x.DevCommand("Studio", {
      link: [rds],
      dev: {
        command: "npx drizzle-kit studio",
      },
    });

    new sst.aws.Nextjs("Web", {
      link: [rds],
    });
  },
});