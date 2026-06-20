const crypto = require('crypto');

// Hardcoded salt — changing SITE_PASSWORD auto-invalidates old tokens
const SALT = 'swphq-2026';

function makeToken(password) {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, body: '' };
  }

  const PASSWORD = process.env.SITE_PASSWORD || 'worldcup2026';

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }

  if (body.password === PASSWORD) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, token: makeToken(PASSWORD) }),
    };
  }

  return {
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false }),
  };
};
