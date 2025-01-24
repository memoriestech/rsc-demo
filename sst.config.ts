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
    const tmdbApiKey = new sst.Secret("TMDB_API_KEY");

    const vpc = new sst.aws.Vpc("Vpc", { bastion: true, nat: "ec2" });

    const rds = new sst.aws.Postgres("Postgres", { vpc, proxy: true });

    new sst.x.DevCommand("Studio", {
      link: [rds],
      dev: {
        command: "npx drizzle-kit studio",
      },
    });

    const email = getEmail();

    const auth = new sst.aws.Auth("Auth", {
      issuer: {
        handler: "auth/index.handler",
        link: [email, rds],
        vpc,
      },
    });

    new sst.aws.Nextjs("Web", {
      link: [rds, auth, tmdbApiKey],
      vpc,
    });
  },
});

function getEmail() {
  if ($app.stage === "prod") {
    return sst.aws.Email.get("Email", "subash.adhikari@memories.net");
  }

  return new sst.aws.Email("Email", {
    sender: "subash.adhikari@memories.net",
  });
}
