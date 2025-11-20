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

interface Repository {
  slug: string;
  id: number;
  name: string;
  scmId: string;
  state: string;
  statusMessage: string;
  forkable: boolean;
  project: Project;
  public: boolean;
}

interface Project {
  key: string;
  id: number;
  name: string;
  public: boolean;
  type: string;
  links: {
    self: { href: string }[];
  };
}

interface FromRef {
  id: string;
  displayId: string;
  type: string;
  latestCommit: string;
  repository: Repository;
}

interface ToRef {
  id: string;
  displayId: string;
  type: string;
  latestCommit: string;
  repository: Repository;
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

interface Author {
  user: User;
  role: string;
  approved: boolean;
  status: string;
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
  fromRef: FromRef;
  toRef: ToRef;
  locked: boolean;
  author: Author;
  reviewers: any[];
  participants: any[];
  links: {
    self: [null];
  };
}

export interface PrOpenedEvent {
  eventKey: WebhookEventEnum.EVENT_PR_OPENED;
  date: string;
  actor: Actor;
  pullRequest: PullRequest;
}
