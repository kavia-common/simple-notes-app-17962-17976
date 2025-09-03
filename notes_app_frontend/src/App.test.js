import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders header and can create a new note', () => {
  render(<App />);
  expect(screen.getByText(/Simple Notes/i)).toBeInTheDocument();

  const createButtons = screen.getAllByRole('button', { name: /new/i });
  const create = createButtons[0];
  fireEvent.click(create);

  // After creation, there should be at least one "Untitled note" visible either in sidebar or editor
  expect(screen.getByDisplayValue(/Untitled note/i)).toBeInTheDocument();
});
