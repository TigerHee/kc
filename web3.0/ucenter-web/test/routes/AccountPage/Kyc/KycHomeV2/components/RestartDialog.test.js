import { fireEvent, screen, waitFor } from "@testing-library/react";
import RestartDialog from "src/components/Account/Kyc/KycHome/components/RestartDialog";
import { customRender } from "test/setup";

describe('test RestartDialog', () => {
  test('test RestartDialog', async () => {
    const mockOnSuccess = jest.fn();
    customRender(
      <RestartDialog open={true} onConfirm={mockOnSuccess} />
    );
    await waitFor(() => {
      const btn = screen.getByText('e45d18983acd4000a57a');
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(mockOnSuccess).toBeCalled();
    });
    
  });
});