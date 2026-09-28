export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content || "";

    const fullReply = `[F1 Bot]: You asked "${latestMessage}". Your full frontend, state management, and API routes are working properly!`;
    const words = fullReply.split(" ");

    const encoder = new TextEncoder();

    // useChat expects data stream format: "0:\"<chunk>\"\n"
    const stream = new ReadableStream({
      async start(controller) {
        for (const word of words) {
          const chunk = `0:${JSON.stringify(word + " ")}\n`;
          controller.enqueue(encoder.encode(chunk));
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-vercel-ai-data-stream": "v1",
      },
    });
  } catch (error) {
    console.error("Route error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}