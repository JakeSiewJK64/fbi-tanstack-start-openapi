import createClient from "openapi-fetch";

import type { paths } from "./schema";

const client = createClient<paths>({
  baseUrl: "https://api.fbi.gov",
});

export { client };
