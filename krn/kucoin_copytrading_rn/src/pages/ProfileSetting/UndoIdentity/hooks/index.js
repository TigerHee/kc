import {useMutation} from 'hooks/react-query';
import {
  getAccountTotalEquity,
  leadCancel,
  submitRevertLeadReason,
} from 'services/copy-trade';

export const useAccountTotalEquityMutation = () => {
  return useMutation({
    mutationFn: getAccountTotalEquity,
  });
};

export const useSubmitRevertReasonMutation = () => {
  return useMutation({
    mutationFn: submitRevertLeadReason,
  });
};

export const useApplyRevertLeaderMutation = () => {
  return useMutation({
    mutationFn: leadCancel,
  });
};
