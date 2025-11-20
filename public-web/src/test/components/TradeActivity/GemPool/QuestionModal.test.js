/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-06-09 09:53:47
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-25 21:38:36
 * @FilePath: /public-web/src/test/components/TradeActivity/GemPool/QuestionModal.test.js
 * @Description:
 */
import '@testing-library/jest-dom/extend-expect'; // 添加这一行
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import QuestionModal, {
  QuizComponent,
} from 'src/components/TradeActivity/GemPool/containers/QuestionModal.js';
import { customRender } from 'src/test/setup';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
const mockQuestions = [
  {
    questionNo: 1,

    question: '下列哪一種貨幣是穩定幣？',

    answer1: 'USDT',

    answer2: 'BTC',

    answer3: 'ETH',

    answer4: 'SOL',

    busId: '667a7129bb45e60001477c83',
  },

  {
    questionNo: 2,

    question: '下列哪一種貨幣是穩定幣1？',

    answer1: 'USDT1',

    answer2: 'BTC1',

    answer3: 'ETH1',

    answer4: 'SOL1',

    busId: '667a7129bb45e60001477c84',
  },
];

const mockHandleQuestionClose = jest.fn();
const mockHandleResultDialogVisible = jest.fn(() => true);
const mocktBonusCoefficientValue = jest.fn(() => 2);

const initialState = {
  gempool: {
    questionModal: true,
    questionId: '123',
    currentInfo: {
      campaignId: '123',
      earnTokenName: 'BTC',
    },
  },
  loading: {
    effects: {
      'gempool/pullGemPoolExam': false,
      'gempool/postGemPoolExamSubmit': false,
    },
  },
};

describe('QuestionModal', () => {
  it('renders modal with content loading', () => {
    const mockDispatch = jest.fn(() => Promise.resolve([]));
    useDispatch.mockReturnValue(mockDispatch);

    customRender(<QuestionModal type="detail" />, {
      ...initialState,
      loading: {
        effects: {
          'gempool/pullGemPoolExam': true,
        },
      },
    });
  });

  it('renders questions and answers correctly', async () => {
    const mockDispatch = jest.fn(() => Promise.resolve(mockQuestions));
    useDispatch.mockReturnValue(mockDispatch);

    customRender(<QuestionModal type="detail" />, initialState);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'gempool/pullGemPoolExam',
        payload: {
          campaignId: '123',
        },
      });
    });

    expect(screen.getByText('1. 下列哪一種貨幣是穩定幣？')).toBeInTheDocument();

    expect(screen.getByText('USDT')).toBeInTheDocument();

    expect(screen.getByText('BTC')).toBeInTheDocument();

    expect(screen.getByText('ETH')).toBeInTheDocument();

    expect(screen.getByText('SOL')).toBeInTheDocument();

    expect(screen.getByText('2. 下列哪一種貨幣是穩定幣1？')).toBeInTheDocument();

    expect(screen.getByText('USDT1')).toBeInTheDocument();

    expect(screen.getByText('BTC1')).toBeInTheDocument();

    expect(screen.getByText('ETH1')).toBeInTheDocument();

    expect(screen.getByText('SOL1')).toBeInTheDocument();
  });

  it('submits answers correctly', async () => {
    const mockDispatch = jest.fn(() => Promise.resolve(mockQuestions));
    useDispatch.mockReturnValue(mockDispatch);

    const { getByLabelText } = customRender(<QuestionModal />, initialState);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'gempool/pullGemPoolExam',
        payload: {
          campaignId: '123',
        },
      });
    });

    fireEvent.click(getByLabelText('USDT'));

    fireEvent.click(getByLabelText('USDT1'));

    expect(screen.getByText('confirm (2/2)')).toBeInTheDocument();
  });
});

describe('QuizComponent', () => {
  it('renders modal with content loading', () => {
    customRender(
      <QuizComponent
        questions={mockQuestions}
        handleQuestionClose={mockHandleQuestionClose}
        type="detail"
        questionId="123"
      />,
      {
        ...initialState,
        loading: {
          effects: {
            'gempool/pullGemPoolExam': true,
          },
        },
      },
    );
  });

  it('renders questions and answers correctly', () => {
    customRender(
      <QuizComponent
        questions={mockQuestions}
        handleQuestionClose={mockHandleQuestionClose}
        type="detail"
        questionId="123"
      />,

      initialState,
    );

    expect(screen.getByText('1. 下列哪一種貨幣是穩定幣？')).toBeInTheDocument();

    expect(screen.getByText('USDT')).toBeInTheDocument();

    expect(screen.getByText('BTC')).toBeInTheDocument();

    expect(screen.getByText('ETH')).toBeInTheDocument();

    expect(screen.getByText('SOL')).toBeInTheDocument();

    expect(screen.getByText('2. 下列哪一種貨幣是穩定幣1？')).toBeInTheDocument();

    expect(screen.getByText('USDT1')).toBeInTheDocument();

    expect(screen.getByText('BTC1')).toBeInTheDocument();

    expect(screen.getByText('ETH1')).toBeInTheDocument();

    expect(screen.getByText('SOL1')).toBeInTheDocument();
  });

  it('submits answers correctly', async () => {
    const { getByText, getByLabelText } = customRender(
      <QuizComponent
        questions={mockQuestions}
        handleQuestionClose={mockHandleQuestionClose}
        type="detail"
        questionId="123"
      />,

      initialState,
    );

    fireEvent.click(getByLabelText('USDT'));

    fireEvent.click(getByLabelText('USDT1'));

    expect(screen.getByText('confirm (2/2)')).toBeInTheDocument();
  });

  it('handles submit logic wrong', async () => {
    const mockDispatch = jest.fn().mockResolvedValue({
      result: 1,
      results: [],
      bonusCoefficient: 0.1,
    });

    useDispatch.mockReturnValue(mockDispatch);

    const { getByText, getByLabelText } = customRender(
      <QuizComponent
        questions={mockQuestions}
        handleQuestionClose={mockHandleQuestionClose}
        handleResultDialogVisible={mockHandleResultDialogVisible}
        handleBonusCoefficientValue={mocktBonusCoefficientValue}
        type="detail"
        questionId="123"
      />,

      {
        ...initialState,

        dispatch: mockDispatch,
      },
    );

    fireEvent.click(getByLabelText('USDT'));

    fireEvent.click(getByLabelText('BTC1'));

    fireEvent.click(getByText('confirm (2/2)'));

    await waitFor(() => {
      expect(mockHandleQuestionClose).toHaveBeenCalled();
    });
  });

  it('handles submit logic correctly', async () => {
    const mockDispatch = jest.fn().mockResolvedValue({
      result: 1,
      results: [],
      bonusCoefficient: 0.1,
    });

    useDispatch.mockReturnValue(mockDispatch);

    const { getByText, getByLabelText } = customRender(
      <QuizComponent
        questions={mockQuestions}
        handleQuestionClose={mockHandleQuestionClose}
        handleResultDialogVisible={mockHandleResultDialogVisible}
        handleBonusCoefficientValue={mocktBonusCoefficientValue}
        type="detail"
        questionId="123"
      />,

      {
        ...initialState,

        dispatch: mockDispatch,
      },
    );

    fireEvent.click(getByLabelText('USDT'));
    fireEvent.click(getByLabelText('USDT1'));
    fireEvent.click(getByText('confirm (2/2)'));
  });
});
