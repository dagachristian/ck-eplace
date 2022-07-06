// import { ckSessionTbl } from '../db';
// import { currentContext } from '../context';
// import { ISession } from './interfaces';

// const deleteExpiredSessions = async () => {
//   const ctx = currentContext();
//   const { userId } = ctx;

//   // Temporarily switch to system context.
//   try {
//     ctx.userId = '00000000-0000-0000-0000-000000000000';
//     const where = {
//       clause: `t.expire < :now`,
//       params: { now: ctx.now }
//     };
//     await ckSessionTbl.delete(where);
//   } finally {
//     // Go back to user context.
//     ctx.userId = userId;
//   }
// };

// export const storeSession = async (session: ISession) => {
//   try {
//     await deleteExpiredSessions();
//   } catch (error) {
//     console.log('Failed to delete expired sessions.', { error });
//   }

//   try {
//     await ckSessionTbl.save(session);
//   } catch (error) {
//     console.log('Failed to save session.', { error, session });
//   }
// };

// export const deleteSession = async (sessionId: any) => {
//   const where = {
//     clause: `t.id = '${sessionId}'`
//   };
//   try {
//     await ckSessionTbl.delete(where);
//   } catch (error) {
//     console.log('Failed to delete session.', { error, sessionId });
//   }
// };
