import { Notify, LocalStorage, SessionStorage } from 'quasar'
import Vue from 'vue'
import Router from '../router'

function reqStart (state) {
  if (DEV) {
    console.log('Start Request')
  }
}
function reqSuccessful (state, { type, payload }) {
  let { result } = payload
  switch (type) {
    case 'postMessage': {
      Notify.create({
        message: `Post message to devices with IDs ${result} success`,
        type: 'positive',
        icon: 'alarm_add',
        timeout: 2500,
        bgColor: 'white'
      })
      if (DEV) {
        console.log(`Post message to devices with IDs ${result} success`)
      }
      break
    }
    default: {
      /* if result has difference with state */
      if (JSON.stringify(state[type]) !== JSON.stringify(result)) {
        Vue.set(state, type, result)
      }
    }
  }
}
function setDevices (state, devices) {
  /* if result has difference with state */
  if (JSON.stringify(state.devices) !== JSON.stringify(devices.data.result)) {
    Vue.set(state, 'devices', devices.data.result)
  }
  if (!state.hasDevicesInit) {
    if (state.activeDevicesID.length) {
      state.activeDevicesID.forEach(id => {
        if (!devices.data.result.filter(device => device.id === id).length) {
          unsetActiveDevice(state, id)
        }
      })
      setDevicesInit(state)
    } else {
      setDevicesInit(state)
      let activeDevicesFromLocalStorage = LocalStorage.get.item('TrackIt Active Devices')
      if (activeDevicesFromLocalStorage && activeDevicesFromLocalStorage.length) {
        activeDevicesFromLocalStorage.forEach(id => {
          if (devices.data.result.filter(device => device.id === id).length) {
            setActiveDevice(state, id)
          }
        })
      }
    }
  }
}
function updateDevices (state, payload) {
  switch (payload.type) {
    case 'created': {
      state.devices.push(payload.device)
      break
    }
    case 'updated': {
      state.devices.some((device, index) => {
        if (device.id === payload.device.id) {
          state.devices[index] = Object.assign(state.devices[index], payload.device)
          return true
        }
        return false
      })
      break
    }
    case 'deleted': {
      state.devices.some((device, index) => {
        if (device.id === payload.device.id) {
          state.devices.splice(index, 1)
          return true
        }
        return false
      })
      break
    }
  }
}
function reqFailed (state, payload) {
  if (DEV) {
    console.log('Failed Request')
    console.log(payload)
  }
  /* http errors */
  if ((payload.response && payload.response.status)) {
    switch (payload.response.status) {
      case 0: {
        setOfflineFlag(state, true)
        unsetDevicesInit(state)
        Vue.set(state, 'token', '')
        break
      }
      case 401: {
        clearToken(state)
        break
      }
      default: {
        if (DEV) {
          console.log(`${payload.status} - ${payload.statusText}`)
        }
        if (payload.response.data && payload.response.data.errors && payload.response.data.errors.length) {
          payload.response.data.errors.forEach((e) => { addError(state, e.reason) })
        }
      }
    }
    /* mqtt errors */
  } else if (payload.code && payload.message) {
    switch (payload.code) {
      case 2: {
        if (state.token) {
          clearToken(state)
        }
        addError(state, payload.message)
        break
      }
    }
  } else {
    addError(state, payload.message)
  }
}
function setOfflineFlag (state, flag) {
  Vue.set(state, 'offline', flag)
}
function setToken (state, val) {
  let token = val.replace('FlespiToken ', '')
  if (val && token.match(/^[a-z0-9]+$/i)) {
    Vue.connector.token = `FlespiToken ${token}`
    SessionStorage.set('currentToken', token)
  } else {
    token = ''
    Vue.connector.token = ''
    clearToken(state)
  }
  Vue.set(state, 'token', token)
}
function clearToken (state) {
  SessionStorage.remove('currentToken')
  Vue.connector.token = ''
  if (state.socketOffline) { setSocketOffline(state, false) }
  Vue.set(state, 'token', '')
}
function setActiveDevice (state, id) {
  if (state.hasDevicesInit && !state.devices.filter(device => device.id === id)[0].messages_ttl) {
    return
  }
  state.activeDevicesID.push(id)
  LocalStorage.set('TrackIt Active Devices', state.activeDevicesID)
  if (state.hasDevicesInit) {
    Router.push(`/devices/${state.activeDevicesID.join(',')}`)
  }
}
function unsetActiveDevice (state, id) {
  let index = state.activeDevicesID.indexOf(id)
  state.activeDevicesID.splice(index, 1)
  LocalStorage.set('TrackIt Active Devices', state.activeDevicesID)
  if (state.activeDevicesID.length) {
    Router.push(`/devices/${state.activeDevicesID.join(',')}`)
  } else {
    Router.push('/')
  }
}
function setDevicesInit (state) {
  state.hasDevicesInit = true
}
function unsetDevicesInit (state) {
  state.hasDevicesInit = false
  Vue.set(state, 'devices', [])
  Vue.set(state, 'activeDevicesID', [])
}
function addError (state, message) {
  Notify.create({
    type: 'negative',
    icon: 'warning',
    message: `${message}`,
    timeout: 1000
  })
  state.newNotificationCounter++
  state.errors.push(message)
}

function setSocketOffline (state, flag) {
  Vue.set(state, 'socketOffline', flag)
}

function clearErrors (state) {
  Vue.set(state, 'errors', [])
}

function clearNotificationCounter (state) { state.newNotificationCounter = 0 }
export default {
  reqStart,
  reqSuccessful,
  reqFailed,
  setToken,
  clearToken,
  setActiveDevice,
  unsetActiveDevice,
  setDevicesInit,
  unsetDevicesInit,
  setOfflineFlag,
  updateDevices,
  setDevices,
  setSocketOffline,
  clearNotificationCounter,
  addError,
  clearErrors
}
