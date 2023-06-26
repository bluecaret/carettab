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
  <PageHeading title="Pexels.com photos" back-page="dashboard"></PageHeading>
  <div class="page">
    <div class="tabs">
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'search' }"
        type="button"
        @click="handleTabChange('search')"
      >
        Search
      </button>
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'carettab' }"
        type="button"
        @click="handleTabChange('carettab')"
      >
        Hand-picked for CaretTab
      </button>
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'curated' }"
        type="button"
        @click="handleTabChange('curated')"
      >
        Curated
      </button>
      <button
        class="btn tab"
        :class="{ active: store.pexelsTab === 'collections' }"
        type="button"
        @click="handleTabChange('collections')"
      >
        Collections
      </button>
    </div>
    <div class="blockContainer">
      <div v-if="store.pexelsTab === 'carettab'" class="block">
        <div class="label">
          <label for="backgroundColor">Random daily photo hand-picked to work great with CaretTab</label>
          <div class="desc">Selecting a list will show a random photo from that list each day.</div>
        </div>
      </div>
      <div v-if="store.pexelsTab === 'collections'" class="block">
        <div class="label">
          <label for="backgroundColor">Random daily photo from Pexels lists</label>
          <div class="desc">Selecting a list will show a random photo from that list each day.</div>
        </div>
      </div>
      <div v-if="store.pexelsTab === 'curated'" class="block">
        <div class="group fill">
          <div class="label fill mra">
            <label for="backgroundColor">Pexels curated photos</label>
            <div class="desc">Find a single photo from Pexels curated list to use as the wallpaper.</div>
          </div>
          <div>
            <button type="button" class="btn fit" @click="getSelectedPexelsImage(null, null, null)">
              Use daily curated photo
            </button>
          </div>
        </div>
      </div>
      <div v-if="store.pexelsTab === 'search'" class="block">
        <div class="label">
          <label for="backgroundColor">Search Pexels photos</label>
          <div class="desc">Find a single photo from Pexels to use as the wallpaper.</div>
        </div>
        <form class="group fill compact" novalidate @submit.prevent="handlePexelsPhotoSearch()">
          <input v-model="store.pexelsSearchTerm" type="text" class="input fill" />
          <button type="submit" class="btn">
            <fa icon="fa-search" fixed-width></fa>
            Search
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
          Search for a photo above to see results.
        </div>
        <div
          v-if="store.pexelsStatus === 'results' && store.pexelsSearchResults.length <= 0"
          class="pexelsResultsDefault"
        >
          No results found, please try another search.
        </div>
        <div v-if="store.pexelsStatus === 'results' && store.pexelsSearchResults.length > 0" class="group fill">
          <label id="pexelsSelect" class="label">Search results</label>
        </div>
        <div v-if="store.pexelsStatus === 'results' && store.pexelsSearchResults.length > 0" class="group fill">
          <div class="bgTypeList">
            <button
              v-for="photo in store.pexelsSearchResults.slice(0, 20)"
              :key="photo.id"
              aria-labelledby="pexelsSelect"
              type="button"
              class="bgTypeListItem"
              :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
              @click="getSelectedPexelsImage(photo.id, photo.alt ? photo.alt : 'Photo from Pexels.com', photo.url)"
            >
              <div
                class="bgTypeListItemPreview"
                :alt="photo.alt ? photo.alt : 'Photo from Pexels.com'"
                :title="photo.alt ? photo.alt : 'Photo from Pexels.com'"
                :style="`background-image: url(${photo.src.medium})`"
              ></div>
              <div class="bgTypeListItemName">
                <a
                  class="pexelsDescription"
                  target="_blank"
                  :href="photo.url"
                  :title="photo.alt ? photo.alt : 'Photo from Pexels.com'"
                >
                  {{ photo.alt ? photo.alt : 'Photo from Pexels.com' }}
                </a>
                <div>
                  By
                  <a target="_blank" :href="photo.photographer_url">{{ photo.photographer }}</a>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsSearchResults.length > 0" class="pagination">
          <button
            aria-label="Previous page"
            title="Previous page"
            type="button"
            class="btn"
            :disabled="store.pexelsSearchPage <= 1"
            @click="getList(store.pexelsSearchPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.pexelsSearchPage }}</div>
          <button
            aria-label="Next page"
            title="Next page"
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
            <button
              v-for="photo in store.pexelsCuratedResults.slice(0, 20)"
              :key="photo.id"
              aria-labelledby="pexelsSelect"
              type="button"
              class="bgTypeListItem"
              :class="store.config.global.wallpaper.id === photo.id ? 'active' : ''"
              @click="getSelectedPexelsImage(photo.id, photo.alt ? photo.alt : 'Photo from Pexels.com', photo.url)"
            >
              <div
                class="bgTypeListItemPreview"
                :alt="photo.alt ? photo.alt : 'Photo from Pexels.com'"
                :title="photo.alt ? photo.alt : 'Photo from Pexels.com'"
                :style="`background-image: url(${photo.src.medium})`"
              ></div>
              <div class="bgTypeListItemName">
                <a
                  class="pexelsDescription"
                  target="_blank"
                  :href="photo.url"
                  :title="photo.alt ? photo.alt : 'Photo from Pexels.com'"
                >
                  {{ photo.alt ? photo.alt : 'Photo from Pexels.com' }}
                </a>
                <div>
                  By
                  <a target="_blank" :href="photo.photographer_url">{{ photo.photographer }}</a>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsCuratedResults.length > 0" class="pagination">
          <button
            aria-label="Previous page"
            title="Previous page"
            type="button"
            class="btn"
            :disabled="store.pexelsCuratedPage <= 1"
            @click="getList(store.pexelsCuratedPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.pexelsCuratedPage }}</div>
          <button
            aria-label="Next page"
            title="Next page"
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
            <button
              v-for="collection in store.pexelsCollectionResults.slice(0, 20)"
              :key="collection.id"
              aria-labelledby="pexelsSelect"
              type="button"
              class="bgTypeListItem"
              :class="store.config.global.wallpaper.id === collection.id ? 'active' : ''"
              @click="getSelectedPexelsImage(collection.id, collection.title, null)"
            >
              <div class="bgTypeListItemName pexelsCollectionName">
                {{ collection.title }}<span>{{ collection.photos_count }} Photos</span>
              </div>
            </button>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsCollectionResults.length > 0" class="pagination">
          <button
            aria-label="Previous page"
            title="Previous page"
            type="button"
            class="btn"
            :disabled="store.pexelsCollectionPage <= 1"
            @click="getList(store.pexelsCollectionPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.pexelsCollectionPage }}</div>
          <button
            aria-label="Next page"
            title="Next page"
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
            <button
              v-for="collection in store.pexelsCarettabResults.slice(0, 20)"
              :key="collection.id"
              aria-labelledby="pexelsSelect"
              type="button"
              class="bgTypeListItem"
              :class="store.config.global.wallpaper.id === collection.id ? 'active' : ''"
              @click="getSelectedPexelsImage(collection.id, collection.title, null)"
            >
              <div class="bgTypeListItemName pexelsCollectionName">
                {{ collection.title }}<span>{{ collection.photos_count }} Photos</span>
              </div>
            </button>
          </div>
        </div>
        <div v-if="!store.isLoading && store.pexelsCarettabResults.length > 0" class="pagination">
          <button
            aria-label="Previous page"
            title="Previous page"
            type="button"
            class="btn"
            :disabled="store.pexelsCarettabPage <= 1"
            @click="getList(store.pexelsCarettabPage - 1)"
          >
            <fa icon="fa-caret-left" fixed-width></fa>
          </button>
          <div class="currentPage" aria-current="true">Page {{ store.pexelsCarettabPage }}</div>
          <button
            aria-label="Next page"
            title="Next page"
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
