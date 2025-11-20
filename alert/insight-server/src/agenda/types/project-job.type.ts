export interface ProjectAutoWorkflowProjectV1 {
  _id: string;
  name: string;
  owner: {
    _id: string;
    avatar: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    isDeleted: boolean;
  };
  repos: {
    _id: string;
    group: string;
    updatedAt: Date;
    isDeleted: boolean;
    slug: string;
    id: number;
    name: string;
    description: string;
    hierarchyId: string;
    scmId: string;
    state: string;
    statusMessage: string;
    forkable: boolean;
    public: boolean;
    project: {
      key: string;
      id: number;
      name: string;
      description: string;
      public: boolean;
      type: string;
      links: {
        self: {
          href: string;
        }[];
      };
    };
    links: {
      clone: {
        href: string;
        name: string;
      }[];
      self: {
        href: string;
      }[];
    };
    createdAt: Date;
  };
  accessibleLink: string;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
  status: boolean;
  workflowSchedule: {
    _id: string;
    job: string;
    interval: string;
    createdAt: Date;
    // workflowRecord: {
    //   _id: string;
    //   currentStep: number;
    //   nodes: {
    //     _id: string;
    //     name: string;
    //     status: boolean;
    //     desc: string;
    //     job: string;
    //     createdAt: Date;
    //   }[];
    //   status: boolean;
    //   createdAt: Date;
    // }[];
  }[];
}

export interface CommonProjectAutoWorkflowJobV1 {
  workflowRecord: string;
  project: ProjectAutoWorkflowProjectV1;
}
