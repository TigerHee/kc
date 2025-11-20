export namespace Common {
  export interface SelectOptionItem {
    label: string;
    value: string;
  }

  export interface UserSelectOptionItem {
    label: string;
    value: string;
    email: string;
  }

  export interface WorkflowOptionItem {
    label: string;
    value: string;
    desc: string;
  }

  export interface ReposOptionItem {
    label: string;
    value: string;
    desc: string;
    group: string;
  }
}
