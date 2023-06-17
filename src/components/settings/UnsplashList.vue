<!-- eslint-disable no-undef -->
<script setup>
import { inject } from 'vue'
import { useSettingsStore } from '@/store.js'
import { getList, getSelectedUnsplashImage } from '@/helpers/unsplash.js'

const access = inject('access')

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
    await getList(access.items.us, 1)
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
  getList(access.items.us, 1)
}
</script>

<template>
  <div class="page">
    <PageHeading title="Unsplash.com photos" back-page="extension"></PageHeading>
    <div class="tabs">
      <button
        class="btn tab"
        :class="{ active: store.unsplashTab === 'search' }"
        type="button"
        @click="handleTabChange('search')"
      >
        Search
      </button>
      <button
        class="btn tab"
        :class="{ active: store.unsplashTab === 'topics' }"
        type="button"
        @click="handleTabChange('topics')"
      >
        Topics
      </button>
      <button
        class="btn tab"
        :class="{ active: store.unsplashTab === 'collections' }"
        type="button"
        @click="handleTabChange('collections')"
      >
        Collections
      </button>
    </div>
    <div class="blockContainer">
      <div v-if="store.unsplashTab === 'collections' || store.unsplashTab === 'topics'" class="block">
        <div class="label">
          <label for="backgroundColor">Random daily photo from Unsplash lists</label>
          <div class="desc">Selecting a list will show a random photo from that list each day.</div>
        </div>
      </div>
      <div v-if="store.unsplashTab === 'search'" class="block">
        <div class="label">
          <label for="backgroundColor">Search Unsplash photos</label>
          <div class="desc">Find a single photo from Unsplash to use as the wallpaper.</div>
        </div>
        <form class="group fill compact" novalidate @submit.prevent="handleUnsplashPhotoSearch()">
          <input v-model="store.unsplashSearchTerm" type="text" class="input fill" />
          <button type="submit" class="btn">
            <fa icon="fa-search" fixed-width></fa>
            Search
          </button>
        </form>
      </div>
      <div v-if="!store.isLoading && store.unsplashTab === 'search'" class="block center">
        <div
          v-if="
            store.unsplashStatus === 'default' &&
            (!store.unsplashSearchResults || store.unsplashSearchResults.length <= 0)
          "
          class="unsplashResultsDefault"
        >
          Search for a photo above to see results.
        </div>
        <div
          v-if="store.unsplashStatus === 'results' && store.unsplashSearchResults.length <= 0"
          class="unsplashResultsDefault"
        >
          No results found, please try another search.
        </div>
        <div v-if="store.unsplashStatus === 'results' && store.unsplashSearchResults.length > 0" class="group fill">
          <label id="unsplashSelect" class="label">Search results</label>
        </div>
        <div v-if="store.unsplashStatus === 'results' && store.unsplashSearchResults.length > 0" class="group fill">
          <div class="unsplashGrid">
            <button
              v-for="photo in store.unsplashSearchResults.slice(0, 20)"
              :key="photo.id"
              aria-labelledby="unsplashSelect"
              type="button"
              class="unsplashBtn"
              :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
              @click="getSelectedUnsplashImage(access.items.us, photo.id, photo.title, photo.links.html)"
            >
              <div
                class="unsplashPreview"
                :alt="photo.alt_description"
                :title="photo.description"
                :style="`background-image: url(${photo.urls.thumb})`"
              ></div>
              <div class="unsplashName">
                <a
                  v-if="photo.description"
                  class="unsplashDescription"
                  target="_blank"
                  :href="photo.links.html + '?utm_source=carettab&utm_medium=referral'"
                  :title="photo.description"
                  >{{ photo.description }}</a
                >
                <div>
                  By
                  <a target="_blank" :href="photo.user.links.html + '?utm_source=carettab&utm_medium=referral'">{{
                    photo.user.name ? photo.user.name : photo.user.username
                  }}</a>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div v-if="!store.isLoading && store.unsplashSearchResults.length > 0" class="pagination">
          <button
            aria-label="Previous page"
            title="Previous page"
            type="button"
            class="btn"
            :disabled="store.unsplashSearchPage <= 1"
            @click="getList(access.items.us, store.unsplashSearchPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.unsplashSearchPage }}</div>
          <button
            aria-label="Next page"
            title="Next page"
            type="button"
            class="btn"
            :disabled="store.unsplashSearchResults.length <= 20"
            @click="getList(access.items.us, store.unsplashSearchPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
      <div v-if="!store.isLoading && store.unsplashTab === 'topics'" class="block center">
        <div class="group fill">
          <div class="unsplashGrid">
            <button
              v-for="photo in store.unsplashTopicResults.slice(0, 20)"
              :key="photo.id"
              aria-labelledby="unsplashSelect"
              type="button"
              class="unsplashBtn"
              :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
              @click="getSelectedUnsplashImage(access.items.us, photo.id, photo.title, photo.links.html)"
            >
              <div v-if="photo.preview_photos && photo.preview_photos.length > 0" class="unsplashPreviewList">
                <div
                  v-for="preview in photo.preview_photos.slice(0, 3)"
                  :key="preview.id"
                  class="unsplashPreview"
                  :alt="preview.alt_description"
                  :title="preview.description"
                  :style="`background-image: url(${preview.urls.thumb})`"
                ></div>
              </div>
              <div class="unsplashName">
                <a target="_blank" :href="photo.links.html + '?utm_source=carettab&utm_medium=referral'">{{
                  photo.title
                }}</a
                ><span>{{ photo.total_photos }} Photos</span>
              </div>
            </button>
          </div>
        </div>
        <div v-if="!store.isLoading && store.unsplashTopicResults.length > 0" class="pagination">
          <button
            aria-label="Previous page"
            title="Previous page"
            type="button"
            class="btn"
            :disabled="store.unsplashTopicPage <= 1"
            @click="getList(access.items.us, store.unsplashTopicPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.unsplashTopicPage }}</div>
          <button
            aria-label="Next page"
            title="Next page"
            type="button"
            class="btn"
            :disabled="store.unsplashTopicResults.length <= 20"
            @click="getList(access.items.us, store.unsplashTopicPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
      <div v-if="!store.isLoading && store.unsplashTab === 'collections'" class="block center">
        <div class="group fill">
          <div class="unsplashGrid">
            <button
              v-for="photo in store.unsplashCollectionResults.slice(0, 20)"
              :key="photo.id"
              aria-labelledby="unsplashSelect"
              type="button"
              class="unsplashBtn"
              :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
              @click="getSelectedUnsplashImage(access.items.us, photo.id, photo.title, photo.links.html)"
            >
              <div v-if="photo.preview_photos && photo.preview_photos.length > 0" class="unsplashPreviewList">
                <div
                  v-for="preview in photo.preview_photos.slice(0, 3)"
                  :key="preview.id"
                  class="unsplashPreview"
                  :alt="preview.alt_description"
                  :title="preview.description"
                  :style="`background-image: url(${preview.urls.thumb})`"
                ></div>
              </div>
              <div class="unsplashName">
                <a target="_blank" :href="photo.links.html + '?utm_source=carettab&utm_medium=referral'">{{
                  photo.title
                }}</a
                ><span>{{ photo.total_photos }} Photos</span>
              </div>
            </button>
          </div>
        </div>
        <div v-if="!store.isLoading && store.unsplashCollectionResults.length > 0" class="pagination">
          <button
            aria-label="Previous page"
            title="Previous page"
            type="button"
            class="btn"
            :disabled="store.unsplashCollectionPage <= 1"
            @click="getList(access.items.us, store.unsplashCollectionPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.unsplashCollectionPage }}</div>
          <button
            aria-label="Next page"
            title="Next page"
            type="button"
            class="btn"
            :disabled="store.unsplashCollectionResults.length <= 20"
            @click="getList(access.items.us, store.unsplashCollectionPage + 1)"
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

.unsplashGrid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  // --bgSat: 0%;
}

.unsplashBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border: 1px solid var(--cGrey1);
  border-radius: var(--s3);
  background-color: var(--cGrey1);
  padding: var(--s4);
  cursor: pointer;

  &.active {
    border-color: var(--cBlue3);
    background-color: var(--cBlue3);
  }

  &:hover {
    border-color: var(--cGrey1Hover);
  }
}

.unsplashPreview {
  width: 100%;
  border-radius: var(--s3);
  border: 1px solid var(--cGrey1);
  margin-bottom: var(--s3);
  background-size: cover;
  aspect-ratio: 16/9;
}

.unsplashPreviewList {
  width: 100%;
  border-radius: var(--s3);
  border: 1px solid var(--cGrey1);
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
  margin-top: var(--s2);
  font-size: 1.4rem;
  font-weight: 500;
  color: currentColor;
  opacity: 0.6;
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
