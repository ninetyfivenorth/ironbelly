import { store } from 'common/redux'

export const log = (e: Error, showToUser: boolean = false) => {
  if (!(e instanceof Error) && e.message) {
    e = new Error(e.message)
  }
  if (showToUser && e.message) {
    store.dispatch({
      type: 'TOAST_SHOW',
      text: e.message,
    })
  }
}
