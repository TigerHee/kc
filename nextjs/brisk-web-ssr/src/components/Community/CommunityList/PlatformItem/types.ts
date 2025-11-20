export interface CommunityGroupModel {
  accountId?: string;
  iconUrl?: string;
  id?: string;
  platform?: string;
  type?: string;
  url?: string;
}

export interface PlatformItemProps {
  platform: string;
  items: CommunityGroupModel[];
}
