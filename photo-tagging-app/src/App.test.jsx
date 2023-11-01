import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from './App';

// beforeEach(() => {
//   vi.useFakeTimers();
// });

// afterEach(() => {
//   vi.runOnlyPendingTimers();
//   vi.useRealTimers();
// });

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
  describe('Control without targets involved', () => {
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
  });

  describe('Control with targets involved', () => {
    it('should hide dropdown menu when select name from non-target click', async () => {
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

    it('should hide dropdown menu when select incorrect name from target click', async () => {
      const user = userEvent.setup();

      render(<App />);

      const targets = screen.getAllByTestId('target');

      const menuBefore = screen.getByTestId('menu');
      const boxBefore = screen.getByTestId('box');
      const menuStylesBefore = getComputedStyle(menuBefore);
      const boxStylesBefore = getComputedStyle(boxBefore);

      expect(boxStylesBefore.display).toBe('none');
      expect(menuStylesBefore.display).toBe('none');

      await waitFor(async () => await user.click(targets[0]));

      const menuShow = screen.getByTestId('menu');
      const boxShow = screen.getByTestId('box');
      const menuStylesShow = getComputedStyle(menuShow);
      const boxStylesShow = getComputedStyle(boxShow);

      expect(boxStylesShow.display).toBe('block');
      expect(menuStylesShow.display).toBe('block');

      const menuNames = screen.getAllByRole('listitem');

      await waitFor(async () => await user.click(menuNames[1]));

      const box = screen.getByTestId('box');
      const menu = screen.getByTestId('menu');
      const boxStyles = getComputedStyle(box);
      const menuStyles = getComputedStyle(menu);

      expect(boxStyles.display).toBe('none');
      expect(menuStyles.display).toBe('none');
    });

    describe('Menu control with correct selected name', () => {
      it('should hide dropdown menu from target click', async () => {
        const user = userEvent.setup();

        render(<App />);

        const targets = screen.getAllByTestId('target');

        const menuBefore = screen.getByTestId('menu');
        const boxBefore = screen.getByTestId('box');
        const menuStylesBefore = getComputedStyle(menuBefore);
        const boxStylesBefore = getComputedStyle(boxBefore);

        expect(boxStylesBefore.display).toBe('none');
        expect(menuStylesBefore.display).toBe('none');

        await waitFor(async () => await user.click(targets[0]));

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

      it('should change photo and text styles', async () => {
        const user = userEvent.setup();

        render(<App />);

        const targets = screen.getAllByTestId('target');

        await waitFor(async () => await user.click(targets[0]));

        const menuNames = screen.getAllByRole('listitem');

        await waitFor(async () => await user.click(menuNames[0]));

        const photos = screen.getAllByTestId('photo');
        const photoStyles = getComputedStyle(photos[0]);

        expect(photoStyles.filter).toBe('brightness(50%)');
        expect(photoStyles.color).toBe('rgb(128, 128, 128)');
      });
    });
  });
});

describe('Pop-up screen', () => {
  it('should pop up when gameover and display score time', async () => {
    vi.useFakeTimers();

    const user = userEvent.setup();

    render(<App />);

    // https://legacy.reactjs.org/docs/testing-recipes.html#timers

    const targets = screen.getAllByTestId('target');
    const clock = screen.getByTestId('clock');

    const popupBefore = screen.getByTestId('popup');
    const popupBeforeStyles = getComputedStyle(popupBefore);

    expect(popupBeforeStyles.display).toBe('none');

    // // https://github.com/vitest-dev/vitest/issues/3117
    await waitFor(async () => await user.click(targets[0]));
    const menuNames0 = await screen.findAllByRole('listitem');
    await waitFor(async () => await user.click(menuNames0[0]));

    await waitFor(async () => await user.click(targets[1]));
    const menuNames1 = await screen.findAllByRole('listitem');
    await waitFor(async () => await user.click(menuNames1[1]));

    await waitFor(async () => await user.click(targets[2]));
    const menuNames2 = await screen.findAllByRole('listitem');
    await waitFor(async () => await user.click(menuNames2[2]));

    act(() => {
      vi.runAllTimers();
    });

    const popup = screen.getByTestId('popup');
    const popupHeader = screen.getByTestId('popup-header');

    const popupStyles = getComputedStyle(popup);
    const clockTime = clock.textContent;
    const scoreTime = popupHeader.childNodes[2].textContent;

    expect(popupStyles.display).toBe('flex');
    expect(scoreTime).toMatch(clockTime);
  });
});
