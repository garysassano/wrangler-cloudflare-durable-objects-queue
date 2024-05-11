/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(req, env): Promise<Response> {
    // Assume each Durable Object is mapped to a userId in a query parameter
    // In a production application, this will be a userId defined by your application
    // that you validate (and/or authenticate) first.
    let url = new URL(req.url);
    let userIdParam = url.searchParams.get("userId");

    if (userIdParam) {
      // Create (or get) a Durable Object based on that userId.
      let durableObjectId = env.MY_DO_NAMESPACE.idFromName(userIdParam);
      // Get a "stub" that allows you to call that Durable Object
      let durableObjectStub = env.MY_DO_NAMESPACE.get(durableObjectId);

      // Pass the request to that Durable Object and await the response
      // This invokes the constructor once on your Durable Object class (defined further down)
      // on the first initialization, and the fetch method on each request.
      // We pass the original Request to the Durable Object's fetch method
      let response = await durableObjectStub.fetch(req);

      // This would return "wrote to queue", but you could return any response.
      return response;
    }
    return new Response("userId must be provided", { status: 400 });
  },
} satisfies ExportedHandler<Env>;

export class MyDurableObject implements DurableObject {
  constructor(private state: DurableObjectState, private env: Env) {}

  async fetch(req: Request): Promise<Response> {
    // Error handling elided for brevity.
    // Publish to your queue
    await this.env.MY_QUEUE.send({
      // Write the ID of the Durable Object to the queue
      id: this.state.id.toString(),
    });

    return new Response("wrote to queue");
  }
}
