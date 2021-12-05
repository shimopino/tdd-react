import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { LoginForm } from './LoginForm';
import userEvent from '@testing-library/user-event';

const server = setupServer(
  rest.post('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    console.log(req);
    return res(ctx.status(404));
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('ログインフォームのサンプル', () => {
  it('正常系', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, 'sample@example.com');

    const passwordInput = screen.getByLabelText(/password/i);
    userEvent.type(passwordInput, 'sample');

    userEvent.click(screen.getByRole('button'));

    await waitForElementToBeRemoved(() => screen.queryByText('Submitting'));

    expect(await screen.findByText('Success')).toBeInTheDocument();
  });
});
