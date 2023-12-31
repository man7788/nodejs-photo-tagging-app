import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popup from './Popup';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('../api/tokenAPI', () => ({
  default: vi.fn().mockReturnValue({
    token: 'token',
    tokenError: null,
    tokenLoading: false,
  }),
}));

vi.mock('../api/scoreAPI', () => ({
  submitScoreAPI: vi.fn().mockReturnValue({
    result: { name: 'John Doe' },
  }),
  useHighScore: vi.fn().mockReturnValue({
    list: [
      {
        _id: '653c00138e1ff544d19b3b63',
        name: 'test4',
        time: '00:00:03',
        __v: 0,
      },
      {
        _id: '653bf8a78e1ff544d19b3b42',
        name: 'test1',
        time: '00:00:03',
        __v: 0,
      },
      {
        _id: '653c00b18e1ff544d19b3b74',
        name: 'bbb',
        time: '00:00:03',
        __v: 0,
      },
      {
        _id: '653bfffc8e1ff544d19b3b5d',
        name: 'test3',
        time: '00:00:03',
        __v: 0,
      },
      {
        _id: '653c00a68e1ff544d19b3b6e',
        name: 'aaa',
        time: '00:00:04',
        __v: 0,
      },
    ],
    error: null,
    loading: false,
  }),
}));

describe('Popup', () => {
  it('should popup when gameover with score', async () => {
    render(
      <Popup finishTime={123} finishClock={'01:01:01'} showInput={true} />,
    );

    const popup = await screen.findByTestId('popup');
    const popupStyles = getComputedStyle(popup);

    expect(popupStyles.display).toBe('flex');
    expect(popup.childNodes[1].childNodes[1].textContent).toBe('01:01:01');
  });

  it('should not popup when showInput is false', async () => {
    render(
      <Popup finishTime={123} finishClock={'01:01:01'} showInput={false} />,
    );

    const form = screen.queryByRole('form');

    expect(form).not.toBeInTheDocument();
  });

  it('should submit highscore with form input', async () => {
    // https://runthatline.com/how-to-mock-fetch-api-with-vitest/
    const user = userEvent.setup();

    render(
      <Popup finishTime={123} finishClock={'01:01:01'} showInput={true} />,
    );

    const input = await screen.findByRole('textbox');
    const button = await screen.findByRole('button');

    await waitFor(async () => await user.type(input, 'Foobar'));

    expect(input.value).toBe('Foobar');

    await waitFor(async () => await user.click(button));

    const popup = await screen.findByTestId('popup');
    const highscore = await screen.findByTestId('highscore');

    const popupStyle = getComputedStyle(popup);
    const highscoreStyle = getComputedStyle(highscore);

    expect(popupStyle.display).toBe('none');
    expect(highscoreStyle.display).toBe('block');
  });

  it('should show highscore after form submit', async () => {
    const user = userEvent.setup();

    render(
      <Popup finishTime={123} finishClock={'01:01:01'} showInput={true} />,
    );

    const input = await screen.findByRole('textbox');
    const button = await screen.findByRole('button');

    await waitFor(async () => await user.type(input, 'Foobar'));

    expect(input.value).toBe('Foobar');

    await waitFor(async () => await user.click(button));

    const highscore = await screen.findByTestId('highscore');
    const scores = await screen.findAllByRole('listitem');

    const highscoreStyle = getComputedStyle(highscore);

    expect(highscoreStyle.display).toBe('block');
    expect(scores).toHaveLength(5);
  });
});
