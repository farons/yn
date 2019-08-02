import Storage from '@/lib/Storage'
import file from '@/lib/file'

export default {
  namespaced: true,
  state: {
    repositories: {},
    tree: null,
    showView: true,
    showXterm: false,
    savedAt: null,
    currentContent: '',
    previousContent: '',
    previousHash: '',
    currentRepo: Storage.get('currentRepo'),
    currentFile: Storage.get('currentFile'),
    recentOpenTime: Storage.get('recentOpenTime', {}),
    passwordHash: {},
    documentInfo: {
      textLength: 0,
      selectedLength: 0,
      lineCount: 0,
      line: 0,
      column: 0
    },
  },
  mutations: {
    setPasswordHash (state, { file, passwordHash }) {
      if (file && passwordHash) {
        state.passwordHash = { ...state.passwordHash, [`${file.repo}|${file.path}`]: passwordHash }
      }
    },
    setRepositories (state, data) {
      state.repositories = data
    },
    setTree (state, data) {
      state.tree = data
    },
    setShowView (state, data) {
      state.showView = data
    },
    setShowXterm (state, data) {
      state.showXterm = data
    },
    setPreviousHash (state, data) {
      state.previousHash = data
    },
    setPreviousContent (state, data) {
      state.previousContent = data
    },
    setSavedAt (state, data) {
      state.savedAt = data
    },
    setDocumentInfo (state, data) {
      state.documentInfo = data
    },
    setCurrentContent (state, data) {
      state.currentContent = data
    },
    setCurrentRepo (state, data) {
      state.currentRepo = data
      state.currentFile = null
      state.tree = null
      Storage.set('currentRepo', data)
    },
    setCurrentFile (state, data) {
      state.currentFile = data
      Storage.set('currentFile', data)

      if (data) {
        state.recentOpenTime = { ...(state.recentOpenTime || {}), [`${data.repo}|${data.path}`]: new Date().valueOf() }
        Storage.set('recentOpenTime', state.recentOpenTime)
      }
    },
  },
  getters: {
  },
  actions: {
    async fetchRepositories ({ commit }) {
      const data = await file.fetchRepositories()
      commit('setRepositories', data)
    },
    async fetchTree ({ commit }, repo) {
      if (!repo) {
        console.warn('未选择仓库')
        return
      }

      const tree = await file.fetchTree(repo.name)
      commit('setTree', tree)
    },
    async showReadme ({ commit }) {
      const content = await file.fetchReadmeContent()
      commit('setCurrentFile', {
        repo: '__readme__',
        title: 'README.md',
        name: 'README.md',
        path: '/README.md',
        content
      })
    }
  }
}