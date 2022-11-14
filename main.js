class Timer {
  constructor() {
    this.isRunning = false
    this.startTime = 0
    this.overallTime = 0
  }

  _getTimeElapsedSinceLastStart() {
    if (!this.startTime) {
      return 0
    }

    return Date.now() - this.startTime
  }

  start() {
    if (this.isRunning) {
      return console.error('Timer is already running')
    }

    this.isRunning = true

    this.startTime = Date.now()
  }

  stop() {
    if (!this.isRunning) {
      return console.error('Timer is already stopped')
    }

    this.isRunning = false

    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart()
  }

  reset() {
    this.overallTime = 0

    if (this.isRunning) {
      this.startTime = Date.now()
      return
    }

    this.startTime = 0
  }

  getTime() {
    if (!this.startTime) {
      return 0
    }

    if (this.isRunning) {
      return this.overallTime + this._getTimeElapsedSinceLastStart()
    }

    return this.overallTime
  }
}

const state = { waitingForClick: false, timer: new Timer(), waitTimeout: null }
const MAX_WAIT_TIME = 3500
const MIN_WAIT_TIME = 1500
const buttonTitle = document.getElementById('button-title')
const buttonSub = document.getElementById('button-sub')

function connect() {
  const button = document.getElementById('button')

  button.addEventListener('mousedown', handlePlay)
  document.body.onkeydown = function (event) {
    if (event.key == ' ' || event.code == 'Space' || event.key == 'Enter') {
      handlePlay()
    }
  }
}

function handlePlay(_event) {
  if (!state.waitingForClick) {
    startGame()
  } else {
    endGame()
  }
}

function startGame() {
  state.timer.reset()
  console.log('timer reset', state.timer.getTime())
  state.waitingForClick = true
  changeColor('red')
  buttonTitle.textContent = 'wait for green'
  buttonSub.textContent = ''
  const wait = Math.floor(Math.random() * MAX_WAIT_TIME) + MIN_WAIT_TIME
  state.waitTimeout = window.setTimeout(() => {
    state.timer.start()
    console.log('timer started', state.timer.getTime())
    changeColor('green')
  }, wait)
}

function endGame() {
  state.timer.stop()
  window.clearTimeout(state.waitTimeout)
  console.log('timer stopped', state.timer.getTime())
  state.waitingForClick = false
  changeColor('purple')
  const score = state.timer.getTime()
  if (score > 0) {
    buttonTitle.textContent = state.timer.getTime()
  } else {
    buttonTitle.textContent = 'slow down'
  }
  buttonSub.textContent = '(click to try again)'
}

function changeColor(colorName) {
  const colors = { purple: '#9A68F5', red: '#F93434', green: '#3BD359' }
  const root = document.documentElement
  root.style.setProperty('--color', colors[colorName])
}

connect()
