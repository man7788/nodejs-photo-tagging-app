import { useEffect, useState } from 'react';
import apiDomain from './apiDomain';

const api = apiDomain();

const submitScoreAPI = async (token, scoreObj) => {
  try {
    const response = await fetch(`${api}/score/create`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scoreObj),
    });

    if (response.status >= 400) {
      throw new Error('server error');
    }

    const data = await response.json();

    if (data && data.errors) {
      return { message: 'form validation error', error: data.errors };
    }

    console.log('Success', data);
    return data;
  } catch (err) {
    return { error: err.message };
  }
};

const useHighScore = () => {
  const [list, setList] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/score/highscore`, { mode: 'cors' })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('server error');
        }
        return response.json();
      })
      .then((response) => setList(response))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { list, error, loading };
};

export { submitScoreAPI, useHighScore };
