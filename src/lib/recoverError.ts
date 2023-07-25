import gtag from './gtag'
import debug from './debug'

export default function recoverError() {
  if (!sessionStorage.getItem('reload')) {
    sessionStorage.setItem('reload', '1')
    gtag('session_error')
    debug('auth request timed out. forcing reload')
    window.location.reload()
  } else {
    sessionStorage.removeItem('reload')
  }
}