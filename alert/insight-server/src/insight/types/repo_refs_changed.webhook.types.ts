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
interface Links {
  self: Array<{ href: string }>;
}

interface Project {
  key: string;
  id: number;
  name: string;
  description: string;
  public: boolean;
  type: string;
  links: Links;
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

interface Ref {
  id: string;
  displayId: string;
  type: string;
}

interface Change {
  ref: Ref;
  refId: string;
  fromHash: string;
  toHash: string;
  type: string;
}

export interface RepoRefsChangedEvent {
  eventKey: WebhookEventEnum.EVENT_REFS_CHANGED;
  date: string;
  actor: Actor;
  repository: Repository;
  changes: Change[];
}
