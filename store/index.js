// store/index.js
export const state = () => ({
  inputText: '',
  translationResult: '',
  uploadedFiles: [],
  snsStatus: {}
})

export const mutations = {
  setInputText(state, text) {
    state.inputText = text
  },
  setTranslationResult(state, result) {
    state.translationResult = result
  },
  setUploadedFiles(state, files) {
    state.uploadedFiles = files
  },
  setSnsStatus(state, status) {
    state.snsStatus = status
  }
}

export const actions = {
  updateInputText({ commit }, text) {
    commit('setInputText', text)
  },
  updateTranslationResult({ commit }, result) {
    commit('setTranslationResult', result)
  },
  updateUploadedFiles({ commit }, files) {
    commit('setUploadedFiles', files)
  },
  updateSnsStatus({ commit }, status) {
    commit('setSnsStatus', status)
  }
}