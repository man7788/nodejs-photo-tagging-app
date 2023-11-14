import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mock = [
  {
    style: {
      left: '110px',
      top: '280px',
    },
    _id: '65380c60e12b05ea4beb10cf',
    name: 'peter',
    __v: 0,
  },
  {
    style: {
      left: '230px',
      top: '360px',
    },
    _id: '65380c76e12b05ea4beb10d1',
    name: 'sam',
    __v: 0,
  },
  {
    style: {
      left: '350px',
      top: '320px',
    },
    _id: '65380c8ae12b05ea4beb10d3',
    name: 'eric',
    __v: 0,
  },
];

vi.mock('./api/targetAPI', () => ({
  __esModule: true,
  default: () => ({
    targets: mock,
    error: null,
    loading: false,
  }),
}));

describe('Dropdown menu', () => {
  describe('Basic menu control', () => {
    it('should display dropdown menu when click anywhere in app', async () => {
      const user = userEvent.setup();

      render(<App />);

      const appScreen = screen.getByTestId('App');

      const menuBefore = screen.getByTestId('menu');
      const boxBefore = screen.getByTestId('box');
      const menuStylesBefore = getComputedStyle(menuBefore);
      const boxStylesBefore = getComputedStyle(boxBefore);

      expect(boxStylesBefore.display).toBe('none');
      expect(menuStylesBefore.display).toBe('none');

      await waitFor(async () => await user.click(appScreen));

      const box = screen.getByTestId('box');
      const menu = screen.getByTestId('menu');
      const menuStyles = getComputedStyle(menu);
      const boxStyles = getComputedStyle(box);

      expect(boxStyles.display).toBe('block');
      expect(menuStyles.display).toBe('block');
    });

    it('should hide dropdown menu when click outside of dropdown menu', async () => {
      const user = userEvent.setup();

      render(<App />);

      const appScreen = screen.getByTestId('App');

      const menuBefore = screen.getByTestId('menu');
      const boxBefore = screen.getByTestId('box');
      const menuStylesBefore = getComputedStyle(menuBefore);
      const boxStylesBefore = getComputedStyle(boxBefore);

      expect(boxStylesBefore.display).toBe('none');
      expect(menuStylesBefore.display).toBe('none');

      await waitFor(async () => await user.click(appScreen));

      const menuShow = screen.getByTestId('menu');
      const boxShow = screen.getByTestId('box');
      const menuStylesShow = getComputedStyle(menuShow);
      const boxStylesShow = getComputedStyle(boxShow);

      expect(boxStylesShow.display).toBe('block');
      expect(menuStylesShow.display).toBe('block');

      await waitFor(async () => await user.click(appScreen));

      const box = screen.getByTestId('box');
      const menu = screen.getByTestId('menu');
      const boxStyles = getComputedStyle(box);
      const menuStyles = getComputedStyle(menu);

      expect(boxStyles.display).toBe('none');
      expect(menuStyles.display).toBe('none');
    });

    it('should hide dropdown menu after selecting a name ', async () => {
      const user = userEvent.setup();

      render(<App />);

      const appScreen = screen.getByTestId('App');

      const menuBefore = screen.getByTestId('menu');
      const boxBefore = screen.getByTestId('box');
      const menuStylesBefore = getComputedStyle(menuBefore);
      const boxStylesBefore = getComputedStyle(boxBefore);

      expect(boxStylesBefore.display).toBe('none');
      expect(menuStylesBefore.display).toBe('none');

      await waitFor(async () => await user.click(appScreen));

      const menuShow = screen.getByTestId('menu');
      const boxShow = screen.getByTestId('box');
      const menuStylesShow = getComputedStyle(menuShow);
      const boxStylesShow = getComputedStyle(boxShow);

      expect(boxStylesShow.display).toBe('block');
      expect(menuStylesShow.display).toBe('block');

      const menuNames = screen.getAllByRole('listitem');

      await waitFor(async () => await user.click(menuNames[0]));

      const box = screen.getByTestId('box');
      const menu = screen.getByTestId('menu');
      const boxStyles = getComputedStyle(box);
      const menuStyles = getComputedStyle(menu);

      expect(boxStyles.display).toBe('none');
      expect(menuStyles.display).toBe('none');
    });
  });

  describe('Control with targets involved', () => {
    describe('Menu control with correct selected name', () => {
      it('should change photo and text styles', async () => {
        // https://runthatline.com/how-to-mock-fetch-api-with-vitest/
        beforeEach(() => {
          global.fetch.mockReset();
        });

        const user = userEvent.setup();

        const fetchedData = { result: true, position: { top: '', left: '' } };

        function createFetchResponse(data) {
          return { json: () => new Promise((resolve) => resolve(data)) };
        }

        global.fetch = vi
          .fn()
          .mockResolvedValue(createFetchResponse(fetchedData));

        render(<App />);

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
        beforeEach(() => {
          global.fetch.mockReset();
        });

        const user = userEvent.setup();

        const fetchedData = { result: true, position: { top: '', left: '' } };

        function createFetchResponse(data) {
          return { json: () => new Promise((resolve) => resolve(data)) };
        }

        global.fetch = vi
          .fn()
          .mockResolvedValue(createFetchResponse(fetchedData));

        render(<App />);

        const appScreen = screen.getByTestId('App');

        await waitFor(async () => await user.click(appScreen));

        const menuNames = screen.getAllByRole('listitem');

        await waitFor(async () => await user.click(menuNames[0]));

        const targetsAfter = screen.getAllByTestId('target');
        const targetsAfterStyles = getComputedStyle(targetsAfter[0]);

        expect(targetsAfterStyles.border).toBe('3px solid cyan');
      });
    });
  });
});

describe('Pop-up screen', () => {
  beforeEach(() => {
    global.fetch.mockReset();
    vi.resetModules();
    vi.useFakeTimers();
  });
  it('should pop up when gameover and display score time', async () => {
    const user = userEvent.setup();

    const fetchedToken = { token: 'token' };
    const fetchedData = { result: true, position: { top: '', left: '' } };

    function createFetchResponse(data) {
      return { json: () => new Promise((resolve) => resolve(data)) };
    }

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(createFetchResponse(fetchedToken))
      .mockResolvedValueOnce(createFetchResponse(fetchedData))
      .mockResolvedValueOnce(createFetchResponse(fetchedData))
      .mockResolvedValueOnce(createFetchResponse(fetchedData));

    render(<App />);

    // https://legacy.reactjs.org/docs/testing-recipes.html#timers
    const appScreen = screen.getByTestId('App');
    const clock = screen.getByTestId('clock');

    const popupBefore = await screen.findByTestId('popup');
    const popupBeforeStyles = getComputedStyle(popupBefore);

    expect(popupBeforeStyles.display).toBe('none');

    // // https://github.com/vitest-dev/vitest/issues/3117
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
    const popupHeader = await screen.findByTestId('popup-header');

    const popupStyles = getComputedStyle(popup);
    const clockTime = clock.textContent;
    const scoreTime = popupHeader.childNodes[2].textContent;

    expect(popupStyles.display).toBe('flex');
    expect(scoreTime).toMatch(clockTime);
  });
});
