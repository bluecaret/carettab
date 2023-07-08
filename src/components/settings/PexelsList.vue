<!-- eslint-disable no-undef -->
<script setup>
import { useSettingsStore } from '@/store.js'
import { getList, getSelectedPexelsImage } from '@/helpers/pexels.js'

if (typeof browser === 'undefined') {
  var browser = chrome
}

const store = useSettingsStore()

const handleTabChange = async (t) => {
  store.pexelsStatus = 'default'
  store.pexelsTab = t

  if (
    (t === 'curated' && store.pexelsCuratedResults.length < 1) ||
    (t === 'collections' && store.pexelsCollectionResults.length < 1) ||
    (t === 'carettab' && store.pexelsCarettabResults.length < 1)
  ) {
    await getList(1)
    store.pexelsStatus = 'results'
    return
  }

  if (t === 'search' && store.pexelsSearchResults.length > 0) {
    store.pexelsStatus = 'results'
    return
  }
}

const handlePexelsPhotoSearch = () => {
  if (!store.pexelsSearchTerm) return
  store.pexelsTab = 'search'
  store.pexelsStatus = 'results'
  getList(1)
}
</script>

<template>
  <PageHeading :title="$t('settings.pexelsComPhotos')" back-page="dashboard"></PageHeading>
  <div class="page">
    <div class="tabs">
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'search' }"
        type="button"
        @click="handleTabChange('search')"
      >
        {{ $t('settings.search') }}
      </button>
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'carettab' }"
        type="button"
        @click="handleTabChange('carettab')"
      >
        {{ $t('settings.handPickedForCarettab') }}
      </button>
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'curated' }"
        type="button"
        @click="handleTabChange('curated')"
      >
        {{ $t('settings.curated') }}
      </button>
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'collections' }"
        type="button"
        @click="handleTabChange('collections')"
      >
        {{ $t('settings.collections') }}
      </button>
    </div>
    <div class="blockContainer">
      <div v-if="store.pexelsTab === 'carettab'" class="block">
        <div class="label">
          <label for="backgroundColor">{{ $t('settings.pexelsTabCaretTabLabel') }}</label>
          <div class="desc">{{ $t('settings.pexelsTabCaretTabDescription') }}</div>
        </div>
      </div>
      <div v-if="store.pexelsTab === 'collections'" class="block">
        <div class="label">
          <label for="backgroundColor">{{ $t('settings.pexelsTabCollectionsLabel') }}</label>
          <div class="desc">{{ $t('settings.pexelsTabCollectionsDescription') }}</div>
        </div>
      </div>
      <div v-if="store.pexelsTab === 'curated'" class="block">
        <div class="group fill">
          <div class="label fill mra">
            <label for="backgroundColor">{{ $t('settings.pexelsTabCuratedLabel') }}</label>
            <div class="desc">{{ $t('settings.pexelsTabCuratedDescription') }}</div>
          </div>
          <div>
            <button type="button" class="btn fit" @click="getSelectedPexelsImage(null, null, null)">
              {{ $t('settings.useDailyCuratedPhoto') }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="store.pexelsTab === 'search'" class="block">
        <div class="label">
          <label for="backgroundColor">{{ $t('settings.searchPexelsPhotos') }}</label>
          <div class="desc">{{ $t('settings.searchPexelsPhotosDescription') }}</div>
        </div>
        <form class="group fill compact" novalidate @submit.prevent="handlePexelsPhotoSearch()">
          <input v-model="store.pexelsSearchTerm" type="text" class="input fill" />
          <button type="submit" class="btn">
            <fa icon="fa-search" fixed-width></fa>
            {{ $t('settings.search') }}
          </button>
        </form>
      </div>
      <div v-if="!store.isLoading && store.pexelsTab === 'search'" class="block stack center">
        <div
          v-if="
            store.pexelsStatus === 'default' && (!store.pexelsSearchResults || store.pexelsSearchResults.length <= 0)
          "
          class="pexelsResultsDefault"
        >
          {{ $t('settings.searchForAPhotoAboveToSeeResults') }}
        </div>
        <div
          v-if="store.pexelsStatus === 'results' && store.pexelsSearchResults.length <= 0"
          class="pexelsResultsDefault"
        >
          {{ $t('settings.noResultsFoundPleaseTryAnotherSearch') }}
        </div>
        <div v-if="store.pexelsStatus === 'results' && store.pexelsSearchResults.length > 0" class="group fill">
          <label id="pexelsSelect" class="label">{{ $t('settings.searchResults') }}</label>
        </div>
        <div v-if="store.pexelsStatus === 'results' && store.pexelsSearchResults.length > 0" class="group fill">
          <div class="bgTypeList">
            <div v-for="photo in store.pexelsSearchResults.slice(0, 20)" :key="photo.id" class="bgTypeListItemWrapper">
              <a
                class="bgTypeListItemLink"
                target="_blank"
                :href="photo.url"
                :title="photo.alt ? photo.alt : $t('settings.photoFromPexelsCom')"
              >
                <fa icon="fa-up-right-from-square" />
              </a>
              <button
                aria-labelledby="pexelsSelect"
                type="button"
                class="bgTypeListItem"
                :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
                @click="
                  getSelectedPexelsImage(photo.id, photo.alt ? photo.alt : $t('settings.photoFromPexelsCom'), photo.url)
                "
              >
                <div
                  class="bgTypeListItemPreview"
                  :alt="photo.alt ? photo.alt : $t('settings.photoFromPexelsCom')"
                  :title="photo.alt ? photo.alt : $t('settings.photoFromPexelsCom')"
                  :style="`background-image: url(${photo.src.medium})`"
                ></div>
                <div class="bgTypeListItemName">
                  <div class="pexelsDescription">{{ photo.alt ? photo.alt : $t('settings.photoFromPexelsCom') }}</div>
                  <div>By {{ photo.photographer }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsSearchResults.length > 0" class="pagination">
          <button
            :aria-label="$t('common.previousPage')"
            :title="$t('common.previousPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsSearchPage <= 1"
            @click="getList(store.pexelsSearchPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.pexelsSearchPage }}</div>
          <button
            :aria-label="$t('common.nextPage')"
            :title="$t('common.nextPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsSearchResults.length <= 20"
            @click="getList(store.pexelsSearchPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
      <div v-if="!store.isLoading && store.pexelsTab === 'curated'" class="block stack center">
        <div class="group fill">
          <div class="bgTypeList">
            <div v-for="photo in store.pexelsCuratedResults.slice(0, 20)" :key="photo.id" class="bgTypeListItemWrapper">
              <a
                class="bgTypeListItemLink"
                target="_blank"
                :href="photo.url"
                :title="photo.alt ? photo.alt : $t('settings.photoFromPexelsCom')"
              >
                <fa icon="fa-up-right-from-square" />
              </a>
              <button
                aria-labelledby="pexelsSelect"
                type="button"
                class="bgTypeListItem"
                :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
                @click="
                  getSelectedPexelsImage(photo.id, photo.alt ? photo.alt : $t('settings.photoFromPexelsCom'), photo.url)
                "
              >
                <div
                  class="bgTypeListItemPreview"
                  :alt="photo.alt ? photo.alt : $t('settings.photoFromPexelsCom')"
                  :title="photo.alt ? photo.alt : $t('settings.photoFromPexelsCom')"
                  :style="`background-image: url(${photo.src.medium})`"
                ></div>
                <div class="bgTypeListItemName">
                  <div class="pexelsDescription">{{ photo.alt ? photo.alt : $t('settings.photoFromPexelsCom') }}</div>
                  <div>By {{ photo.photographer }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsCuratedResults.length > 0" class="pagination">
          <button
            :aria-label="$t('common.previousPage')"
            :title="$t('common.previousPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsCuratedPage <= 1"
            @click="getList(store.pexelsCuratedPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.pexelsCuratedPage }}</div>
          <button
            :aria-label="$t('common.nextPage')"
            :title="$t('common.nextPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsCuratedResults.length <= 20"
            @click="getList(store.pexelsCuratedPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
      <div v-if="!store.isLoading && store.pexelsTab === 'collections'" class="block stack center">
        <div class="group fill">
          <div class="bgTypeList">
            <div
              v-for="collection in store.pexelsCollectionResults.slice(0, 20)"
              :key="collection.id"
              class="bgTypeListItemWrapper"
            >
              <a
                class="bgTypeListItemLink"
                target="_blank"
                :href="`https://www.pexels.com/collections/${collection.id}/`"
                title="View list on Pexels.com"
              >
                <fa icon="fa-up-right-from-square" />
              </a>
              <button
                aria-labelledby="pexelsSelect"
                type="button"
                class="bgTypeListItem"
                :class="store.config.global.wallpaper.id === collection.id ? 'active' : ''"
                @click="getSelectedPexelsImage(collection.id, collection.title, null)"
              >
                <div class="bgTypeListItemName pexelsCollectionName">
                  <div class="pexelsDescription">{{ collection.title }}</div>
                  <span>{{ $t('settings.photosCount', [collection.photos_count]) }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsCollectionResults.length > 0" class="pagination">
          <button
            :aria-label="$t('common.previousPage')"
            :title="$t('common.previousPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsCollectionPage <= 1"
            @click="getList(store.pexelsCollectionPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">
            {{ $t('settings.pageCount', [store.pexelsCollectionPage]) }}
          </div>
          <button
            :aria-label="$t('common.nextPage')"
            :title="$t('common.nextPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsCollectionResults.length <= 20"
            @click="getList(store.pexelsCollectionPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
      <div v-if="!store.isLoading && store.pexelsTab === 'carettab'" class="block stack center">
        <div class="group fill">
          <div class="bgTypeList">
            <div
              v-for="collection in store.pexelsCarettabResults.slice(0, 20)"
              :key="collection.id"
              class="bgTypeListItemWrapper"
            >
              <a
                class="bgTypeListItemLink"
                target="_blank"
                :href="`https://www.pexels.com/collections/${collection.id}/`"
                title="View list on Pexels.com"
              >
                <fa icon="fa-up-right-from-square" />
              </a>
              <button
                aria-labelledby="pexelsSelect"
                type="button"
                class="bgTypeListItem"
                :class="store.config.global.wallpaper.id === collection.id ? 'active' : ''"
                @click="getSelectedPexelsImage(collection.id, collection.title, null)"
              >
                <div class="bgTypeListItemName pexelsCollectionName">
                  <div class="pexelsDescription">{{ collection.title }}</div>
                  <span>{{ $t('settings.photosCount', [collection.photos_count]) }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsCarettabResults.length > 0" class="pagination">
          <button
            :aria-label="$t('common.previousPage')"
            :title="$t('common.previousPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsCarettabPage <= 1"
            @click="getList(store.pexelsCarettabPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">{{ $t('settings.pageCount', [store.pexelsCarettabPage]) }}</div>
          <button
            :aria-label="$t('common.nextPage')"
            :title="$t('common.nextPage')"
            type="button"
            class="btn"
            :disabled="store.pexelsCarettabResults.length <= 20"
            @click="getList(store.pexelsCarettabPage + 1)"
          >
            <fa icon="fa-caret-right" fixed-width></fa>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pexelsResultsDefault {
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
  background-color: hsl(0deg 0% 0% / 0.5);
  border-radius: var(--s3);
}

.bgTypeListItemName,
.pexelsCollectionName {
  display: grid;
  grid-template-rows: auto;
  gap: var(--s2);
  padding: 0 var(--s4);

  a:not(.btn) {
    color: currentColor;
  }
}

.pexelsCollectionName {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 1.8rem;
  span {
    font-size: 1.4rem;
    font-weight: 400;
  }
}

.pexelsDescription {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
