import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";

export interface SheetRow {
  values: string[];
}

export class SheetsAdmin {
  private client: sheets_v4.Sheets | null = null;
  private spreadsheetId: string;

  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;
  }

  private auth(): sheets_v4.Sheets {
    if (this.client) return this.client;

    const b64 = process.env.GOOGLE_SERVICE_ACCOUNT;
    if (!b64) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT is not configured. Provide the base64-encoded service-account JSON, or run without targeting a real spreadsheet."
      );
    }

    const credentials = JSON.parse(
      Buffer.from(b64, "base64").toString("utf-8")
    );

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.client = google.sheets({ version: "v4", auth });
    return this.client;
  }

  async readRows(tab: string): Promise<SheetRow[]> {
    const res = await this.auth().spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${tab}!A1:ZZ`,
    });
    const rows = res.data.values ?? [];
    return rows.map((values) => ({ values: values.map((v) => String(v)) }));
  }

  async appendRows(tab: string, rows: string[][]) {
    await this.auth().spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${tab}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: rows },
    });
  }

  async updateCell(tab: string, cell: string, value: string) {
    await this.auth().spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${tab}!${cell}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[value]] },
    });
  }

  async writeHeaderIfEmpty(tab: string, headers: string[]) {
    const rows = await this.readRows(tab);
    if (rows.length === 0) {
      await this.appendRows(tab, [headers]);
    }
  }
}

let singleton: SheetsAdmin | null = null;

export function getSheetsAdmin(): SheetsAdmin | null {
  const id = process.env.GOOGLE_SPREADSHEET_ID;
  if (!id) return null;
  if (!singleton) singleton = new SheetsAdmin(id);
  return singleton;
}