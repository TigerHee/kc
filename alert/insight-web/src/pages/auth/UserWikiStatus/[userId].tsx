import { useParams } from '@umijs/max';
import UserMustReadWikiList from '../../wiki/components/UserMustReadWikiList';

const UserWikiStatus: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  return <UserMustReadWikiList userId={userId} />;
};

export default UserWikiStatus;
