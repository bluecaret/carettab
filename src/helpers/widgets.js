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

export const getDynamicSize = (val, dynamic, height = false) => {
  if (dynamic) {
    if (height) return `${val / 19}dvh`
    return `${val / 19}dvw`
  }
  return `${val}px`
}

export const setWidgetContainerStyles = (widget, global) => {
  const box = widget.base.container.override ? widget.base.container : global.container
  const font = widget.base.font.override ? widget.base.font : global.font

  // Font styles
  const fontSize = `font-size: ${getDynamicSize(widget.base.font.size, box.dynamicScaling)}; `
  const fontFamily = `font-family: "${font.family}"; `
  const fontWeight = `font-weight: ${font.bold}; `
  const color = `color: hsl(${font.color[0]}deg ${font.color[1]}% ${font.color[2]}% / ${font.color[3]}); `
  const textShadow = font.shadow[0]
    ? `text-shadow: ${getDynamicSize(font.shadow[1], box.dynamicScaling)} ${getDynamicSize(
        font.shadow[2],
        box.dynamicScaling
      )} ${getDynamicSize(font.shadow[3], box.dynamicScaling)} hsl(${font.shadow[4]}deg ${font.shadow[5]}% ${
        font.shadow[6]
      }% / ${font.shadow[7]}); `
    : 'text-shadow: none;'
  const fontItalic = font.italic ? 'font-style: italic; ' : 'font-style: normal;'
  const fontUnderline = font.underline ? 'text-decoration: underline; ' : 'text-decoration: none;'
  const fontCase = font.transform ? `text-transform: ${font.transform}; ` : 'text-transform: none;'
  const letterSpacing = `letter-spacing: ${font.letterSpacing * 0.01}em; `

  // Container box styles
  const width = `width: ${
    widget.base.widthUnit === 'auto'
      ? 'max-content'
      : widget.base.widthUnit === 'pixels'
      ? getDynamicSize(widget.base.width, box.dynamicScaling)
      : widget.base.width + '%'
  };`
  const height = `height: ${
    widget.base.heightUnit === 'auto'
      ? 'max-content'
      : widget.base.heightUnit === 'pixels'
      ? getDynamicSize(widget.base.height, box.dynamicScaling)
      : widget.base.height + '%'
  };`
  const translate = `
    translate: ${
      widget.base.xUnit === 'pixels' ? getDynamicSize(widget.base.x, box.dynamicScaling) : widget.base.x + 'dvw'
    } ${widget.base.yUnit === 'pixels' ? getDynamicSize(-widget.base.y, box.dynamicScaling) : -widget.base.y + 'dvh'};
  `
  const radius = `border-radius: ${getDynamicSize(box.radius, box.dynamicScaling)}; `
  const borderColor = `hsl(${box.borderColor[0]}deg ${box.borderColor[1]}% ${box.borderColor[2]}% / ${box.borderColor[3]});`
  const border = `border: ${getDynamicSize(box.borderSize, box.dynamicScaling)} solid ${borderColor}; `
  const backgroundColor = `background-color: hsl(${box.background[0]}deg ${box.background[1]}% ${box.background[2]}% / ${box.background[3]}); `
  const padding = `padding: ${getDynamicSize(box.padding, box.dynamicScaling)}; `
  const shadow = box.shadow[0]
    ? `box-shadow: ${getDynamicSize(box.shadow[1], box.dynamicScaling)} ${getDynamicSize(
        box.shadow[2],
        box.dynamicScaling
      )} ${getDynamicSize(box.shadow[3], box.dynamicScaling)} 0px hsl(${box.shadow[4]}deg ${box.shadow[5]}% ${
        box.shadow[6]
      }% / ${box.shadow[7]}); `
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

  const isDynamicScaling = widget.base.container.override
    ? widget.base.container.dynamicScaling
    : global.container.dynamicScaling

  // Font styles
  const fontSize = `font-size: ${getDynamicSize(segment.size, isDynamicScaling)}; `
  const letterSpacing = lsUsesMargin
    ? `margin-inline: ${getDynamicSize(segmentWGlobal.letterSpacing, isDynamicScaling)}; `
    : `letter-spacing: ${getDynamicSize(segmentWGlobal.letterSpacing, isDynamicScaling)}; `
  const translate = `translate: ${getDynamicSize(segment.x, isDynamicScaling)} ${getDynamicSize(
    segment.y * -1,
    isDynamicScaling
  )}; `
  const color = `color: hsl(${segmentWGlobal.color[0]}deg ${segmentWGlobal.color[1]}% ${segmentWGlobal.color[2]}% / ${segmentWGlobal.color[3]}); `
  const textShadow = segmentWGlobal.shadow[0]
    ? `text-shadow: 
      ${getDynamicSize(segmentWGlobal.shadow[1], isDynamicScaling)} ${getDynamicSize(
        segmentWGlobal.shadow[2],
        isDynamicScaling
      )} ${getDynamicSize(segmentWGlobal.shadow[3], isDynamicScaling)} hsl(${segmentWGlobal.shadow[4]}deg ${
        segmentWGlobal.shadow[5]
      }% ${segmentWGlobal.shadow[6]}% / ${segmentWGlobal.shadow[7]}); `
    : 'text-shadow: none;'

  let styles = `${fontSize}${letterSpacing}${color}${textShadow}${translate}`

  return styles
}

export const hsl = (hsl) => {
  return `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2]}% / ${hsl[3]})`
}

export const shadow = (shadow, dynamic = false) => {
  return shadow[0]
    ? `${getDynamicSize(shadow[1], dynamic)} ${getDynamicSize(shadow[2], dynamic)} ${getDynamicSize(
        shadow[3],
        dynamic
      )} hsl(${shadow[4]}deg ${shadow[5]}% ${shadow[6]}% / ${shadow[7]})`
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
