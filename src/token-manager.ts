interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class TokenManager {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private clientId: string | null = null;
  private clientSecret: string | null = null;

  // Buffer time before token expiry to refresh (5 minutes)
  private readonly TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;

  constructor() {
    this.loadStoredToken();
  }

  setCredentials(clientId: string, clientSecret: string): void {
    if (this.clientId !== clientId || this.clientSecret !== clientSecret) {
      this.clearToken();
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private loadStoredToken(): void {
    const storedToken = localStorage.getItem("vasttrafikAccessToken");
    const storedExpiry = localStorage.getItem("vasttrafikAccessTokenExpiry");

    if (storedToken && storedExpiry) {
      this.accessToken = storedToken;
      this.tokenExpiry = Number(storedExpiry);
    }
  }

  private persistToken(token: string, expiry: number): void {
    this.accessToken = token;
    this.tokenExpiry = expiry;
    localStorage.setItem("vasttrafikAccessToken", token);
    localStorage.setItem("vasttrafikAccessTokenExpiry", expiry.toString());
  }

  private clearToken(): void {
    this.accessToken = null;
    this.tokenExpiry = 0;
    localStorage.removeItem("vasttrafikAccessToken");
    localStorage.removeItem("vasttrafikAccessTokenExpiry");
  }

  private isTokenValid(): boolean {
    return !!(this.accessToken && Date.now() < this.tokenExpiry - this.TOKEN_REFRESH_BUFFER);
  }

  private async fetchAccessToken(): Promise<TokenResponse | null> {
    try {
      const apiKey = this.clientId || import.meta.env.VITE_VASTTRAFIK_CLIENT_ID;
      const apiSecret = this.clientSecret || import.meta.env.VITE_VASTTRAFIK_CLIENT_SECRET;

      if (!apiKey || !apiSecret) {
        throw new Error("Missing API client ID or secret. Please configure in card settings.");
      }

      const credentials = btoa(`${apiKey}:${apiSecret}`);
      const res = await fetch("https://ext-api.vasttrafik.se/token", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        method: "POST",
        body: "grant_type=client_credentials",
      });

      if (res.status !== 200) {
        throw new Error("Error fetching access token");
      }

      const data: TokenResponse = await res.json();

      if (!data.access_token) {
        throw new Error("No access token found in response");
      }

      const expiry = Date.now() + data.expires_in * 1000;
      this.persistToken(data.access_token, expiry);

      return data;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null;
    }
  }

  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.accessToken!;
    }

    this.clearToken();

    const tokenResponse = await this.fetchAccessToken();
    if (tokenResponse) {
      return this.accessToken!;
    }

    throw new Error("Failed to get access token");
  }

  /**
   * Returns the access token with Bearer prefix for use in Authorization headers.
   */
  async getBearerToken(): Promise<string> {
    const token = await this.getAccessToken();
    return `Bearer ${token}`;
  }
}

export const tokenManager = new TokenManager();
