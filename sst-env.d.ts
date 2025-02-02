/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "Auth": {
      "type": "sst.aws.Auth"
      "url": string
    }
    "Email": {
      "configSet": string
      "sender": string
      "type": "sst.aws.Email"
    }
    "Postgres": {
      "clusterArn": string
      "database": string
      "host": string
      "password": string
      "port": number
      "secretArn": string
      "type": "sst.aws.Aurora"
      "username": string
    }
    "TMDB_API_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Vpc": {
      "bastion": string
      "type": "sst.aws.Vpc"
    }
    "Web": {
      "service": string
      "type": "sst.aws.Service"
      "url": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}