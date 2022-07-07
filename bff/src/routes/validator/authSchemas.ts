import { AllowedSchema } from 'express-json-validator-middleware';

export const loginSch: AllowedSchema = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
};

export const registerSch: AllowedSchema = {
  type: "object",
  required: ["username", "password", "email"],
  properties: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
    email: {
      type: "string"
    }
  },
};