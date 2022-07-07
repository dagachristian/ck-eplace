import { Validator } from 'express-json-validator-middleware';

export * as authSchemas from './authSchemas';
export const { validate } = new Validator({});