import { MeiliSearch } from "meilisearch";

const globalForMeiliSearch = global as unknown as { meiliSearch: MeiliSearch };

export const meiliSearch =
  globalForMeiliSearch.meiliSearch ||
  new MeiliSearch({
    host: "http://127.0.0.1:7700",
    apiKey: process.env.SEARCH_API_KEY,
  });

export default meiliSearch;
