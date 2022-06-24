import { fireEvent, render, screen } from '@testing-library/react'
import Login from '.'

test('renders login', () => {
  render(<Login />);

  const button = screen.getByRole("button");
  expect(button).toBeDisabled();
  const input = screen.getByDisplayValue("");
  fireEvent.change(input, {target: {value: 'christian@abstracted.io'}})
  setTimeout(() => expect(button).not.toBeDisabled(), 1000)
})