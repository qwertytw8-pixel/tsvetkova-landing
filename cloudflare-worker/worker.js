// Cloudflare Worker: принимает данные формы и отправляет в Telegram
// Переменные окружения (настраиваются в Cloudflare Dashboard):
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_ID   — chat_id получателя (узнать через @userinfobot)

const ALLOWED_ORIGINS = [
  'https://qwertytw8-pixel.github.io',
  'https://tsvetkovaproai.ru',
  'https://www.tsvetkovaproai.ru',
  'http://localhost',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.find(o => origin?.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed || ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const { name, contact, message } = await request.json();

      if (!name || !contact) {
        return new Response(JSON.stringify({ error: 'Name and contact are required' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const text = [
        '📝 Новая заявка с сайта',
        '',
        `👤 Имя: ${name}`,
        `📱 Контакт: ${contact}`,
        message ? `💬 Сообщение: ${message}` : '',
        '',
        `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
      ].filter(Boolean).join('\n');

      const tgResponse = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML',
          }),
        }
      );

      if (!tgResponse.ok) {
        const err = await tgResponse.text();
        console.error('Telegram API error:', err);
        return new Response(JSON.stringify({ error: 'Failed to send message' }), {
          status: 502,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
