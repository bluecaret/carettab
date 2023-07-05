<!-- eslint-disable no-undef -->
<script setup>
import { useSettingsStore } from '@/store.js'
import { getList, getSelectedUnsplashImage } from '@/helpers/unsplash.js'

if (typeof browser === 'undefined') {
  var browser = chrome
}

const store = useSettingsStore()

const handleTabChange = async (t) => {
  store.unsplashStatus = 'default'
  store.unsplashTab = t

  if (
    (t === 'topics' && store.unsplashTopicResults.length < 1) ||
    (t === 'collections' && store.unsplashCollectionResults.length < 1)
  ) {
    await getList(1)
    store.unsplashStatus = 'results'
    return
  }

  if (t === 'search' && store.unsplashSearchResults.length > 0) {
    store.unsplashStatus = 'results'
    return
  }
}

const handleUnsplashPhotoSearch = () => {
  if (!store.unsplashSearchTerm) return
  store.unsplashTab = 'search'
  store.unsplashStatus = 'results'
  getList(1)
}
</script>

<template>
  <PageHeading :title="$t('settings.unsplashComPhotos')" back-page="dashboard"></PageHeading>
  <div class="page">
    <div class="tabs">
      <button
        class="btn tab"
        :class="{ active: store.unsplashTab === 'search' }"
        type="button"
        @click="handleTabChange('search')"
      >
        {{ $t('settings.search') }}
      </button>
      <button
        class="btn tab"
        :class="{ active: store.unsplashTab === 'topics' }"
        type="button"
        @click="handleTabChange('topics')"
      >
        {{ $t('settings.topics') }}
      </button>
      <button
        class="btn tab"
        :class="{ active: store.unsplashTab === 'collections' }"
        type="button"
        @click="handleTabChange('collections')"
      >
        {{ $t('settings.collections') }}
      </button>
    </div>
    <div class="blockContainer">
      <div v-if="store.unsplashTab === 'collections' || store.unsplashTab === 'topics'" class="block">
        <div class="label">
          <label for="backgroundColor">{{ $t('settings.unsplashTabTopicsLabel') }}</label>
          <div class="desc">{{ $t('settings.unsplashTabTopicsDescription') }}</div>
        </div>
      </div>
      <div v-if="store.unsplashTab === 'search'" class="block">
        <div class="label">
          <label for="backgroundColor">{{ $t('settings.unsplashTabSearchLabel') }}</label>
          <div class="desc">{{ $t('settings.unsplashTabSearchDescription') }}</div>
        </div>
        <form class="group fill compact" novalidate @submit.prevent="handleUnsplashPhotoSearch()">
          <input v-model="store.unsplashSearchTerm" type="text" class="input fill" />
          <button type="submit" class="btn">
            <fa icon="fa-search" fixed-width></fa>
            {{ $t('settings.search') }}
          </button>
        </form>
      </div>
      <div v-if="!store.isLoading && store.unsplashTab === 'search'" class="block stack center">
        <div
          v-if="
            store.unsplashStatus === 'default' &&
            (!store.unsplashSearchResults || store.unsplashSearchResults.length <= 0)
          "
          class="unsplashResultsDefault"
        >
          {{ $t('settings.searchForAPhotoAboveToSeeResults') }}
        </div>
        <div
          v-if="store.unsplashStatus === 'results' && store.unsplashSearchResults.length <= 0"
          class="unsplashResultsDefault"
        >
          {{ $t('settings.noResultsFoundPleaseTryAnotherSearch') }}
        </div>
        <div v-if="store.unsplashStatus === 'results' && store.unsplashSearchResults.length > 0" class="group fill">
          <label id="unsplashSelect" class="label">{{ $t('settings.searchResults') }}</label>
        </div>
        <div v-if="store.unsplashStatus === 'results' && store.unsplashSearchResults.length > 0" class="group fill">
          <div class="bgTypeList">
            <div
              v-for="photo in store.unsplashSearchResults.slice(0, 20)"
              :key="photo.id"
              class="bgTypeListItemWrapper"
            >
              <a
                class="bgTypeListItemLink"
                target="_blank"
                :href="photo.links.html + '?utm_source=carettab&utm_medium=referral'"
                :title="photo.description"
              >
                <fa icon="fa-up-right-from-square" />
              </a>
              <button
                aria-labelledby="unsplashSelect"
                type="button"
                class="bgTypeListItem"
                :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
                @click="getSelectedUnsplashImage(photo.id, photo.title, photo.links.html)"
              >
                <div
                  class="bgTypeListItemPreview"
                  :alt="photo.alt_description"
                  :title="photo.description"
                  :style="`background-image: url(${photo.urls.thumb})`"
                ></div>
                <div class="unsplashName bgTypeListItemName">
                  <div v-if="photo.description" class="unsplashDescription">{{ photo.description }}</div>
                  <span>By {{ photo.user.name ? photo.user.name : photo.user.username }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!store.isLoading && store.unsplashSearchResults.length > 0" class="pagination">
          <button
            :aria-label="$t('common.previousPage')"
            :title="$t('common.previousPage')"
            type="button"
            class="btn"
            :disabled="store.unsplashSearchPage <= 1"
            @click="getList(store.unsplashSearchPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">{{ $t('settings.pageCount', [store.unsplashSearchPage]) }}</div>
          <button
            :aria-label="$t('common.nextPage')"
            :title="$t('common.nextPage')"
            type="button"
            class="btn"
            :disabled="store.unsplashSearchResults.length <= 20"
            @click="getList(store.unsplashSearchPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
      <div v-if="!store.isLoading && store.unsplashTab === 'topics'" class="block stack center">
        <div class="group fill">
          <div class="bgTypeList">
            <div v-for="photo in store.unsplashTopicResults.slice(0, 20)" :key="photo.id" class="bgTypeListItemWrapper">
              <a
                class="bgTypeListItemLink"
                target="_blank"
                :href="photo.links.html + '?utm_source=carettab&utm_medium=referral'"
                :title="photo.title"
              >
                <fa icon="fa-up-right-from-square" />
              </a>
              <button
                aria-labelledby="unsplashSelect"
                type="button"
                class="bgTypeListItem"
                :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
                @click="getSelectedUnsplashImage(photo.id, photo.title, photo.links.html)"
              >
                <div v-if="photo.preview_photos && photo.preview_photos.length > 0" class="unsplashPreviewList">
                  <div
                    v-for="preview in photo.preview_photos.slice(0, 3)"
                    :key="preview.id"
                    class="bgTypeListItemPreview"
                    :alt="preview.alt_description"
                    :title="preview.description"
                    :style="`background-image: url(${preview.urls.thumb})`"
                  ></div>
                </div>
                <div class="bgTypeListItemName unsplashName">
                  <div v-if="photo.title" class="unsplashDescription">{{ photo.title }}</div>
                  <span>{{ $t('settings.photosCount', [photo.total_photos]) }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!store.isLoading && store.unsplashTopicResults.length > 0" class="pagination">
          <button
            :aria-label="$t('common.previousPage')"
            :title="$t('common.previousPage')"
            type="button"
            class="btn"
            :disabled="store.unsplashTopicPage <= 1"
            @click="getList(store.unsplashTopicPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">{{ $t('settings.pageCount', [store.unsplashTopicPage]) }}</div>
          <button
            :aria-label="$t('common.nextPage')"
            :title="$t('common.nextPage')"
            type="button"
            class="btn"
            :disabled="store.unsplashTopicResults.length <= 20"
            @click="getList(store.unsplashTopicPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
      <div v-if="!store.isLoading && store.unsplashTab === 'collections'" class="block stack center">
        <div class="group fill">
          <div class="bgTypeList">
            <div
              v-for="photo in store.unsplashCollectionResults.slice(0, 20)"
              :key="photo.id"
              class="bgTypeListItemWrapper"
            >
              <a
                class="bgTypeListItemLink"
                target="_blank"
                :href="photo.links.html + '?utm_source=carettab&utm_medium=referral'"
                :title="photo.title"
              >
                <fa icon="fa-up-right-from-square" />
              </a>
              <button
                aria-labelledby="unsplashSelect"
                type="button"
                class="bgTypeListItem"
                :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
                @click="getSelectedUnsplashImage(photo.id, photo.title, photo.links.html)"
              >
                <div v-if="photo.preview_photos && photo.preview_photos.length > 0" class="unsplashPreviewList">
                  <div
                    v-for="preview in photo.preview_photos.slice(0, 3)"
                    :key="preview.id"
                    class="bgTypeListItemPreview"
                    :alt="preview.alt_description"
                    :title="preview.description"
                    :style="`background-image: url(${preview.urls.thumb})`"
                  ></div>
                </div>
                <div class="unsplashName bgTypeListItemName">
                  <div v-if="photo.title" class="unsplashDescription">{{ photo.title }}</div>
                  <span>{{ $t('settings.photosCount', [photo.total_photos]) }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!store.isLoading && store.unsplashCollectionResults.length > 0" class="pagination">
          <button
            :aria-label="$t('common.previousPage')"
            :title="$t('common.previousPage')"
            type="button"
            class="btn"
            :disabled="store.unsplashCollectionPage <= 1"
            @click="getList(store.unsplashCollectionPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">
            {{ $t('settings.pageCount', [store.unsplashCollectionPage]) }}
          </div>
          <button
            :aria-label="$t('common.nextPage')"
            :title="$t('common.nextPage')"
            type="button"
            class="btn"
            :disabled="store.unsplashCollectionResults.length <= 20"
            @click="getList(store.unsplashCollectionPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.unsplashResultsDefault {
  display: grid;
  place-content: center;
  width: 100%;
  height: 100px;
  font-style: italic;
  font-size: 1.6rem;
  opacity: 0.5;
}

.bgTypeList {
  grid-template-columns: 1fr 1fr;
}

.bgTypeListItemWrapper {
  position: relative;
}

.bgTypeListItemLink {
  position: absolute;
  inset: var(--s4) var(--s4) auto auto;
  font-size: 1.2rem;
  padding: 0.6rem;
  background-color: hsl(0 0 0 / 0.5);
  border-radius: var(--s3);
}

.unsplashPreviewList {
  width: 100%;
  border-radius: var(--s3);
  border: 1px solid var(--g1);
  margin-bottom: var(--s3);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  grid-template-areas:
    'img1 img1 img2'
    'img1 img1 img3';
  gap: var(--s3);
  aspect-ratio: 4 / 2.5;
  overflow: hidden;
  padding: 0;

  div {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;

    &:nth-child(1) {
      grid-area: img1;
    }

    &:nth-child(2) {
      grid-area: img2;
    }

    &:nth-child(3) {
      grid-area: img3;
    }

    &:nth-child(4) {
      grid-area: img4;
    }
  }
}

.unsplashName {
  display: grid;
  grid-template-rows: auto;
  gap: var(--s2);
  padding: 0 var(--s4);

  a:not(.btn) {
    color: currentColor;
  }
}

.unsplashDescription {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
