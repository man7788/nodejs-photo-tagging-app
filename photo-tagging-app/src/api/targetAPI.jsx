import { useEffect, useState } from 'react';

const useTargets = () => {
  const [targets, setTargets] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/targets', { mode: 'cors' })
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

export default useTargets;
