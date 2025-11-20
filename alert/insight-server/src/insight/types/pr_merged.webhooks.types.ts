import { WebhookEventEnum } from '../constants/insight.constant';

interface Actor {
  name: string;
  emailAddress: string;
  id: number;
  displayName: string;
  active: boolean;
  slug: string;
  type: string;
}

interface FromRef {
  id: string;
  displayId: string;
  latestCommit: string;
  repository: {
    slug: string;
    id: number;
    name: string;
    scmId: string;
    state: string;
    statusMessage: string;
    forkable: boolean;
    project: {
      key: string;
      id: number;
      name: string;
      public: boolean;
      type: string;
    };
    public: boolean;
  };
}

interface ToRef {
  id: string;
  displayId: string;
  latestCommit: string;
  repository: {
    slug: string;
    id: number;
    name: string;
    scmId: string;
    state: string;
    statusMessage: string;
    forkable: boolean;
    project: {
      key: string;
      id: number;
      name: string;
      public: boolean;
      type: string;
    };
    public: boolean;
  };
}

interface User {
  name: string;
  emailAddress: string;
  id: number;
  displayName: string;
  active: boolean;
  slug: string;
  type: string;
}

interface Participant {
  user: User;
  role: string;
  approved: boolean;
  status: string;
}

interface MergeCommit {
  displayId: string;
  id: string;
}

interface PullRequest {
  id: number;
  version: number;
  title: string;
  state: string;
  open: boolean;
  closed: boolean;
  createdDate: number;
  updatedDate: number;
  closedDate: number;
  fromRef: FromRef;
  toRef: ToRef;
  locked: boolean;
  author: {
    user: User;
    role: string;
    approved: boolean;
    status: string;
  };
  reviewers: any[];
  participants: Participant[];
  properties: {
    mergeCommit: MergeCommit;
  };
}

export interface PrMergedEvent {
  eventKey: WebhookEventEnum.EVENT_PR_MERGED;
  date: string;
  actor: Actor;
  pullRequest: PullRequest;
}
