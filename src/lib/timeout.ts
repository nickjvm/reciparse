/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function timeout (prom: Promise<any>, time: number, exception: string)  {
  let timer: NodeJS.Timeout
  // if given promise doesn't resolve within `time`, then reject with the given exception as an Error
  return Promise.race([
    prom,
    new Promise((_r, rej) => timer = setTimeout(rej, time, new Error(exception)))
  ]).finally(() => clearTimeout(timer))
}