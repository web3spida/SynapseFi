exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    const name = body?.name;
    const mime = body?.mime;
    const size = body?.size;
    const dataUrl = body?.dataUrl;
    if (!name || !dataUrl) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing file payload' }) };
    }
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        mime,
        size,
        url: dataUrl,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process upload', message: e?.message || 'Unknown error' }),
    };
  }
};
