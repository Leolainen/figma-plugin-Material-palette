
export default function clone(val: any) {
  return JSON.parse(JSON.stringify(val));
}