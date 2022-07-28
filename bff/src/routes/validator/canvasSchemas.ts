import type { AllowedSchema } from 'express-json-validator-middleware';

export const canvasIdSch: AllowedSchema = {
  type: "object",
  required: ["canvasId"],
  properties: {
    canvasId: {
      type: "string",
    }
  },
};

export const createCanvasSch: AllowedSchema = {
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    size: {
      type: "number",
    },
    timer: {
      type: "number",
    },
    private: {
      type: "boolean"
    },
    subs: {
      type: "array"
    }
  },
};

export const subIdSch: AllowedSchema = {
  type: "object",
  required: ["subId"],
  properties: {
    subId: {
      type: "string",
    }
  },
};