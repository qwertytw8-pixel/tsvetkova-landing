# Cloudflare Worker — форма обратной связи → Telegram

## Как настроить

### 1. Создать Cloudflare аккаунт
Зайди на https://dash.cloudflare.com и зарегистрируйся (бесплатно).

### 2. Создать Worker
1. В панели Cloudflare → **Workers & Pages** → **Create**
2. Нажми **Create Worker**
3. Дай имя (например: `tsvetkova-form`)
4. Нажми **Deploy**
5. После деплоя нажми **Edit Code**
6. Удали весь код и вставь содержимое файла `worker.js`
7. Нажми **Deploy**

### 3. Добавить переменные окружения
1. Перейди в настройки Worker'а → **Settings** → **Variables**
2. Добавь:
   - `TELEGRAM_BOT_TOKEN` — токен бота (получить у @BotFather в Telegram)
   - `TELEGRAM_CHAT_IDS` — chat_id получателей через запятую (например: `522370840,8529853732,960038072`)
3. Нажми **Encrypt** для каждой переменной и **Save**

### 4. Обновить URL на сайте
В файле `index.html` замени `WORKER_URL_PLACEHOLDER` на URL Worker'а.
URL будет вида: `https://tsvetkova-form.<твой-аккаунт>.workers.dev`

### 5. Проверить
Отправь тестовую заявку через форму — сообщение должно прийти в Telegram.

---

## Бесплатный тариф Cloudflare Workers
- 100 000 запросов в день
- Этого более чем достаточно для формы обратной связи
