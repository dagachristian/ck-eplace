import create from 'zustand';
import { persist } from 'zustand/middleware'

import { ILogGroup } from '../../interfaces';

export type LogGroupState = {
  [key: string]: ILogGroup[]
}

export const addLogGroups = (logGroups: LogGroupState, newLogGroups: ILogGroup[], name: string): LogGroupState => {
  const newState = {...logGroups}
  if (newState[name]) {
    const filtered = newLogGroups.filter((lg) => !newState[name].some((slg) => slg.logGroupId === lg.logGroupId))
    newState[name] = [...newState[name], ...filtered]
  }
  else
    newState[name] = newLogGroups
  return newState;
}

type LogGroupStore = {
  logGroups: LogGroupState;
  addLogGroups: (newLogGroups: ILogGroup[], name: string) => void;
}

export const useLogGroupStore = create(persist<LogGroupStore>(
  (set) => ({
    logGroups: {},
    addLogGroups(newLogGroups: ILogGroup[], name: string) {
      set((state) => ({
        ...state,
        logGroups: addLogGroups(state.logGroups, newLogGroups, name)
      }))
    },
  }),{
    name: 'logGroup.storage',
    getStorage: () => sessionStorage
}))