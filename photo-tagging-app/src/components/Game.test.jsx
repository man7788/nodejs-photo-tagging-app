import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Game from './Game';

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('../api/targetAPI', () => ({
  useTargets: vi.fn().mockReturnValue({
    targets: [{ name: 'peter' }, { name: 'sam' }, { name: 'eric' }],
    error: null,
    loading: false,
  }),
  checkTargetAPI: vi.fn().mockReturnValue({
    result: true,
    position: { top: 115, left: 282 },
  }),
}));

vi.mock('../api/tokenAPI', () => ({
  default: vi.fn().mockReturnValue({
    token: { token: 'token' },
    tokenError: null,
    tokenLoading: false,
  }),
}));

describe('Dropdown menu', () => {
  describe('Basic menu control', () => {
    it('should display dropdown menu when click anywhere in app', async () => {
      const user = userEvent.setup();

      render(<Game />);

      const appScreen = screen.getByTestId('App');

      const box = screen.queryByTestId('box');
      const menu = screen.queryByTestId('menu');

      expect(box).not.toBeInTheDocument();
      expect(menu).not.toBeInTheDocument();

      await waitFor(async () => await user.click(appScreen));

      const boxShow = screen.getByTestId('box');
      const menuShow = screen.getByTestId('menu');
      const menuStyles = getComputedStyle(menuShow);
      const boxStyles = getComputedStyle(boxShow);

      expect(boxStyles.display).toBe('block');
      expect(menuStyles.display).toBe('block');
    });

    it('should hide dropdown menu when click outside of dropdown menu', async () => {
      const user = userEvent.setup();

      render(<Game />);

      const appScreen = screen.getByTestId('App');

      await waitFor(async () => await user.click(appScreen));

      const menuShow = screen.getByTestId('menu');
      const boxShow = screen.getByTestId('box');
      const menuStylesShow = getComputedStyle(menuShow);
      const boxStylesShow = getComputedStyle(boxShow);

      expect(boxStylesShow.display).toBe('block');
      expect(menuStylesShow.display).toBe('block');

      await waitFor(async () => await user.click(appScreen));

      const box = screen.queryByTestId('box');
      const menu = screen.queryByTestId('menu');

      expect(box).not.toBeInTheDocument();
      expect(menu).not.toBeInTheDocument();
    });

    it('should hide dropdown menu after selecting a name ', async () => {
      const user = userEvent.setup();

      render(<Game />);

      const appScreen = screen.getByTestId('App');

      await waitFor(async () => await user.click(appScreen));

      const menuNames = await screen.findAllByRole('listitem');

      await waitFor(async () => await user.click(menuNames[0]));

      const box = screen.queryByTestId('box');
      const menu = screen.queryByTestId('menu');

      expect(box).not.toBeInTheDocument();
      expect(menu).not.toBeInTheDocument();
    });
  });

  describe('Control with targets involved', () => {
    describe('Menu control with correct selected name', () => {
      it('should change photo and text styles', async () => {
        const user = userEvent.setup();

        render(<Game />);

        const appScreen = screen.getByTestId('App');

        await waitFor(async () => await user.click(appScreen));

        const menuNames = screen.getAllByRole('listitem');

        await waitFor(async () => await user.click(menuNames[0]));

        const photos = screen.getAllByTestId('photo');
        const photoStyles = getComputedStyle(photos[0]);

        expect(photoStyles.filter).toBe('brightness(50%)');
        expect(photoStyles.color).toBe('rgb(128, 128, 128)');
      });

      it('should highlight correctly selected target', async () => {
        const user = userEvent.setup();

        render(<Game />);

        const appScreen = screen.getByTestId('App');

        await waitFor(async () => await user.click(appScreen));

        const menuNames = screen.getAllByRole('listitem');

        await waitFor(async () => await user.click(menuNames[0]));

        const targetsAfter = screen.getAllByTestId('target');
        const targetsAfterStyles = getComputedStyle(targetsAfter[0]);

        expect(targetsAfterStyles.border).toBe('3px solid cyan');
      });
    });
    describe('Menu control with incorrect selected name', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should display try again prompt and hide after 2 seconds', async () => {
        const user = userEvent.setup();

        const checkTarget = await import('../api/targetAPI');
        checkTarget.checkTargetAPI = vi.fn().mockReturnValue({ result: false });

        render(<Game />);

        const appScreen = screen.getByTestId('App');

        await waitFor(async () => await user.click(appScreen));

        const menuNames = await screen.findAllByRole('listitem');

        await act(async () => {
          await act(async () => {
            await waitFor(async () => await user.click(menuNames[0]));
          });
        });

        const tryAgain = await screen.findByRole('heading', {
          name: /Try Again/i,
        });

        const tryAgainStyle = getComputedStyle(tryAgain);

        expect(tryAgainStyle.display).toBe('block');

        act(() => {
          vi.advanceTimersByTime(1000);
        });

        act(() => {
          vi.advanceTimersByTime(1000);
        });

        const tryAgainHide = screen.queryByTestId('prompt');

        expect(tryAgainHide).not.toBeInTheDocument();
      });

      it('should display try again prompt and hide after click on app', async () => {
        const user = userEvent.setup();

        const checkTarget = await import('../api/targetAPI');
        checkTarget.checkTargetAPI = vi.fn().mockReturnValue({ result: false });

        render(<Game />);

        const appScreen = screen.getByTestId('App');

        await waitFor(async () => await user.click(appScreen));

        const menuNames = await screen.findAllByRole('listitem');

        await act(async () => {
          await act(async () => {
            await waitFor(async () => await user.click(menuNames[0]));
          });
        });

        const tryAgain = await screen.findByRole('heading', {
          name: /Try Again/i,
        });

        const tryAgainStyle = getComputedStyle(tryAgain);

        expect(tryAgainStyle.display).toBe('block');

        await waitFor(async () => await user.click(appScreen));

        const tryAgainHide = screen.queryByTestId('prompt');

        expect(tryAgainHide).not.toBeInTheDocument();
      });
    });
  });
});

describe('Pop-up screen', () => {
  // https://legacy.reactjs.org/docs/testing-recipes.html#timers
  // // https://github.com/vitest-dev/vitest/issues/3117
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  it('should pop up when gameover and display score time', async () => {
    const user = userEvent.setup();

    const checkTarget = await import('../api/targetAPI');
    checkTarget.checkTargetAPI = vi.fn().mockReturnValue({ result: true });

    render(<Game />);

    const appScreen = screen.getByTestId('App');
    const clock = screen.getByTestId('clock');

    const popupBefore = screen.queryByTestId('popup');

    expect(popupBefore).not.toBeInTheDocument();

    await waitFor(async () => await user.click(appScreen));
    const menuNames0 = await screen.findAllByRole('listitem');
    await act(async () => {
      await act(async () => {
        await waitFor(async () => await user.click(menuNames0[0]));
      });
    });

    await waitFor(async () => await user.click(appScreen));
    const menuNames1 = await screen.findAllByRole('listitem');
    await act(async () => {
      await act(async () => {
        await waitFor(async () => await user.click(menuNames1[1]));
      });
    });

    await waitFor(async () => await user.click(appScreen));
    const menuNames2 = await screen.findAllByRole('listitem');
    await act(async () => {
      await act(async () => {
        await waitFor(async () => await user.click(menuNames2[2]));
      });
    });

    act(() => {
      vi.runAllTimers();
    });

    const popup = await screen.findByTestId('popup');
    const popupStyles = getComputedStyle(popup);
    const clockTime = clock.textContent;
    const scoreTime = popup.childNodes[1].childNodes[1].textContent;

    expect(popupStyles.display).toBe('flex');
    expect(scoreTime).toMatch(clockTime);
  });
});

describe('Home button', () => {
  it('should render home when clicked', async () => {
    const user = userEvent.setup();

    render(<Game />);

    const homeButton = screen.getByRole('button');

    await act(async () => {
      await waitFor(async () => await user.click(homeButton));
    });

    const heading = await screen.findByRole('heading');

    expect(heading.textContent).toMatch(/Find Them All:/);
  });
});
