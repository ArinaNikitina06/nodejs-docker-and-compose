# КупиПодариДай — докеризация и деплой

## Адреса

- IP адрес: 158.160.197.159
- Frontend: https://kpdarinanikitina.nomorepartiessbs.ru
- Backend: https://api.kpdarinanikitina.nomorepartiessbs.ru

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

- фронтенд: `http://localhost:8081/`
- бэкенд: `http://localhost:4000/`

## Переменные окружения

Бэкенд использует:

- `JWT_SECRET`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `POSTGRES_PGDATA`

Фронтенд использует:

- `REACT_APP_API_URL` (по умолчанию `/api`)