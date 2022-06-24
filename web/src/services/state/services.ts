import create from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';

import { IService } from '../../interfaces';

const addServices = (services: IService[] | undefined, newServices: IService[]): IService[] => produce(services || [], draft => {
  draft.push(...newServices)
})

type ServiceStore = {
  services: IService[] | undefined;
  addServices: (newServices: IService[]) => void;
}

export const useServiceStore = create(persist<ServiceStore>((set) => ({
  services: undefined,
  addServices(newServices: IService[]) {
    set((state) => ({
      ...state,
      services: addServices(state.services, newServices)
    }))
  },
}),{
  name: 'service.storage',
  getStorage: () => sessionStorage
}))