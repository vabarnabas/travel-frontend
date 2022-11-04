import Cookies from "universal-cookie";

class TokenService {
  public async saveToken(token: string): Promise<void> {
    const cookies = new Cookies();
    cookies.set("tr-token", token, { path: "/" });
  }

  public async deleteToken(): Promise<void> {
    const cookies = new Cookies();
    cookies.remove("tr-token", { path: "/" });
  }

  public getToken(): Promise<any> {
    const cookies = new Cookies();
    return cookies.get("tr-token");
  }
}

export default TokenService;
