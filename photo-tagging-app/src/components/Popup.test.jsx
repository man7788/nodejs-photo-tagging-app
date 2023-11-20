import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popup from './Popup';

describe('Popup', () => {
  it('should popup when gameover with score', async () => {
    beforeEach(() => {
      global.fetch.mockReset();
      vi.resetModules();
    });

    const fetchedToken = { token: 'token' };

    function createFetchResponse(data) {
      return { json: () => new Promise((resolve) => resolve(data)) };
    }

    global.fetch = vi.fn().mockResolvedValue(createFetchResponse(fetchedToken));

    const { rerender } = render(<Popup />);

    const popup = await screen.findByTestId('popup');
    const popupStyles = getComputedStyle(popup);

    expect(popupStyles.display).toBe('none');

    rerender(<Popup updatePopup={{ show: true }} score={'01:01:01'} />);

    const popupShow = await screen.findByTestId('popup');
    const popupShowStyles = getComputedStyle(popupShow);

    expect(popupShowStyles.display).toBe('flex');
    expect(popupShow.childNodes[0].childNodes[2].textContent).toBe('01:01:01');
  });

  it('should submit highscore with form input', async () => {
    // https://runthatline.com/how-to-mock-fetch-api-with-vitest/
    beforeEach(() => {
      global.fetch.mockReset();
    });

    const user = userEvent.setup();

    const fetchedToken = { token: 'token' };

    const scoreObj = {
      name: 'Foobar',
      time: '01:01:01',
    };

    const fetchedResponse = [
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
    ];

    function createFetchResponse(data) {
      return { json: () => new Promise((resolve) => resolve(data)) };
    }
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(createFetchResponse(fetchedToken))
      .mockResolvedValueOnce(createFetchResponse(scoreObj))
      .mockResolvedValueOnce(createFetchResponse(fetchedResponse));

    render(<Popup updatePopup={{ show: true }} score={'01:01:01'} />);

    const input = await screen.findByRole('textbox');
    const button = await screen.findByRole('button');

    await waitFor(async () => await user.type(input, 'Foobar'));

    expect(input.value).toBe('Foobar');

    await waitFor(async () => await user.click(button));

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      `http://localhost:3000/score/create`,
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: JSON.stringify(scoreObj),
      },
    );
  });

  it('should show highscore after form submit', async () => {
    beforeEach(() => {
      global.fetch.mockReset();
      vi.resetModules();
    });

    const user = userEvent.setup();

    const fetchedToken = { token: 'token' };

    const scoreObj = {
      name: 'Foobar',
      time: '01:01:01',
    };

    const fetchedResponse = [
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
    ];

    function createFetchResponse(data) {
      return { json: () => new Promise((resolve) => resolve(data)) };
    }
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(createFetchResponse(fetchedToken))
      .mockResolvedValueOnce(createFetchResponse(scoreObj))
      .mockResolvedValueOnce(createFetchResponse(fetchedResponse));

    render(<Popup updatePopup={{ show: true }} />);

    const input = await screen.findByRole('textbox');
    const button = await screen.findByRole('button');

    await waitFor(async () => await user.type(input, 'Foobar'));

    expect(input.value).toBe('Foobar');

    await waitFor(async () => await user.click(button));

    const tableHeading = await screen.findByRole('heading', {
      name: /Top 5 Players/i,
    });
    const highscore = await screen.findAllByRole('listitem');

    expect(fetch).toHaveBeenCalled(0);
    expect(tableHeading.textContent).toMatch(/Top 5 Players/);
    expect(highscore).toHaveLength(5);
  });
});
