# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Leads webhook

The [`/api/lead`](server/api/lead.post.ts:63) endpoint forwards valid lead submissions to a webhook.

### Environment variable

- `LEAD_WEBHOOK_URL` **(required for [`/api/lead`](server/api/lead.post.ts:63))**: destination URL that receives a `POST` with the lead data.

### Payload fields

The webhook receives a JSON body containing:

- `name`
- `phone`
- `service`
- `message`
- `sourcePage`
- `timestamp` (ISO-8601)
- `ip`
- `userAgent` (may be `null`/missing depending on client)

### Spam honeypot (`hp`)

Requests that include an `hp` field with a **non-empty** value are treated as spam:
- the request returns `{ ok: true }`
- **no rate limit** is consumed
- **no webhook** request is sent

### Rate limiting

Default rate limit is **10 requests per 10 minutes per IP**. If exceeded, the endpoint responds with `429` and a `Retry-After` header.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
# website
