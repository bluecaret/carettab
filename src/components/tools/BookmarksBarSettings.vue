<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useSettingsStore } from '@/store.js'
import { checkPermission } from '@/helpers/widgets.js'

const store = useSettingsStore()
const tool = reactive(store.config.bookmarksBar)
const bookmarksPermission = ref(false)
const faviconPermission = ref(false)

onMounted(() => {
  checkBookmarksPermission()
  checkFaviconPermission()
})

const checkBookmarksPermission = async () => {
  bookmarksPermission.value = await checkPermission('bookmarks')
}

const checkFaviconPermission = async () => {
  faviconPermission.value = await checkPermission('favicon')
}
</script>

<template>
  <div class="page">
    <PageHeading title="Bookmarks bar" :widget-id="tool.id"></PageHeading>
    <div v-if="!bookmarksPermission" class="blockContainer">
      <div class="block">
        <div class="label">
          <div>Bookmarks</div>
          <div class="desc">
            The bookmarks bar uses the bookmarks saved in your browser. Permissions are needed to access your bookmarks.
            If you prefer to not allow this permission, try the Quick Links widget instead.
          </div>
        </div>
        <RequestPermissionModal
          permission="bookmarks"
          permission-label="Bookmarks"
          reason="The Bookmarks permission is needed to retrieve the bookmarks you have saved in the browser. Denying this permission will prevent the Bookmarks bar from being shown."
          @requested="checkBookmarksPermission()"
        />
      </div>
    </div>
    <h3 v-if="bookmarksPermission" class="subtitle">Bar style</h3>
    <div v-if="bookmarksPermission" class="blockContainer">
      <div class="block">
        <label for="position" class="label mra">Position</label>
        <select id="position" v-model="tool.bar.position" class="select w20">
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>
      <div class="block">
        <div class="label mra">Spacing</div>
        <div class="group compact">
          <label for="margin" class="desc">Margin</label>
          <NumberField v-model="tool.bar.margin" tag-id="margin" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="padding" class="desc">Padding</label>
          <NumberField v-model="tool.bar.padding" tag-id="padding" :min="0" class="w6"></NumberField>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Colors</div>
        <div class="group compact">
          <label for="background" class="desc">Background</label>
          <ColorField v-model="tool.bar.background" tag-id="background" class="w6"></ColorField>
        </div>
        <div class="group compact">
          <label for="shadow" class="desc">Shadow</label>
          <ColorField v-model="tool.bar.shadow" tag-id="shadow" shadow class="w6"></ColorField>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Border</div>
        <div class="group compact">
          <label for="borderSize" class="desc">Size</label>
          <NumberField v-model="tool.bar.borderSize" tag-id="borderSize" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="borderRadius" class="desc">Rounded</label>
          <NumberField v-model="tool.bar.borderRadius" tag-id="borderRadius" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="borderColor" class="desc">Color</label>
          <ColorField v-model="tool.bar.borderColor" tag-id="borderColor" class="w6"></ColorField>
        </div>
      </div>
    </div>
    <h3 v-if="bookmarksPermission" class="subtitle">Link style</h3>
    <div v-if="bookmarksPermission" class="blockContainer">
      <widgetFontField
        v-model:override="tool.base.font.override"
        v-model:color="tool.base.font.color"
        v-model:size="tool.base.font.size"
        v-model:bold="tool.base.font.bold"
        v-model:italic="tool.base.font.italic"
        v-model:underline="tool.base.font.underline"
        v-model:letterSpacing="tool.base.font.letterSpacing"
        v-model:shadow="tool.base.font.shadow"
        v-model:transform="tool.base.font.transform"
        v-model:family="tool.base.font.family"
      >
      </widgetFontField>
      <div class="block">
        <div class="label mra">Spacing</div>
        <div class="group compact">
          <label for="linkmargin" class="desc">Margin</label>
          <NumberField v-model="tool.link.margin" tag-id="linkmargin" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkpadding" class="desc">Padding</label>
          <NumberField v-model="tool.link.padding" tag-id="linkpadding" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkmaxwidth" class="desc">Max width</label>
          <NumberField v-model="tool.link.maxWidth" tag-id="linkmaxwidth" :min="1" class="w6"></NumberField>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Colors</div>
        <div class="group compact">
          <label for="linkbackground" class="desc">Background</label>
          <ColorField v-model="tool.link.background" tag-id="linkbackground" class="w6"></ColorField>
        </div>
        <div class="group compact">
          <label for="linkhoverbackground" class="desc">Hover Background</label>
          <ColorField v-model="tool.link.hoverBackground" tag-id="linkhoverbackground" class="w6"></ColorField>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Border</div>
        <div class="group compact">
          <label for="linkborderSize" class="desc">Size</label>
          <NumberField v-model="tool.link.borderSize" tag-id="linkborderSize" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkborderRadius" class="desc">Rounded</label>
          <NumberField v-model="tool.link.borderRadius" tag-id="linkborderRadius" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkborderColor" class="desc">Color</label>
          <ColorField v-model="tool.link.borderColor" tag-id="linkborderColor" class="w6"></ColorField>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            Favicons
            <div v-if="tool.link.icons && faviconPermission" class="desc">
              Recommended to not set the favicon size above 32. Higher sizes could result in poor image quality and
              larger downloads.
            </div>
          </div>
          <RequestPermissionModal
            v-if="!faviconPermission"
            permission="favicon"
            permission-label="Favicons"
            reason="The Favicons permission is needed to retrieve the favicons of bookmarks. This only allows retrieving the icons websites use in the browser's address bar and does not allow any other access. Denying this permission will prevent the favicons from being shown."
            @requested="checkFaviconPermission()"
          />
          <div class="group compact">
            <label for="showIcons" class="desc">Enable</label>
            <ToggleField v-if="faviconPermission" id="showIcons" v-model="tool.link.icons"></ToggleField>
          </div>
          <div v-if="tool.link.icons" class="group compact">
            <label for="iconSize" class="desc">Size</label>
            <NumberField
              v-if="faviconPermission"
              v-model="tool.link.iconSize"
              tag-id="iconSize"
              :min="1"
              class="w6"
            ></NumberField>
          </div>
        </div>
      </div>
      <div class="block">
        <label for="openInNewTab" class="label mra">Open in new tab</label>
        <ToggleField id="openInNewTab" v-model="tool.link.openInNewTab"></ToggleField>
      </div>
    </div>
  </div>
</template>
