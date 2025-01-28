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

    const database = new sst.aws.Aurora("Postgres", {
      vpc,
      engine: "postgres",
      proxy: true,
      scaling: { max: "1 ACU", min: "0 ACU" },
    });

    new sst.x.DevCommand("Studio", {
      link: [database],
      dev: {
        command: "npx drizzle-kit studio",
      },
    });

    const email = getEmail();

    const auth = new sst.aws.Auth("Auth", {
      issuer: {
        handler: "auth/index.handler",
        link: [email, database],
        vpc,
      },
    });

    const cluster = new sst.aws.Cluster("Cluster", { vpc });

    cluster.addService("Web", {
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      link: [database, auth, tmdbApiKey],
      dev: {
        command: "pnpm dev",
      },
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
