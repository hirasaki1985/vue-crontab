// initial state
const state = {
  counter: 0
}

// getters
const getters = {
  getCounter: (state, getters) => {
    return getters.counter
  }
}

// actions
const actions = {
  increment ({ commit, state }) {
    commit('increment')
  }
}

// mutations
const mutations = {
  increment (state) {
    state.counter++
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
