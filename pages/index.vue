<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">백오피스 관리 시스템</h1>
          </div>
          <div>
            <NuxtLink
                to="/login"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              로그인
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          관리자 시스템에 오신 것을 환영합니다
        </h2>
        <p class="mt-4 text-xl text-gray-600">
          브랜드 관리, 게시판 관리 등 다양한 기능을 제공합니다
        </p>

        <div class="mt-8">
          <NuxtLink
              to="/login"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            시작하기
          </NuxtLink>
        </div>
      </div>

      <!-- 기능 소개 -->
      <div class="mt-16">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 브랜드 관리 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">브랜드 관리</h3>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-gray-600">
                  브랜드 생성, 상품 관리, 카테고리 설정 등 온라인 상점 운영에 필요한 모든 기능을 제공합니다.
                </p>
              </div>
            </div>
          </div>

          <!-- 게시판 관리 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">게시판 관리</h3>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-gray-600">
                  공지사항, FAQ, 일반 게시판을 생성하고 관리할 수 있습니다. 댓글과 파일 첨부 기능도 지원합니다.
                </p>
              </div>
            </div>
          </div>

          <!-- 사용자 관리 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">사용자 관리</h3>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-gray-600">
                  일반 로그인부터 Google, Kakao 소셜 로그인까지 다양한 인증 방식을 지원합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 빠른 액세스 -->
      <div class="mt-16 bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">빠른 액세스</h3>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <NuxtLink
              to="/login"
              class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="h-8 w-8 mx-auto mb-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm font-medium">로그인</span>
          </NuxtLink>

          <div class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <svg class="h-8 w-8 mx-auto mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="text-sm font-medium">대시보드</span>
          </div>

          <div class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <svg class="h-8 w-8 mx-auto mb-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="text-sm font-medium">브랜드</span>
          </div>

          <div class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <svg class="h-8 w-8 mx-auto mb-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm font-medium">게시판</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 푸터 -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-500">
          <p>&copy; 2024 백오피스 관리 시스템. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>