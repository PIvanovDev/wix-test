export function safeJSONParse(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return jsonString;
  }
}