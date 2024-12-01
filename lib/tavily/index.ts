import { TavilySearchAPIParameters } from '../types';

export class TavilySearchAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(params: TavilySearchAPIParameters) {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          query: params.query,
          include_answer: true,
          include_domains: params.includeDomains,
          exclude_domains: params.excludeDomains,
          search_depth: params.includeDetails ? 'advanced' : 'basic',
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Tavily search error:', error);
      throw error;
    }
  }
}
