import { Validator } from 'express-json-validator-middleware';

export * as authSchemas from './authSchemas';
export * as canvasSchemas from './canvasSchemas';
export const { validate } = new Validator({});