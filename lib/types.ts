export interface TavilySearchAPIParameters {
  query: string;
  includeDetails?: boolean;
  includeDomains?: string[];
  excludeDomains?: string[];
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilyResponse {
  results: TavilySearchResult[];
  answer?: string;
  query: string;
}
