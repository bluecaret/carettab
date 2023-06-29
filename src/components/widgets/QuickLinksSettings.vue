<script setup>
import { ref, reactive, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { useSettingsStore, generateUID } from '@/store.js'
import { checkPermission } from '@/helpers/widgets.js'

const store = useSettingsStore()

const widgetStore = 'quickLinks'
const ci = ref(store.config[widgetStore].findIndex((c) => c.id === store.editing))
const widget = reactive(store.config[widgetStore][ci.value])

const bookmarksPermission = ref(false)
const topSitesPermission = ref(false)
const faviconPermission = ref(false)
const newSpecialLinkEl = ref(null)

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

const addLink = (type = 'none') => {
  let title = ''
  let url = ''
  switch (type) {
    case 'apps':
      title = 'Apps'
      url = 'Apps'
      break
    case 'bookmarksManager':
      title = 'Bookmarks Manager'
      url = 'Bookmarks Manager'
      break
    case 'history':
      title = 'History'
      url = 'History'
      break
    case 'defaultTab':
      title = 'Default Tab'
      url = 'Default Tab'
      break
    case 'mostVisited':
      title = 'Most Visited'
      url = 'Most Visited'
      break

    default:
      break
  }

  widget.quickLinks.push({
    id: generateUID(),
    title: title,
    url: url,
    special: type,
  })

  if (newSpecialLinkEl.value) newSpecialLinkEl.value.close()
}

const deleteLink = (id) => {
  const index = widget.quickLinks.findIndex((q) => q.id === id)
  store.config.quickLinks[ci.value].quickLinks.splice(index, 1)
}
</script>

<template>
  <PageHeading title="Quick Links" :widget-id="widget.id"></PageHeading>
  <div class="page">
    <div class="blockContainer">
      <WidgetBoxField :index="ci" :widget-store="widgetStore" />
      <WidgetFontField :index="ci" :widget-store="widgetStore" />
    </div>
    <div class="blockContainer">
      <div class="block">
        <label for="position" class="label">{{ $t('widget.type') }}</label>
        <select id="position" v-model="widget.type" class="select w20">
          <option value="ql">Quick links</option>
          <option value="bk">Browser's bookmarks</option>
          <option value="mv">Most visited pages</option>
        </select>
      </div>
      <div v-if="!bookmarksPermission && widget.type === 'bk'" class="block">
        <div class="label">
          <div>Bookmarks</div>
          <div class="desc">
            {{ $t('widget.theBookmarksTypeUses') }}
          </div>
        </div>
        <RequestPermissionModal
          permission="bookmarks"
          permission-label="Bookmarks"
          :reason="$t('widget.theBookmarksPermissionIsNeeded')"
          @requested="checkBookmarksPermission()"
        />
      </div>
      <div
        v-if="
          !topSitesPermission && (widget.type === 'mv' || widget.quickLinks.find((l) => l.special === 'mostVisited'))
        "
        class="block"
      >
        <div class="label">
          <div>Most Visited</div>
          <div class="desc">
            {{ $t('widget.theMostVisitedTypeAccess') }}
          </div>
        </div>
        <RequestPermissionModal
          permission="topSites"
          permission-label="Top Sites"
          :reason="$t('widget.theTopSitesPermissionIsNeeded')"
          @requested="checkTopSitesPermission()"
        />
      </div>
      <div class="block">
        <label for="position" class="label">{{ $t('widget.layout') }}</label>
        <select id="position" v-model="widget.layout" class="select w20">
          <option value="ch">Classic horizontal</option>
          <option value="cv">Classic vertical</option>
          <option value="cg">Classic grid</option>
          <option value="ih">Iconified horizontal</option>
          <option value="iv">Iconified vertical</option>
          <option value="ig">Iconified grid</option>
        </select>
      </div>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.linkSpacing') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="linkmargin" class="label">{{ $t('widget.spaceBetweenLinks') }}</label>
            <NumberField v-model="widget.link.margin" tag-id="linkmargin" :min="0" class="w10"></NumberField>
          </div>
          <div class="block">
            <label for="linkpadding" class="label">{{ $t('widget.paddingAroundLinkText') }}</label>
            <NumberField v-model="widget.link.padding" tag-id="linkpadding" :min="0" class="w10"></NumberField>
          </div>
          <div class="block">
            <div class="label">
              <label for="linkmaxwidth">{{ $t('widget.maxWidthOfLink') }}</label>
              <div class="desc">{{ $t('widget.maximumWidthALink') }}</div>
            </div>
            <NumberField v-model="widget.link.maxWidth" tag-id="linkmaxwidth" :min="1" class="w10"></NumberField>
          </div>
        </template>
      </FieldAccordion>
      <FieldAccordion>
        <template #label>
          <div class="label">{{ $t('widget.linkStyles') }}</div>
        </template>
        <template #children>
          <div class="block">
            <label for="showTitle" class="label mra">{{ $t('widget.showTitle') }}</label>
            <ToggleField v-model="widget.link.titles" tag-id="showTitle"></ToggleField>
          </div>
          <div class="block">
            <label for="showIcons" class="label">{{ $t('widget.showFavicon') }}</label>
            <RequestPermissionModal
              v-if="!faviconPermission"
              permission="favicon"
              permission-label="Favicons"
              :reason="$t('widget.theFaviconsPermissionIsNeeded')"
              @requested="checkFaviconPermission()"
            />
            <ToggleField v-if="faviconPermission" id="showIcons" v-model="widget.link.icons"></ToggleField>
          </div>
          <div v-if="faviconPermission && widget.link.icons" class="block">
            <div class="label">
              <label for="iconSize">{{ $t('widget.faviconSize') }}</label>
              <div v-if="widget.link.icons && faviconPermission" class="desc">
                {{ $t('widget.recommendedToNotSetTheFaviconSize') }}
              </div>
            </div>
            <NumberField v-model="widget.link.iconSize" tag-id="iconSize" :min="1" class="w10"></NumberField>
          </div>
          <div class="block">
            <label for="linkbackground" class="label">{{ $t('common.background') }}</label>
            <ColorField v-model="widget.link.background" tag-id="linkbackground" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="linkhoverbackground" class="label">{{ $t('widget.backgroundWhenHovering') }}</label>
            <ColorField v-model="widget.link.hoverBackground" tag-id="linkhoverbackground" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="linkShadow" class="label">{{ $t('common.shadow') }}</label>
            <ColorField v-model="widget.link.shadow" shadow tag-id="linkShadow" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="linkborderSize" class="label">{{ $t('common.borderSize') }}</label>
            <NumberField v-model="widget.link.borderSize" tag-id="linkborderSize" :min="0" class="w10"></NumberField>
          </div>
          <div class="block">
            <label for="linkborderColor" class="label">{{ $t('common.borderColor') }}</label>
            <ColorField v-model="widget.link.borderColor" tag-id="linkborderColor" class="w20"></ColorField>
          </div>
          <div class="block">
            <label for="linkborderRadius" class="label">{{ $t('widget.roundedCorners') }}</label>
            <NumberField
              v-model="widget.link.borderRadius"
              tag-id="linkborderRadius"
              :min="0"
              class="w20"
            ></NumberField>
          </div>
        </template>
      </FieldAccordion>
      <div class="block">
        <label for="openInNewTab" class="label mra">{{ $t('widget.openInNewTab') }}</label>
        <ToggleField id="openInNewTab" v-model="widget.link.openInNewTab"></ToggleField>
      </div>
    </div>
    <h3 v-if="widget.type === 'ql'" class="subtitle">{{ $t('widget.quickLinks') }}</h3>
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
                :placeholder="$t('widget.linkTitle')"
                :aria-label="$t('widget.linkTitle')"
              />
              <input
                v-model="element.url"
                class="input"
                type="text"
                placeholder="https://"
                :disabled="element.special !== 'none' ? 'disabled' : null"
                aria-label="URL"
              />
              <button type="button" class="btn" :aria-label="$t('widget.deleteLink')" @click="deleteLink(element.id)">
                <fa icon="fa-trash" fixed-width></fa>
              </button>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="block">
            <div class="group fill">
              <div>
                <button type="button" class="btn fit" @click="addLink()">
                  <fa icon="fa-plus"></fa>
                  {{ $t('widget.addNewLink') }}
                </button>
              </div>
              <DropdownMenu ref="newSpecialLinkEl" style="width: auto">
                <template #button>
                  <button type="button" class="btn">
                    {{ $t('widget.addSpecialLink') }}
                    <fa icon="fa-caret-down"></fa>
                  </button>
                </template>
                <template #menu>
                  <ul class="specialLinksMenu">
                    <li>
                      <button class="btn btnBlock" type="button" @click="addLink('apps')">Apps</button>
                    </li>
                    <li>
                      <button class="btn btnBlock" type="button" @click="addLink('bookmarksManager')">
                        Bookmarks Manager
                      </button>
                    </li>
                    <li>
                      <button class="btn btnBlock" type="button" @click="addLink('history')">History</button>
                    </li>
                    <li>
                      <button class="btn btnBlock" type="button" @click="addLink('defaultTab')">Default Tab</button>
                    </li>
                    <li>
                      <button
                        v-if="topSitesPermission"
                        class="btn btnBlock"
                        type="button"
                        @click="addLink('mostVisited')"
                      >
                        Most Visited
                      </button>
                      <RequestPermissionModal
                        v-if="!topSitesPermission"
                        btn-label="Most Visited (Needs permission)"
                        permission="topSites"
                        permission-label="Top Sites"
                        :reason="$t('widget.theTopSitesPermissionIsNeeded')"
                        @requested="checkTopSitesPermission()"
                      />
                    </li>
                  </ul>
                </template>
              </DropdownMenu>
            </div>
          </div>
        </template>
      </draggable>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.specialLinksMenu {
  list-style: none;
  display: grid;
  grid-template: auto / 1fr;
  margin: 0;
  gap: var(--s4);
  padding: var(--s4);
}
</style>
