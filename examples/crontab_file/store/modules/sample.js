// initial state
const state = {
  counter_seconds: 0,
  counter_millisecond: 0
}

// getters
const getters = {
  getSecondCounter: (state, getters) => {
    return getters.counter_seconds
  },
  getMilliSecondCounter: (state, getters) => {
    return getters.counter_millisecond
  }
}

// actions
const actions = {
  incrementSeconds ({ commit, state }) {
    commit('incrementSeconds')
  },
  incrementMilliSecond ({ commit, state }) {
    commit('incrementMilliSecond')
  }
}

// mutations
const mutations = {
  incrementSeconds (state) {
    state.counter_seconds++
  },
  incrementMilliSecond (state) {
    state.counter_millisecond++
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
