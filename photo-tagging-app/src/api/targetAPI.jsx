import apiDomain from './apiDomain';

const api = apiDomain();

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

export { checkTargetAPI };
