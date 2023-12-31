import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('./api/targetAPI', () => ({
  useTargets: vi.fn().mockReturnValue({
    targets: [{ name: 'peter' }, { name: 'sam' }, { name: 'eric' }],
    error: null,
    loading: false,
  }),
}));

vi.mock('./api/scoreAPI', () => ({
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

vi.mock('./components/Popup', () => ({
  default: () => {
    return <div></div>;
  },
}));

describe('targets', () => {
  it('should highlight selected targets', async () => {
    const user = userEvent.setup();

    render(<App />);

    const targets = screen.getAllByTestId('photo');
    const images = screen.getAllByRole('img');

    await user.click(images[0]);
    const ericStyleSelected = getComputedStyle(targets[0]);

    expect(ericStyleSelected.filter).toBe('brightness(100%)');
  });

  it('should show game rule when targets selected', async () => {
    const user = userEvent.setup();

    render(<App />);

    const images = screen.getAllByRole('img');

    await user.click(images[0]);

    const rule = await screen.findByText(
      /Select all targets to compete for highscore/i,
    );

    expect(rule).toBeInTheDocument;

    await user.click(images[1]);
    await user.click(images[2]);

    expect(rule).not.toBeInTheDocument;
  });
});

describe('start button', () => {
  it('should not start game when no target selected', async () => {
    const user = userEvent.setup();

    render(<App />);

    const startButton = screen.getByRole('button', { name: /start/i });

    await user.click(startButton);

    const warning = await screen.findByText(/Select at least one target/i);

    expect(warning).toBeInTheDocument;
  });

  it('should start game when at least one target selected', async () => {
    const user = userEvent.setup();

    render(<App />);

    const eric = screen.getByRole('img', { name: /eric/i });
    const startButton = screen.getByRole('button', { name: /start/i });

    await user.click(eric);
    await user.click(startButton);

    const clock = await screen.findByTestId('clock');

    expect(clock).toBeInTheDocument;
  });
});

describe('highscore button', () => {
  it('should show highscore when clicked', async () => {
    const user = userEvent.setup();

    render(<App />);

    const startButtons = screen.getAllByRole('button');

    await user.click(startButtons[1]);

    const scores = await screen.findAllByRole('listitem');
    expect(scores).toHaveLength(5);
  });
  it('home button in highscore should return to home when clicked', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    expect(container).toMatchSnapshot();

    const startButtons = screen.getAllByRole('button');

    await user.click(startButtons[1]);

    const homeButton = screen.getByRole('button');

    await user.click(homeButton);

    expect(container).toMatchSnapshot();
  });
});
