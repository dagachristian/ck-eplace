import { createNamespace, getNamespace } from 'cls-hooked';
import moment from 'moment';
import shortId from 'shortid';
import { NextFunction } from 'express';

const namespaceName = 'context';
createNamespace(namespaceName);

const contextName = 'context';

export class Context {
  #cId;
  #now;
  #startUtc;
  userId?: string;
  appId?: string;

  constructor(now: moment.Moment, startUtc: string) {
    this.#cId = shortId.generate();
    this.#now = now;
    this.#startUtc = startUtc;
  }

  get cId() {
    return this.#cId;
  }

  get now() {
    return this.#now;
  }

  get startUtc() {
    return this.#startUtc;
  }
}

export const createContext = (next: NextFunction, requestResponse: { req: any, res: any }) => {
  const namespace = getNamespace(namespaceName);

  let startTime;
  if (requestResponse) {
    const { req, res } = requestResponse;
    startTime = req._startTime;
    namespace?.bindEmitter(req);
    namespace?.bindEmitter(res);
  } else {
    startTime = new Date();
  }
  const now = moment.utc(startTime);
  const startUtc = now.format();

  namespace?.run(() => {
    const ctx = new Context(now, startUtc);
    namespace.set(contextName, ctx);
    next();
  });
};

export const currentContext = () => {
  return getNamespace(namespaceName)?.get(contextName) as Context;
};
