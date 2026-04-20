import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('Phải render ra được dòng chữ Hello World', () => {
    render(<App />);
    const headingElement = screen.getByText(/Hello World/i);
    expect(headingElement).toBeInTheDocument();
  });
});
