exports.handler = async (event) => {
  try {
    const apiKey = process.env.LIFI_API_KEY || '';
    const qs = event.queryStringParameters || {};
    const params = new URLSearchParams(qs);
    const url = `https://li.quest/v1/quote?${params.toString()}`;

    const res = await fetch(url, {
      headers: apiKey ? { 'x-lifi-api-key': apiKey } : undefined,
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { 'content-type': 'application/json' },
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch LI.FI quote', message: e?.message || 'Unknown error' }),
    };
  }
};
