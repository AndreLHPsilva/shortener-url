export function removeSensiveData(body: any) {
  let data = body;
  if (typeof body === "object") {
    if (Object.keys(body as any).includes("password")) {
      let { password, ...rest } = body as any;
      data = { ...rest };
    }
  }

  return data;
}
