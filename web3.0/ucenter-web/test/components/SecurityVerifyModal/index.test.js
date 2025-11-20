import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import { customRender } from 'test/setup';

// Mock JsBridge
jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn().mockReturnValue(false), // Mocking isApp to return false for web environment
  open: jest.fn(), // Mocking open method if needed
}));

describe('SecurityVerifyModal', () => {
  it('renders with default props', () => {
    const { getByText } = customRender(
      <SecurityVerifyModal visible modalTitle="Test Modal">
        <div>Modal content</div>
      </SecurityVerifyModal>,
    );

    expect(getByText('Test Modal')).toBeInTheDocument();
    expect(getByText('Modal content')).toBeInTheDocument();
  });

  it('hides top and bottom tips when specified', () => {
    const { queryByText } = customRender(
      <SecurityVerifyModal visible modalTitle="Test Modal" showTopTip={false} showBottomTip={false}>
        <div>Modal content</div>
      </SecurityVerifyModal>,
    );

    expect(queryByText('This is a top tip message')).toBeNull();
    expect(queryByText('Forgot your password?')).toBeNull();
  });
});
