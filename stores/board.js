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
                const { get } = useApi()

                // Board API는 별도 서비스에 있을 것으로 추정 - 관리자 권한 필요
                this.boards = await get('/admin/boards')
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        async createBoard(boardData) {
            try {
                const { post } = useApi()

                // Authorization 헤더 필수 (관리자만 가능)
                const newBoard = await post('/admin/boards', boardData)

                this.boards.push(newBoard)
                return newBoard
            } catch (error) {
                throw error
            }
        },

        async fetchPosts(boardId) {
            try {
                const { get } = useApi()

                // Authorization 헤더 필수
                this.posts = await get(`/admin/boards/${boardId}/posts`)
            } catch (error) {
                throw error
            }
        }
    }
})