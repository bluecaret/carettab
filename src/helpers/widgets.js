export const checkPermission = async (permission, origins = false) => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.permissions) {
      chrome.permissions.contains({ [origins ? 'origins' : 'permissions']: [permission] }, function (result) {
        if (chrome.runtime.lastError) {
          console.error('Error checking "' + permission + '" permission', chrome.runtime.lastError)
          reject()
        } else {
          resolve(result)
        }
      })
    } else {
      resolve()
      console.warn('chrome.permissions unavailable')
    }
  })
}

export const setPermission = async (permission, origins = false) => {
  return new Promise((resolve, reject) => {
    if (chrome && chrome.permissions) {
      chrome.permissions.request({ [origins ? 'origins' : 'permissions']: [permission] }, function (granted) {
        if (chrome.runtime.lastError) {
          console.error('Error setting "' + permission + '" permission', chrome.runtime.lastError)
          reject()
        } else {
          resolve(granted)
        }
      })
    } else {
      resolve()
      console.warn('chrome.permissions unavailable')
    }
  })
}

export const setWidgetContainerStyles = (widget, global) => {
  const box = widget.base.container.override ? widget.base.container : global.container
  const font = widget.base.font.override ? widget.base.font : global.font

  // Font styles
  const fontSize = `font-size: ${font.size}px; `
  const fontFamily = `font-family: "${font.family}"; `
  const fontWeight = `font-weight: ${font.bold}; `
  const color = `color: hsl(${font.color[0]}deg ${font.color[1]}% ${font.color[2]}% / ${font.color[3]}); `
  const textShadow = font.shadow[0]
    ? `text-shadow: ${font.shadow[1]}px ${font.shadow[2]}px ${font.shadow[3]}px hsl(${font.shadow[4]}deg ${font.shadow[5]}% ${font.shadow[6]}% / ${font.shadow[7]}); `
    : 'text-shadow: none;'
  const fontItalic = font.italic ? 'font-style: italic; ' : 'font-style: normal;'
  const fontUnderline = font.underline ? 'text-decoration: underline; ' : 'text-decoration: none;'
  const fontCase = font.transform ? `text-transform: ${font.transform}; ` : 'text-transform: none;'
  const letterSpacing = `letter-spacing: ${font.letterSpacing * 0.01}em; `

  // Container box styles
  const width = `width: ${
    widget.base.widthUnit === 'auto'
      ? 'max-content'
      : widget.base.width + (widget.base.widthUnit === 'pixels' ? 'px' : '%')
  };`
  const height = `height: ${
    widget.base.heightUnit === 'auto'
      ? 'max-content'
      : widget.base.height + (widget.base.heightUnit === 'pixels' ? 'px' : '%')
  };`
  const translate = `translate: ${widget.base.x}px ${-widget.base.y}px;`
  const radius = `border-radius: ${box.radius}px; `
  const borderColor = `hsl(${box.borderColor[0]}deg ${box.borderColor[1]}% ${box.borderColor[2]}% / ${box.borderColor[3]});`
  const border = `border: ${box.borderSize}px solid ${borderColor}; `
  const backgroundColor = `background-color: hsl(${box.background[0]}deg ${box.background[1]}% ${box.background[2]}% / ${box.background[3]}); `
  const padding = `padding: ${box.padding}px; `
  const shadow = box.shadow[0]
    ? `box-shadow: ${box.shadow[1]}px ${box.shadow[2]}px ${box.shadow[3]}px 0px hsl(${box.shadow[4]}deg ${box.shadow[5]}% ${box.shadow[6]}% / ${box.shadow[7]}); `
    : 'box-shadow: none;'

  let styles = `${fontSize}${fontFamily}${fontWeight}${color}${fontUnderline}${letterSpacing}${fontCase}${textShadow}${fontItalic}${width}${height}${translate}${radius}${border}${backgroundColor}${padding}${shadow}`

  return styles
}

export const setWidgetSegmentStyles = (widget, type, lsUsesMargin = false) => {
  const segment = widget[type].override ? widget[type] : widget.base.font

  // Font styles
  const fontSize = `font-size: ${segment.size}px; `
  const letterSpacing = lsUsesMargin
    ? `margin-inline: ${segment.letterSpacing}px; `
    : `letter-spacing: ${segment.letterSpacing}px; `
  const translate = `translate: ${segment.y * -1}px ${segment.x * -1}px; `
  const color = `color: hsl(${segment.color[0]}deg ${segment.color[1]}% ${segment.color[2]}% / ${segment.color[3]}); `
  const textShadow = segment.shadow[0]
    ? `text-shadow: ${segment.shadow[1]}px ${segment.shadow[2]}px ${segment.shadow[3]}px hsl(${segment.shadow[4]}deg ${segment.shadow[5]}% ${segment.shadow[6]}% / ${segment.shadow[7]}); `
    : 'text-shadow: none;'

  let styles = `${fontSize}${letterSpacing}${color}${textShadow}${translate}`

  return styles
}

export const hsl = (hsl) => {
  return `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2]}% / ${hsl[3]})`
}

export const shadow = (shadow) => {
  return shadow[0]
    ? `${shadow[1]}px ${shadow[2]}px ${shadow[3]}px hsl(${shadow[4]}deg ${shadow[5]}% ${shadow[6]}% / ${shadow[7]})`
    : 'none'
}
