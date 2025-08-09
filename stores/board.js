import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', {
    state: () => ({
        boards: [],
        posts: [],
        comments: [],
        currentBoard: null,
        loading: false
    }),

    actions: {
        async fetchBoards() {
            this.loading = true
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                this.boards = await $fetch(`${config.public.apiBase}/admin/boards`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        async createBoard(boardData) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                const newBoard = await $fetch(`${config.public.apiBase}/admin/boards`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    },
                    body: boardData
                })

                this.boards.push(newBoard)
                return newBoard
            } catch (error) {
                throw error
            }
        },

        async fetchPosts(boardId) {
            try {
                const config = useRuntimeConfig()
                const authStore = useAuthStore()

                this.posts = await $fetch(`${config.public.apiBase}/admin/boards/${boardId}/posts`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                })
            } catch (error) {
                throw error
            }
        }
    }
})