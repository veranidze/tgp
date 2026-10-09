export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { token, method = 'sendMessage' } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token missing' });
  }

  const tgUrl = `https://api.telegram.org/bot${token}/${method}`;

  try {
    // Vercel автоматически парсит x-www-form-urlencoded в объект req.body.
    // Преобразуем его обратно в URLSearchParams для отправки в Telegram:
    let bodyData;
    if (typeof req.body === 'object' && req.body !== null) {
      bodyData = new URLSearchParams(req.body).toString();
    } else {
      bodyData = req.body;
    }

    const response = await fetch(tgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyData
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ description: err.message, ok: false });
  }
}
