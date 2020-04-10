export function isClass(token: any): boolean {
  try {
    Reflect.construct(String, [], token);
  } catch (err) {
    return false;
  }

  return true;
}
