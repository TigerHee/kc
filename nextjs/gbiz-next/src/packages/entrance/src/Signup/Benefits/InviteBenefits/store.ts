/**
 * Owner: sean.shi@kupotech.com
 */
import { create } from 'zustand';
import { getNewcomerConfig, getNewcomerTaskStatus } from './services';

type NewcomerConfig = any;

export type LimitTaskLevel = {
  level: number;
  prizeAmount: number;
  startDepositAmount: number;
  startTradeAmount: number;
};
export interface TaskList {
  tempTask: {
    taskStartTime: number;
    taskEndTime: number;
    financialVipTaskInfo: {
      currentBoughtAmount?: number;
      prizeStatus?: string;
      financialBenefitSubTitle?: string;
      extraApr: string;
    };
    financialNewcomerTaskInfo: {
      currentBoughtAmount?: number;
      prizeStatus?: string;
      financialBenefitSubTitle?: string;
      extraApr: string;
    };
    limitTaskInfo?: {
      subtitle?: string;
      limitTaskLevel?: LimitTaskLevel[];
      userLevel?: number;
      taskStatus?: string;
      prizeStatus?: string;
      startDepositAmount?: number;
      startTradeAmount?: number;
    }
  };
  now: number;
};

type InviteBenefitsState = {
  config: NewcomerConfig | null;
  taskList: TaskList | null;
  loading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
  loadConfig: () => Promise<void>;
  loadTaskList: () => Promise<void>;
};

export const useInviteBenefitsStore = create<InviteBenefitsState>((set) => ({
  config: null,
  taskList: null,
  loading: false,
  error: null,
  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const [cfg, tasks] = await Promise.all([
        getNewcomerConfig(),
        getNewcomerTaskStatus(),
      ]);
      set({
        config: cfg?.success ? cfg.data : null,
        taskList: tasks?.success ? tasks.data : null,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      set({ loading: false, error: err?.message || 'UNKNOWN_ERROR' });
    }
  },
  loadConfig: async () => {
    try {
      const { data, success } = await getNewcomerConfig();
      set({ config: success ? data : null });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      set({ config: null });
    }
  },
  loadTaskList: async () => {
    try {
      const { data, success } = await getNewcomerTaskStatus();
      set({ taskList: success ? data : null });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      set({ taskList: null });
    }
  },
}));

export const useInviteBenefits = () => useInviteBenefitsStore();


