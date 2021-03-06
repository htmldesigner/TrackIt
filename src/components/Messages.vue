<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="actions"
      :items="messages"
      :dateRange="dateRange"
      :viewConfig="viewConfig"
      :colsConfigurator="'toolbar'"
      :theme="theme"
      :title="'Messages'"
      :loading="isLoading"
      :autoscroll="realtimeEnabled"
      scrollOffset="10%"
      :item="listItem"
      :itemprops="getItemsProps"
      @change:date-range="dateRangeChangeHandler"
      @action:to-bottom="actionToBottomHandler"
      @update:cols="updateColsHandler"
    >
      <div class="no-messages text-center" slot="empty">
        <div class="text-white" style="font-size: 3rem;">
          <div>No messages</div>
          <div style="font-size: 1.5rem;">or position is empty</div>
        </div>
      </div>
    </virtual-scroll-list>
    <message-viewer ref="messageViewer" :message="typeof selectedMessage !== 'undefined' ? selectedMessage : {}" inverted @close="closeHandler"></message-viewer>
  </div>
</template>

<script>
import { VirtualScrollList } from 'qvirtualscroll'
import MessageViewer from './MessageViewer'
import { copyToClipboard } from 'quasar'
import MessagesListItem from './MessagesListItem.vue'

const config = {
  actions: [
    {
      icon: 'mdi-eye',
      label: 'view',
      classes: '',
      type: 'view'
    }
  ],
  viewConfig: {
    needShowFilter: false,
    needShowMode: false,
    needShowPageScroll: false,
    needShowDate: false,
    needShowEtc: true
  },
  theme: {
    color: 'white',
    bgColor: 'grey-9',
    contentInverted: true,
    controlsInverted: true
  }
}

export default {
  props: [
    'mode',
    'item',
    'activeDeviceId',
    'limit',
    'messages',
    'date',
    'activeMessagesIds'
  ],
  data () {
    const style = document.createElement('style')
    style.type = 'text/css'
    const head = document.head || document.getElementsByTagName('head')[0]
    const dynamicCSS = head.appendChild(style)
    return {
      listItem: MessagesListItem,
      selectedMessage: undefined,
      dynamicCSS,
      theme: config.theme,
      viewConfig: config.viewConfig,
      actions: config.actions,
      moduleName: this.activeDeviceId
    }
  },
  computed: {
    cols: {
      get () {
        return this.$store.state.messages[this.moduleName].cols
      },
      set (val) {
        this.$store.commit(`messages/${this.moduleName}/updateCols`, val)
      }
    },
    from: {
      get () {
        return this.$store.state.messages[this.moduleName].from
      },
      set (val) {
        val ? this.$store.commit(`messages/${this.moduleName}/setFrom`, val) : this.$store.commit(`messages/${this.moduleName}/setFrom`, 0)
      }
    },
    to: {
      get () {
        return this.$store.state.messages[this.moduleName].to
      },
      set (val) {
        val ? this.$store.commit(`messages/${this.moduleName}/setTo`, val) : this.$store.commit(`messages/${this.moduleName}/setTo`, 0)
      }
    },
    dateRange () {
      return [this.$store.state.messages[this.moduleName].from, this.$store.state.messages[this.moduleName].to]
    },
    reverse: {
      get () {
        return this.$store.state.messages[this.moduleName].reverse || false
      },
      set (val) {
        this.$store.commit(`messages/${this.moduleName}/setReverse`, val)
      }
    },
    currentLimit: {
      get () {
        return this.$store.state.messages[this.moduleName].limit
      },
      set (val) {
        val ? this.$store.commit(`messages/${this.moduleName}/setLimit`, val) : this.$store.commit(`messages/${this.moduleName}/setLimit`, 0)
      }
    },
    selected: {
      get () {
        return this.$store.state.messages[this.moduleName].selected
      },
      set (val) {
        this.$store.commit(`messages/${this.moduleName}/setSelected`, val)
      }
    },
    realtimeEnabled () {
      return this.$store.state.messages[this.moduleName].realtimeEnabled
    },
    isLoading () {
      return this.$store.state.messages[this.moduleName].isLoading
    }
  },
  methods: {
    getItemsProps (index, data) {
      const item = this.messages[index]
      data.key = item['x-flespi-message-key']
      data.class = [`scroll-list-item--${index}`]
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.viewMessageOnMap
    },
    resetParams () {
      this.$refs.scrollList.resetParams()
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    dateRangeChangeHandler (range) {
      const from = range[0],
        to = range[1]
      if (this.from === from && this.to === to) { return false }
      this.from = from
      this.to = to
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.dispatch(`${this.moduleName}/get`)
    },
    viewMessagesHandler ({ index, content }) {
      this.selected = [index]
      this.selectedMessage = content
      this.$refs.messageViewer.show()
      this.$emit('view')
    },
    viewMessageOnMap ({ index, content }) {
      this.$emit('view-on-map', content)
    },
    closeHandler () {
      this.selected = []
      this.selectedMessage = undefined
      if (this.activeMessagesIds.length) {
        this.selected = [this.activeMessagesIds[this.activeMessagesIds.length - 1]]
      }
    },
    actionToBottomHandler () {
      this.$refs.scrollList.scrollTo(this.messages.length - 1)
    },
    copyMessageHandler ({ index, content }) {
      copyToClipboard(JSON.stringify(content)).then((e) => {
        this.$q.notify({
          color: 'positive',
          icon: 'content_copy',
          message: 'Message copied',
          timeout: 1000
        })
      }, (e) => {
        this.$q.notify({
          color: 'negative',
          icon: 'content_copy',
          message: 'Error coping messages',
          timeout: 1000
        })
      })
    },
    actionHandler ({ index, type, content }) {
      switch (type) {
        case 'view': {
          this.viewMessagesHandler({ index, content })
          break
        }
      }
    },
    unselect () {
      if (this.selected.length) {
        this.selected = []
      }
    },
    updateDynamicCSS (content) {
      if (this.dynamicCSS.styleSheet) {
        this.dynamicCSS.styleSheet.cssText = content
      } else {
        this.dynamicCSS.innerText = content
      }
    },
    highlightSelected (indexes) {
      if (indexes.length) {
        const lastIndex = indexes[indexes.length - 1]
        this.selected = [lastIndex]
        this.updateDynamicCSS(`.scroll-list-item--${lastIndex} {background-color: rgba(255,255,255,0.7)!important; color: #333;}`)
      }
    },
    scrollToSelected (index) {
      if (typeof index === 'number' && index >= 0 && this.$refs.scrollList) {
        const itemsCount = this.$refs.scrollList.itemsCount
        let scrollToIndex = index - Math.floor(itemsCount / 2)
        if (scrollToIndex < 0) { scrollToIndex = 0 }
        this.$refs.scrollList.scrollTo(scrollToIndex)
      }
    },
    messageShow (indexes) {
      if (this.selected[0] !== indexes[indexes.length - 1]) {
        this.highlightSelected(indexes)
        this.scrollToSelected(indexes[indexes.length - 1])
      }
    }
  },
  watch: {
    limit (limit) {
      this.currentLimit = limit
    },
    activeMessagesIds (indexes) {
      this.messageShow(indexes)
    }
  },
  created () {
    this.currentLimit = this.limit
    this.highlightSelected(this.activeMessagesIds)
  },
  destroyed () {
    this.$store.commit(`messages/${this.moduleName}/clearSelected`)
    this.dynamicCSS.parentNode.removeChild(this.dynamicCSS)
  },
  components: { VirtualScrollList, MessageViewer }
}
</script>
<style lang="stylus">
.message-viewer
  .list-wrapper
    background-color inherit!important
    .bg-grey-9, .bg-dark
      background-color rgba(0,0,0,0.5)!important
</style>
