class ScrollPosition {
  constructor (node) {
    this.node = node
    this.previousScrollHeightMinusTop = 0
    this.readyFor = 'up'
  }

  prepareFor (direction) {
    this.readyFor = direction || 'up'
    this.previousScrollHeightMinusTop = this.node.scrollHeight - this.node.scrollTop
  }

  restore () {
    if (this.readyFor === 'up') {
      this.node.scrollTop = this.node.scrollHeight - this.previousScrollHeightMinusTop
      // console.log('scrollTop', this.node.scrollTop, 'scrollHeight', this.node.scrollHeight, 'previousScrollHeightMinusTop', this.previousScrollHeightMinusTop)
    }

    // 'down' doesn't need to be special cased unless the
    // content was flowing upwards, which would only happen
    // if the container is position: absolute, bottom: 0 for
    // a Facebook messages effect
  }
}

export { ScrollPosition as default }
