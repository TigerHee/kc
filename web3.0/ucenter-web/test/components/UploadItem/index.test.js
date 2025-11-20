import { Form } from '@kux/mui';
import { fireEvent, waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import UploadItem from 'src/components/Authentication/UploadItem';
import { customRender } from 'test/setup';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const mockMessageError = jest.fn();

jest.mock('@kux/mui', () => ({
  __esModule: true,
  ...jest.requireActual('@kux/mui'),
  useSnackbar: () => {
    return {
      message: {
        error: mockMessageError,
      },
    };
  },
}));

jest.mock('utils/imageCompressor', () => jest.fn((file) => Promise.resolve(file)));

describe('UploadItem Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders UploadItem component and handles upload', async () => {
    const { getByTestId } = customRender(
      <Form>
        <UploadItem namespace="rebind_phone" id="frontPic" uploadParams={{}} />
      </Form>,
    );

    expect(getByTestId('frontPic')).toBeInTheDocument();

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = getByTestId('frontPic');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'rebind_phone/upload',
        payload: {
          file: expect.any(File),
          id: 'frontPic',
          uploadParams: {},
        },
        callBack: expect.any(Function),
      });
    });
  });

  test('displays error message on invalid file format', () => {
    const { getByTestId } = customRender(
      <Form>
        <UploadItem namespace="rebind_phone" id="frontPic" uploadParams={{}} />
      </Form>,
    );

    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    const input = getByTestId('frontPic');
    fireEvent.change(input, { target: { files: [file] } });
    waitFor(() => {
      expect(mockMessageError).toHaveBeenCalled();
    });
  });

  test('displays error message on file size exceeding limit', () => {
    const { getByTestId } = customRender(
      <Form>
        <UploadItem namespace="rebind_phone" id="frontPic" uploadParams={{}} />
      </Form>,
    );

    const file = new File(['a'.repeat(1024 * 1024 * 4)], 'example.png', { type: 'image/png' });
    const input = getByTestId('frontPic');
    fireEvent.change(input, { target: { files: [file] } });
    waitFor(() => {
      expect(mockMessageError).toHaveBeenCalled();
    });
  });
});
