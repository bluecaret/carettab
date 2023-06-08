<script setup>
import { ref, reactive, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore, generateUID } from '@/store.js'
import { checkPermission } from '@/helpers/widgets.js'

const store = useSettingsStore()

const ci = ref(store.config.quickLinks.findIndex((c) => c.id === store.editing))
const widget = reactive(store.config.quickLinks[ci.value])

const bookmarksPermission = ref(false)
const topSitesPermission = ref(false)
const faviconPermission = ref(false)

onMounted(() => {
  checkBookmarksPermission()
  checkTopSitesPermission()
  checkFaviconPermission()
})

const checkBookmarksPermission = async () => {
  bookmarksPermission.value = await checkPermission('bookmarks')
}

const checkTopSitesPermission = async () => {
  topSitesPermission.value = await checkPermission('topSites')
}

const checkFaviconPermission = async () => {
  faviconPermission.value = await checkPermission('favicon')
}

const addLink = () => {
  widget.quickLinks.push({
    id: generateUID(),
    title: '',
    url: '',
  })
}

const deleteLink = (id) => {
  const index = widget.quickLinks.findIndex((q) => q.id === id)
  store.config.quickLinks[ci.value].quickLinks.splice(index, 1)
}
</script>

<template>
  <div class="page">
    <PageHeading title="Quick Links" :widget-id="widget.id"></PageHeading>
    <h3 class="subtitle">Quick link options</h3>
    <div class="blockContainer">
      <div class="block">
        <div class="group fill">
          <div class="label mra">Setup</div>
          <div class="group compact">
            <label for="position" class="desc mra">Type</label>
            <select id="position" v-model="widget.type" class="select w21">
              <option value="ql">Quick links</option>
              <option value="bk">Bookmarks from browser</option>
              <option value="mv">Most visited pages</option>
            </select>
          </div>
          <div class="group compact">
            <label for="position" class="desc mra">Layout</label>
            <select id="position" v-model="widget.layout" class="select w16">
              <option value="ch">Classic horizontal</option>
              <option value="cv">Classic vertical</option>
              <option value="cg">Classic grid</option>
              <option value="sh">Stacked horizontal</option>
              <option value="sv">Stacked vertical</option>
              <option value="sg">Stacked grid</option>
            </select>
          </div>
        </div>
      </div>
      <div v-if="!bookmarksPermission && widget.type === 'bk'" class="block">
        <div class="label">
          <div>Bookmarks</div>
          <div class="desc">
            The bookmarks type uses the bookmarks saved in your browser. Permissions are needed to access your
            bookmarks. If you prefer to not allow this permission, try the quick links type instead.
          </div>
        </div>
        <RequestPermissionModal
          permission="bookmarks"
          permission-label="Bookmarks"
          reason="The Bookmarks permission is needed to retrieve the bookmarks you have saved in the browser. Denying this permission will prevent the Bookmarks bar from being shown."
          @requested="checkBookmarksPermission()"
        />
      </div>
      <div v-if="!topSitesPermission && widget.type === 'mv'" class="block">
        <div class="label">
          <div>Most Visited</div>
          <div class="desc">
            The most visited type access the list of top sites you have visited. Permissions are needed to access your
            top sites. If you prefer to not allow this permission, try the quick links type instead.
          </div>
        </div>
        <RequestPermissionModal
          permission="topSites"
          permission-label="Top Sites"
          reason="The top sites permission is needed to retrieve the list of tope sites you have visited. Denying this permission will prevent the Most Visited list from being shown."
          @requested="checkTopSitesPermission()"
        />
      </div>
    </div>
    <template v-if="widget.type === 'ql'">
      <draggable
        class="blockContainer"
        :list="widget.quickLinks"
        item-key="id"
        ghost-class="dragGhost"
        chosen-class="dragChosen"
        drag-class="dragMove"
        handle=".drag"
        @start="drag = true"
        @end="drag = false"
      >
        <template #item="{ element }">
          <div class="block">
            <div class="group fill compact">
              <div type="button" class="drag fit">
                <fa icon="fa-grip-vertical" size="xs" fixed-width></fa>
              </div>
              <input
                v-model="element.title"
                class="input w16"
                type="text"
                placeholder="Link title"
                aria-label="Title"
              />
              <input v-model="element.url" class="input" type="text" placeholder="https://" aria-label="URL" />
              <button type="button" class="btn" aria-label="Delete link" @click="deleteLink(element.id)">
                <fa icon="fa-trash" fixed-width></fa>
              </button>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="block">
            <div class="group fill">
              <button type="button" class="btn" @click="addLink()">
                <fa icon="fa-plus"></fa>
                Add new link
              </button>
            </div>
          </div>
        </template>
      </draggable>
    </template>
    <h3 class="subtitle">Widget style</h3>
    <div class="blockContainer">
      <SizeAndPositionField
        v-model:width="widget.base.width"
        v-model:widthUnit="widget.base.widthUnit"
        v-model:height="widget.base.height"
        v-model:heightUnit="widget.base.heightUnit"
        v-model:autoSize="widget.base.autoSize"
        v-model:align="widget.base.alignment"
        v-model:calign="widget.base.container.alignment"
        v-model:x="widget.base.x"
        v-model:y="widget.base.y"
      >
      </SizeAndPositionField>
      <WidgetBoxField
        v-model:override="widget.base.container.override"
        v-model:rounded="widget.base.container.radius"
        v-model:borderSize="widget.base.container.borderSize"
        v-model:borderColor="widget.base.container.borderColor"
        v-model:background="widget.base.container.background"
        v-model:shadow="widget.base.container.shadow"
        v-model:padding="widget.base.container.padding"
      >
      </WidgetBoxField>
    </div>
    <h3 class="subtitle">Link style</h3>
    <div class="blockContainer">
      <WidgetFontField
        v-model:override="widget.base.font.override"
        v-model:color="widget.base.font.color"
        v-model:size="widget.base.font.size"
        v-model:bold="widget.base.font.bold"
        v-model:italic="widget.base.font.italic"
        v-model:underline="widget.base.font.underline"
        v-model:letterSpacing="widget.base.font.letterSpacing"
        v-model:shadow="widget.base.font.shadow"
        v-model:transform="widget.base.font.transform"
        v-model:family="widget.base.font.family"
      >
      </WidgetFontField>
      <div class="block">
        <div class="label mra">Spacing</div>
        <div class="group compact">
          <label for="linkmargin" class="desc">Margin</label>
          <NumberField v-model="widget.link.margin" tag-id="linkmargin" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkpadding" class="desc">Padding</label>
          <NumberField v-model="widget.link.padding" tag-id="linkpadding" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkmaxwidth" class="desc">Max width</label>
          <NumberField v-model="widget.link.maxWidth" tag-id="linkmaxwidth" :min="1" class="w6"></NumberField>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Colors</div>
        <div class="group compact">
          <label for="linkbackground" class="desc">Background</label>
          <ColorField v-model="widget.link.background" tag-id="linkbackground" class="w6"></ColorField>
        </div>
        <div class="group compact">
          <label for="linkhoverbackground" class="desc">Hover Background</label>
          <ColorField v-model="widget.link.hoverBackground" tag-id="linkhoverbackground" class="w6"></ColorField>
        </div>
        <div class="group compact">
          <label for="linkShadow" class="desc">Shadow</label>
          <ColorField v-model="widget.link.shadow" shadow tag-id="linkShadow" class="w6"></ColorField>
        </div>
      </div>
      <div class="block">
        <div class="label mra">Border</div>
        <div class="group compact">
          <label for="linkborderSize" class="desc">Size</label>
          <NumberField v-model="widget.link.borderSize" tag-id="linkborderSize" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkborderRadius" class="desc">Rounded</label>
          <NumberField v-model="widget.link.borderRadius" tag-id="linkborderRadius" :min="0" class="w6"></NumberField>
        </div>
        <div class="group compact">
          <label for="linkborderColor" class="desc">Color</label>
          <ColorField v-model="widget.link.borderColor" tag-id="linkborderColor" class="w6"></ColorField>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <label for="showTitle" class="label mra">Link title</label>
          <ToggleField v-model="widget.link.titles" tag-id="showTitle"></ToggleField>
        </div>
      </div>
      <div class="block">
        <div class="group fill">
          <div class="label mra">
            Favicons
            <div v-if="widget.link.icons && faviconPermission" class="desc">
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
            <ToggleField v-if="faviconPermission" id="showIcons" v-model="widget.link.icons"></ToggleField>
          </div>
          <div v-if="widget.link.icons" class="group compact">
            <label for="iconSize" class="desc">Size</label>
            <NumberField
              v-if="faviconPermission"
              v-model="widget.link.iconSize"
              tag-id="iconSize"
              :min="1"
              class="w6"
            ></NumberField>
          </div>
        </div>
      </div>
      <div class="block">
        <label for="openInNewTab" class="label mra">Open in new tab</label>
        <ToggleField id="openInNewTab" v-model="widget.link.openInNewTab"></ToggleField>
      </div>
    </div>
  </div>
</template>
