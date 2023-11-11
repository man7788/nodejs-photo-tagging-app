const apiDomain = () => {
  const production = process.env.NODE_ENV === 'production';
  return production
    ? 'https://photo-api-vlcs.onrender.com'
    : 'http://localhost:3000';
};

export default apiDomain;
