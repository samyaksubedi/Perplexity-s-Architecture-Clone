import crypto from 'crypto';

const generateCacheKey = (query) => {
  const normalized = query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '');
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  return `query_cache:${hash}`;
};

export { generateCacheKey };
