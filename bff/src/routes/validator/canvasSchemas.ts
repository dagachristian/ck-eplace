import { AllowedSchema } from 'express-json-validator-middleware';

export const getCanvasSch: AllowedSchema = {
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