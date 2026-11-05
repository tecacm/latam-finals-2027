import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('shows the copyright, an airmail stripe and external links that open safely', () => {
    render(
      <Footer
        copyright="© 2027 ICPC Latin America Championship"
        links={[{ label: 'icpc.global', href: 'https://icpc.global' }]}
      />,
    );
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2027 ICPC Latin America Championship');
    expect(screen.getByTestId('airmail-stripe')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'icpc.global' });
    expect(link).toHaveAttribute('href', 'https://icpc.global');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
