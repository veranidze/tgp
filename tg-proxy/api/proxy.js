export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const token = req.query.token;
  const method = req.query.method || 'sendMessage';

  if (!token) {
    return res.status(400).json({ error: 'Bot token required' });
  }

  const tgUrl = `https://api.telegram.org/bot${token}/${method}`;

  try {
    // Получаем тело запроса
    const bodyData = typeof req.body === 'object' ? new URLSearchParams(req.body).toString() : req.body;

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
    return res.status(500).json({ error: err.message });
  }
}