# КупиПодариДай — докеризация и деплой

## Адреса

- IP адрес: x.x.x.x
- Frontend: https://example.com
- Backend: https://api.example.com

## Локальный запуск через Docker Compose

Создайте файл `.env` рядом с `docker-compose.yml`:

```bash
cp .env.example .env
```

Запустите проект:

```bash
docker compose up --build
```

После запуска:

- фронтенд: `http://localhost/`
- бэкенд: `http://localhost:3000/`

## Переменные окружения

Бэкенд использует:

- `JWT_SECRET`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

Фронтенд использует:

- `REACT_APP_API_URL` (по умолчанию `/api`)