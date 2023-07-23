import env from './getEnv'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function debug(...args: any[]) {

  if (['local', 'preview', 'development'].includes(env) || global.window?.sessionStorage.getItem('debug')) {
    console.log(...args)
  }
}