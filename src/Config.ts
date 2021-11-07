export class Config {
  settingA: string | null = null;
  settingB: string | null = null;
  constructor(a: string, b: string) {
    if (a) this.settingA = a;
    if (b) this.settingB = b;
  }
}
