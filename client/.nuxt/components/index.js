export { default as Gig } from '../../components/Gig.vue'
export { default as Gigs } from '../../components/Gigs.vue'
export { default as Navbar } from '../../components/Navbar.vue'
export { default as PostGigButton } from '../../components/PostGigButton.vue'
export { default as ModalsPostGig } from '../../components/modals/PostGig.vue'
export { default as ModalsSubmitWork } from '../../components/modals/SubmitWork.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
