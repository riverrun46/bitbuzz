export const environment = {
  network: import.meta.env.VITE_NETWORK,
  base_man_url: import.meta.env.VITE_BASE_MAN_URL,
  flag: import.meta.env.VITE_FLAG,
  service_satoshi: import.meta.env.VITE_SERVICE_SATOSHI, //
  service_address: import.meta.env.VITE_SERVICE_ADDRESS, //
  baidu_app_id: import.meta.env.VITE_BAIDU_APP_ID,
  baidu_app_secret: import.meta.env.VITE_BAIDU_APP_SECRET,
}

export function getServiceAddress() {
  if (environment.network === 'btc') {
    return import.meta.env.VITE_SERVICE_ADDRESS_BTC
  }

  return import.meta.env.VITE_SERVICE_ADDRESS_MVC
}
