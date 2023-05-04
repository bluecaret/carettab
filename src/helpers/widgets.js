import { fontList } from '@/assets/lists.js'

export const setWidgetContainerStyles = (widget, global) => {
  const box = widget.w.cor ? widget.w : global
  const font = widget.w.orf ? widget.w : global

  let fontFamilyLabel = 'Source Sans Pro'
  let ff = fontList.find((f) => f.id === font.ff)
  if (font.ff && ff) {
    fontFamilyLabel = `'${ff.label}'`
  }

  // Font styles
  const fontFamily = `font-family: ${fontFamilyLabel}; `
  const fontWeight = `font-weight: ${font.fb}; `
  const color = `color: hsl(${font.cl[0]}deg ${font.cl[1]}% ${font.cl[2]}% / ${font.cl[3]}); `
  const textShadow = font.ts[0]
    ? `text-shadow: ${font.ts[1]}px ${font.ts[2]}px ${font.ts[3]}px hsl(${font.ts[4]}deg ${font.ts[5]}% ${font.ts[6]}% / ${font.ts[7]}); `
    : 'text-shadow: none;'
  const fontItalic = font.fi ? 'font-style: italic; ' : 'font-style: normal;'
  const fontUnderline = font.fu ? 'text-decoration: underline; ' : 'text-decoration: none;'
  const fontCase = font.tt ? `text-transform: ${font.tt}; ` : 'text-transform: none;'
  const letterSpacing = `letter-spacing: ${font.ls * 0.01}em; `

  // Container box styles
  const width = `width: ${widget.w.as ? 'max-content' : widget.w.w + 'px'};`
  const height = `height: ${widget.w.as ? 'max-content' : widget.w.h + 'px'};`
  const translate = `translate: ${widget.w.x}px ${-widget.w.y}px;`
  const radius = `border-radius: ${box.crd}px; `
  const borderColor = `hsl(${box.cbc[0]}deg ${box.cbc[1]}% ${box.cbc[2]}% / ${box.cbc[3]});`
  const border = `border: ${box.cbs}px solid ${borderColor}; `
  const backgroundColor = `background-color: hsl(${box.cbg[0]}deg ${box.cbg[1]}% ${box.cbg[2]}% / ${box.cbg[3]}); `
  const padding = `padding: ${box.cpd}px; `
  const shadow = box.csh[0]
    ? `box-shadow: ${box.csh[1]}px ${box.csh[2]}px ${box.csh[3]}px 0px hsl(${box.csh[4]}deg ${box.csh[5]}% ${box.csh[6]}% / ${box.csh[7]}); `
    : 'box-shadow: none;'

  let styles = `${fontFamily}${fontWeight}${color}${fontUnderline}${letterSpacing}${fontCase}${textShadow}${fontItalic}${width}${height}${translate}${radius}${border}${backgroundColor}${padding}${shadow}`

  return styles
}

export const setWidgetSegmentStyles = (widget, type, lsUsesMargin = false) => {
  const segment = widget[type].or ? widget[type] : widget.w

  // Font styles
  const fontSize = `font-size: ${segment.fs}px; `
  const letterSpacing = lsUsesMargin ? `margin-inline: ${segment.ls}px; ` : `letter-spacing: ${segment.ls}px; `
  const translate = `translate: ${segment.oy * -1}px ${segment.ox * -1}px; `
  const color = `color: hsl(${segment.cl[0]}deg ${segment.cl[1]}% ${segment.cl[2]}% / ${segment.cl[3]}); `
  const textShadow = segment.ts[0]
    ? `text-shadow: ${segment.ts[1]}px ${segment.ts[2]}px ${segment.ts[3]}px hsl(${segment.ts[4]}deg ${segment.ts[5]}% ${segment.ts[6]}% / ${segment.ts[7]}); `
    : 'text-shadow: none;'

  let styles = `${fontSize}${letterSpacing}${color}${textShadow}${translate}`

  return styles
}
