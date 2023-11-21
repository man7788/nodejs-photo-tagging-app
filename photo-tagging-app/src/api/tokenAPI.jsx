import { useEffect, useState } from 'react';
import apiDomain from './apiDomain';

const api = apiDomain();

const useToken = () => {
  const [token, setToken] = useState({});
  const [tokenError, setTokenError] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${api}/token`, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ handler: 'penguins' }),
        });
        if (response.status >= 400) {
          throw new Error('server error');
        }
        const data = await response.json();
        setToken(data.token);
        setTokenError(null);
      } catch (err) {
        console.error(err);
        setTokenError(err.message);
      } finally {
        setTokenLoading(false);
      }
    };
    getData();
  }, []);

  return { token, tokenError, tokenLoading };
};

export default useToken;
