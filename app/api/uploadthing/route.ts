import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";

// Export routes for Next App Router
const handler = createRouteHandler({
  router: ourFileRouter,
});

export { handler as GET, handler as POST };