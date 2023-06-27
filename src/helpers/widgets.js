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

export const setWidgetContainerStyles = (widget, global, paid) => {
  const box = widget.base.container.override ? widget.base.container : global.container
  const font = widget.base.font.override ? widget.base.font : global.font

  // Font styles
  const fontSize = `font-size: ${widget.base.font.size}px; `
  const fontFamily = `font-family: "${paid ? font.family : global.font.family}"; `
  const fontWeight = `font-weight: ${paid ? font.bold : global.font.bold}; `
  const color = `color: hsl(${font.color[0]}deg ${font.color[1]}% ${font.color[2]}% / ${font.color[3]}); `
  const textShadow = font.shadow[0]
    ? `text-shadow: ${font.shadow[1]}px ${font.shadow[2]}px ${font.shadow[3]}px hsl(${font.shadow[4]}deg ${font.shadow[5]}% ${font.shadow[6]}% / ${font.shadow[7]}); `
    : 'text-shadow: none;'
  const fontItalic = paid
    ? font.italic
      ? 'font-style: italic; '
      : 'font-style: normal;'
    : global.font.italic
    ? 'font-style: italic; '
    : 'font-style: normal;'
  const fontUnderline = paid
    ? font.underline
      ? 'text-decoration: underline; '
      : 'text-decoration: none;'
    : global.font.underline
    ? 'text-decoration: underline; '
    : 'text-decoration: none;'
  const fontCase = paid
    ? font.transform
      ? `text-transform: ${font.transform}; `
      : 'text-transform: none;'
    : global.font.transform
    ? `text-transform: ${global.font.transform}; `
    : 'text-transform: none;'
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
  const radius = `border-radius: ${paid ? box.radius : 0}px; `
  const borderColor = `hsl(${box.borderColor[0]}deg ${box.borderColor[1]}% ${box.borderColor[2]}% / ${box.borderColor[3]});`
  const border = `border: ${paid ? box.borderSize : 0}px solid ${borderColor}; `
  const backgroundColor = paid
    ? `background-color: hsl(${box.background[0]}deg ${box.background[1]}% ${box.background[2]}% / ${box.background[3]}); `
    : `background-color: transparent;`
  const padding = `padding: ${paid ? box.padding : 0}px; `
  const shadow = paid
    ? box.shadow[0]
      ? `box-shadow: ${box.shadow[1]}px ${box.shadow[2]}px ${box.shadow[3]}px 0px hsl(${box.shadow[4]}deg ${box.shadow[5]}% ${box.shadow[6]}% / ${box.shadow[7]}); `
      : 'box-shadow: none;'
    : 'box-shadow: none;'

  let styles = `${fontSize}${fontFamily}${fontWeight}${color}${fontUnderline}${letterSpacing}${fontCase}${textShadow}${fontItalic}${width}${height}${translate}${radius}${border}${backgroundColor}${padding}${shadow}`

  return styles
}

export const setWidgetSegmentStyles = (widget, type, global, lsUsesMargin = false) => {
  const segmentWGlobal = widget[type].override
    ? widget[type]
    : widget.base.font.override
    ? widget.base.font
    : global.font
  const segment = widget[type].override ? widget[type] : widget.base.font

  // Font styles
  const fontSize = `font-size: ${segment.size}px; `
  const letterSpacing = lsUsesMargin
    ? `margin-inline: ${segmentWGlobal.letterSpacing}px; `
    : `letter-spacing: ${segmentWGlobal.letterSpacing}px; `
  const translate = `translate: ${segment.x * -1}px ${segment.y * -1}px; `
  const color = `color: hsl(${segmentWGlobal.color[0]}deg ${segmentWGlobal.color[1]}% ${segmentWGlobal.color[2]}% / ${segmentWGlobal.color[3]}); `
  const textShadow = segmentWGlobal.shadow[0]
    ? `text-shadow: ${segmentWGlobal.shadow[1]}px ${segmentWGlobal.shadow[2]}px ${segmentWGlobal.shadow[3]}px hsl(${segmentWGlobal.shadow[4]}deg ${segmentWGlobal.shadow[5]}% ${segmentWGlobal.shadow[6]}% / ${segmentWGlobal.shadow[7]}); `
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

export const hexToHSLArray = (hex) => {
  // Remove the '#' character from the beginning of the hex code
  const hexWithoutHash = hex.replace('#', '')

  // Convert the hex code to RGB values
  const r = parseInt(hexWithoutHash.substring(0, 2), 16)
  const g = parseInt(hexWithoutHash.substring(2, 4), 16)
  const b = parseInt(hexWithoutHash.substring(4, 6), 16)

  // Convert RGB to HSL
  const rNormalized = r / 255
  const gNormalized = g / 255
  const bNormalized = b / 255

  const max = Math.max(rNormalized, gNormalized, bNormalized)
  const min = Math.min(rNormalized, gNormalized, bNormalized)
  let h, s, l

  l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNormalized:
        h = (gNormalized - bNormalized) / d + (gNormalized < bNormalized ? 6 : 0)
        break
      case gNormalized:
        h = (bNormalized - rNormalized) / d + 2
        break
      case bNormalized:
        h = (rNormalized - gNormalized) / d + 4
        break
    }
    h /= 6
  }

  // Round HSL values to two decimal places
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return [h, s, l, 1]
}
