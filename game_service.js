// game_service.js

const gameService = {
  setItem: function (key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error('Fehler beim Schreiben in den Local Storage:', error)
      return false
    }
  },

  getItem: function (key) {
    try {
      const serializedValue = localStorage.getItem(key)
      if (serializedValue === null) {
        return {score: 0};
      }
      return JSON.parse(serializedValue)
    } catch (error) {
      console.error('Failed to read data from local storage:', error)
      return null
    }
  },

  removeItem: function (key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to delete data from local storage:', error)
      return false
    }
  },

  clear: function () {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error(
        'Failed to delete all data from local storage:',
        error,
      )
      return false
    }
  },
}

export default gameService
