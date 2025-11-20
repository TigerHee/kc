import AbsoluteLoading from 'components/AbsoluteLoading';
import { useSelector } from 'react-redux';

const SecurityLoading = ({ children }) => {
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const isPullSecurtyMethods = useSelector(
    (state) => state.loading.effects['user/pullSecurtyMethods'],
  );

  return isPullUserLoading || isPullSecurtyMethods ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AbsoluteLoading />
    </div>
  ) : (
    children
  );
};

export default SecurityLoading;
