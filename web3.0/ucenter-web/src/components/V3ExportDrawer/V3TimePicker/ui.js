/**
 * Owner: John.QI@kupotech.com
 */
import { Popover, Select, styled } from '@kux/mui';

export const SelectStyled = styled(Select)`
  display: block;
`;

export const CalendarButtons = styled.div`
  padding: 8px 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const PopoverStyled = styled(Popover)`
  .KuxPopover-content {
    padding: 0 !important;
    background-color: #ffffff;
  }
  .rc-calendar-range {
    width: fit-content !important;
    padding: 10px 0 0;
    border: 0 !important;
    box-shadow: none;
    .rc-calendar-header,
    .rc-calendar-body {
      border: 0;
    }
  }
  .rc-calendar-year-panel-header,
  .rc-calendar-month-panel-header {
    a {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  .rc-calendar-month-panel-selected-cell .rc-calendar-month-panel-month,
  .rc-calendar-year-panel-selected-cell .rc-calendar-year-panel-year {
    background: ${({ theme }) => theme.colors.primary} !important;
    &:hover {
      color: #fff !important;
    }
  }
  .rc-calendar-range .rc-calendar-decade-panel-table,
  .rc-calendar-range .rc-calendar-year-panel-table,
  .rc-calendar-range .rc-calendar-month-panel-table {
    height: 100% !important;
  }

  .rc-calendar-year-panel-year,
  .rc-calendar-month-panel-month {
    height: 24px !important;
    line-height: 24px !important;
  }

  .rc-calendar-range .rc-calendar-in-range-cell {
    background: ${({ theme }) => theme.colors.primary12};
  }
  .rc-calendar-date:hover {
    background: ${({ theme }) => theme.colors.primary12};
  }
  .rc-calendar-selected-day .rc-calendar-date {
    background: ${({ theme }) => theme.colors.primary};
  }
  .rc-calendar-selected-date .rc-calendar-date {
    background: ${({ theme }) => theme.colors.primary};
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }
  .rc-calendar-today .rc-calendar-date {
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
  .rc-calendar-header {
    a:hover {
      color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
  .rc-calendar-range-left,
  .rc-calendar-range-right {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      float: none !important;
    }
  }
`;
