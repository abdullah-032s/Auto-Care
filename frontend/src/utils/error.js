export function getErrorMessage(error, fallback = "Something went wrong") {
  try {
    if (!error) return fallback;
    const fromResponse = error?.response?.data?.message;
    if (typeof fromResponse === "string" && fromResponse.trim()) return fromResponse;
    const fromMessage = error?.message;
    if (typeof fromMessage === "string" && fromMessage.trim()) return fromMessage;
    return fallback;
  } catch (_) {
    return fallback;
  }
}
