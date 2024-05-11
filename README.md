# wrangler-cloudflare-durable-objects-queue

Wrangler app that uses a Durable Object to publish messages to a queue.

## Prerequisites

- **_Cloudflare:_**
  - Must have set the `CLOUDFLARE_API_TOKEN` variable in your local environment.
- **_pnpm:_**
  - Must be [installed](https://pnpm.io/installation) in your system.
- **_Wrangler:_**
  - Must be [installed](https://developers.cloudflare.com/workers/wrangler/install-and-update/) in your system.

## Deployment

Create queue:

```sh
npx wrangler queues create my-queue
```

Create worker:

```sh
npx wrangler deploy
```

## Usage

1. Grab the `<WORKER_ROUTE_TRIGGER_URL>` from the deployment outputs:

   ```sh
   Published my-worker
     <WORKER_ROUTE_TRIGGER_URL>
     Producer for my-queue
   ```

2. Navigate to `https://my-worker.<SUBDOMAIN>.workers.dev?userId=test`.

3. Check that a message is present in `my-queue` from the Cloudflare dashboard.

## Cleanup

```sh
npx wrangler delete
```

## Architecture Diagram

![Architecture Diagram](./src/assets/arch-diagram.svg)
