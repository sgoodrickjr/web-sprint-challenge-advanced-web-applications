// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

test('renders spinner when "on" is true', () => {
  render(<Spinner on={true} />);
  const spinnerElement = screen.getByText(/please wait/i);
  expect(spinnerElement).toBeInTheDocument();
  expect(spinnerElement).toHaveAttribute('id', 'spinner');
});

test('does not render spinner when "on" is false', () => {
  render(<Spinner on={false} />);
  const spinnerElement = screen.queryByText(/please wait/i);
  expect(spinnerElement).toBeNull(); // Should not render anything
});

