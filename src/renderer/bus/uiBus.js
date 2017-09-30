import store from '../store'

export function alert (message, title) {
  if (typeof title === 'string' && title.length > 0) {
    store.dispatch('setAlertTitle', title)
  }
  store.dispatch('setAlertMessage', message)
  store.dispatch('setShowAlert', true)
}

export function toast (message, title, icon) {
  if (typeof title === 'string' && title.length > 0) {
    store.dispatch('setToastTitle', title)
  }
  if (typeof icon === 'string' && icon.length > 0) {
    store.dispatch('setToastIcon', icon)
  }
  store.dispatch('setToastMessage', message)
  store.dispatch('setShowToast', true)

  setTimeout(() => {
    store.dispatch('setShowToast', false)
  }, 5000)
}
