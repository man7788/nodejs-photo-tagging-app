import { useEffect, useState } from 'react';
import apiDomain from './apiDomain';

const api = apiDomain();

const useTargets = () => {
  const [targets, setTargets] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/target/names`, { mode: 'cors' })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('server error');
        }
        return response.json();
      })
      .then((response) => setTargets(response))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { targets, error, loading };
};

const checkTargetAPI = async (postData) => {
  try {
    const response = await fetch(`${api}/target/check`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (response.status >= 400) {
      throw new Error('server error');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
};

export { useTargets, checkTargetAPI };
