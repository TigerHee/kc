import { UserDocument } from 'src/auth/schemas/user.schema';
import { ReposDocument } from 'src/insight/schemas/repos.schema';

import { AlarmMessageTypeEnum } from 'src/notification/constants/alarm.notification.constant';

export enum DiffType {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
}

export interface CommentItem {
  text: string;
  severity: string;
  anchor: {
    diffType: string;
    path: string;
    lineType: string;
    line: string;
    fileType: string;
  };
}

export interface DiffConfig {
  alarmType: string;
  warnText: string;
  diffTypes: DiffType[];
  matchLine?: (line: string) => boolean;
  diffLineOnly?: boolean;
  parentSrc?: string;
  fileNames?: string[];
  ignoredParents?: string[];
}

export type WebhookInfoType = {
  user: UserDocument;
  repo: ReposDocument;
  authorEmail: string;
  eventKey: string;
  projectKey: string;
  alarmType: AlarmMessageTypeEnum;
  warnText: string;
  warns: [];
  slug: string;
  branch: string;
  commitId: string;
  commitUrl: string;
  commitLint: string;
  prId: string;
  prUrl: string;
  wikiUrl: string;
  message: string;
};
