export const permissions = async (): Promise<NotificationPermission> => {
  if (!isIOS()) {
    return await Notification.requestPermission()
  }

  return 'denied'
}

export function isIOS() {
  const browserInfo = navigator.userAgent.toLowerCase()

  if (browserInfo.match('iphone') || browserInfo.match('ipad')) {
    return true
  }
  if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
    return true
  }
  return false
}
