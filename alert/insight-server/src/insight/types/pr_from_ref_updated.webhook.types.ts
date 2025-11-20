import { WebhookEventEnum } from '../constants/insight.constant';

interface Repository {
  slug: string;
  id: number;
  name: string;
  hierarchyId: string;
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
    links: {
      self: {
        href: string;
      }[];
    };
  };
  public: boolean;
  links: {
    clone: {
      href: string;
      name: string;
    }[];
    self: {
      href: string;
    }[];
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
  author: {
    user: {
      name: string;
      emailAddress: string;
      id: number;
      displayName: string;
      active: boolean;
      slug: string;
      type: string;
      links: {
        self: {
          href: string;
        }[];
      };
    };
    role: string;
    approved: boolean;
    status: string;
  };
  reviewers: any[];
  participants: any[];
  links: {
    self: {
      href: string;
    }[];
  };
}

interface Actor {
  name: string;
  emailAddress: string;
  id: number;
  displayName: string;
  active: boolean;
  slug: string;
  type: string;
  links: {
    self: {
      href: string;
    }[];
  };
}

export interface PrFromRefUpdatedEvent {
  eventKey: WebhookEventEnum.EVENT_PR_FROM_REF_UPDATED;
  date: string;
  actor: Actor;
  pullRequest: PullRequest;
}
