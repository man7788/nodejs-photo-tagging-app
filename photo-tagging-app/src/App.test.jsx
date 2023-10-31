import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
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

describe('Menu control without targets involved', () => {
  it('should display dropdown menu when click anywhere in app', async () => {
    const user = userEvent.setup();

    render(<App />);

    const appScreen = screen.getByTestId('App');

    const box = screen.getByTestId('box');
    const menu = screen.getByTestId('menu');

    await waitFor(async () => await user.click(appScreen));

    const boxStyles = getComputedStyle(box);
    const menuStyles = getComputedStyle(menu);

    expect(boxStyles.display).toBe('block');
    expect(menuStyles.display).toBe('block');
  });

  it('should hide dropdown menu when click outside of dropdown menu', async () => {
    const user = userEvent.setup();

    render(<App />);

    const appScreen = screen.getByTestId('App');
    const box = screen.getByTestId('box');
    const menu = screen.getByTestId('menu');

    await waitFor(async () => await user.click(appScreen));
    await waitFor(async () => await user.click(appScreen));

    const boxStyles = getComputedStyle(box);
    const menuStyles = getComputedStyle(menu);

    expect(boxStyles.display).toBe('none');
    expect(menuStyles.display).toBe('none');
  });
});

describe('Menu control with targets involved', () => {
  it('should hide dropdown menu when select name from non-target click', async () => {
    const user = userEvent.setup();

    render(<App />);

    const appScreen = screen.getByTestId('App');
    const box = screen.getByTestId('box');
    const menu = screen.getByTestId('menu');

    await waitFor(async () => await user.click(appScreen));

    const menuNames = screen.getAllByRole('listitem');

    await waitFor(async () => await user.click(menuNames[0]));

    const boxStyles = getComputedStyle(box);
    const menuStyles = getComputedStyle(menu);

    expect(boxStyles.display).toBe('none');
    expect(menuStyles.display).toBe('none');
  });

  it('should hide dropdown menu when select incorrect name from target click', async () => {
    const user = userEvent.setup();

    render(<App />);

    const targets = screen.getAllByTestId('target');

    const box = screen.getByTestId('box');
    const menu = screen.getByTestId('menu');

    await waitFor(async () => await user.click(targets[0]));

    const menuNames = screen.getAllByRole('listitem');

    await waitFor(async () => await user.click(menuNames[1]));

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

      const box = screen.getByTestId('box');
      const menu = screen.getByTestId('menu');

      await waitFor(async () => await user.click(targets[0]));

      const menuNames = screen.getAllByRole('listitem');

      await waitFor(async () => await user.click(menuNames[0]));

      const boxStyles = getComputedStyle(box);
      const menuStyles = getComputedStyle(menu);

      expect(boxStyles.display).toBe('none');
      expect(menuStyles.display).toBe('none');
    });

    it('should change photo and text styles', async () => {
      const user = userEvent.setup();

      render(<App />);

      const target = screen.getAllByTestId('target');
      const photos = screen.getAllByTestId('photo');

      await waitFor(async () => await user.click(target[0]));

      const menuNames = screen.getAllByRole('listitem');

      await waitFor(async () => await user.click(menuNames[0]));

      const photoStyles = getComputedStyle(photos[0]);

      expect(photoStyles.filter).toBe('brightness(50%)');
      expect(photoStyles.color).toBe('rgb(128, 128, 128)');
    });
  });
});
