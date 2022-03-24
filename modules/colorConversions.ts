class HSV {
  h: number
  s: number
  v: number
  constructor(h: number, s: number, v: number) {
    h <= 0 ? h = 0 : h > 360 ? h = 360 : h
    s <= 0 ? s = 0 : s > 100 ? s = 100 : s
    v <= 0 ? v = 0 : v > 100 ? v = 100 : v

    this.h = h
    this.s = s
    this.v = v
  }
}

class RGB {
  r: number
  g: number
  b: number
  constructor(r: number, g: number, b: number) {
    r < 0 ? r = 0 : r > 255 ? r = 255 : r
    g < 0 ? g = 0 : g > 255 ? g = 255 : g
    b < 0 ? b = 0 : b > 255 ? b = 255 : b

    this.r = r
    this.g = g
    this.b = b
  }
}

class CMYK {
  c: number
  m: number
  y: number
  k: number
  constructor(c: number, m: number, y: number, k: number) {
    c < 0 ? c = 0 : c > 100 ? c = 100 : c
    m < 0 ? m = 0 : m > 100 ? m = 100 : m
    y < 0 ? y = 0 : y > 100 ? y = 100 : y
    k < 0 ? k = 0 : k > 100 ? k = 100 : k

    this.c = c
    this.m = m
    this.y = y
    this.k = k
  }
}

const Convert = {
  _RGBtoHSV : (RGB: { r: number; g: number; b: number }) => {
    let hsv = new HSV(0, 0, 0)

    let r = RGB.r / 255
    let g = RGB.g / 255
    let b = RGB.b / 255

    let min = Math.min(r, g, b)
    let max = Math.max(r, g, b)
    let delta = max - min

    hsv.v = max

    if (delta == 0) {
      hsv.h = 0
      hsv.s = 0
    } else {
      hsv.s = delta / max
      let del_R = (((max - r) / 6) + (delta / 2)) / delta
      let del_G = (((max - g) / 6) + (delta / 2)) / delta
      let del_B = (((max - b) / 6) + (delta / 2)) / delta

      r == max ? hsv.h = del_B - del_G
        : g == max ? hsv.h = (1 / 3) + del_R - del_B
        : b == max ? hsv.h = (2 / 3) + del_G - del_R
        : null

      hsv.h < 0 ? hsv.h += 1
        : hsv.h > 1 ? hsv.h -= 1
        : null
    }

    hsv.h = Math.round(hsv.h * 360)
    hsv.s = Math.round(hsv.s * 100)
    hsv.v = Math.round(hsv.v * 100)

    return hsv
  },

  _HSVtoRGB : function  (HSV: { h: number; s: number; v: number }) {
    let rgb = new RGB(0, 0, 0)

    let h = HSV.h / 360
    let s = HSV.s / 100
    let v = HSV.v / 100

    if (s == 0) {
      rgb.r = v * 255
      rgb.g = v * 255
      rgb.b = v * 255
    } else {
      let var_h = h * 6
      let var_i = Math.floor(var_h)
      let var_1 = v * (1 - s)
      let var_2 = v * (1 - s * (var_h - var_i))
      let var_3 = v * (1 - s * (1 - (var_h - var_i)))
      let var_r, var_g, var_b

      if (var_i == 0) {
        var_r = v
        var_g = var_3
        var_b = var_1
      } else if (var_i == 1) {
        var_r = var_2
        var_g = v
        var_b = var_1
      } else if (var_i == 2) {
        var_r = var_1
        var_g = v
        var_b = var_3
      } else if (var_i == 3) {
        var_r = var_1
        var_g = var_2
        var_b = v
      } else if (var_i == 4) {
        var_r = var_3
        var_g = var_1
        var_b = v
      } else {
        var_r = v
        var_g = var_1
        var_b = var_2
      }

      rgb.r = var_r * 255
      rgb.g = var_g * 255
      rgb.b = var_b * 255

      rgb.r = Math.round(rgb.r)
      rgb.g = Math.round(rgb.g)
      rgb.b = Math.round(rgb.b)
    }

    return rgb
  },

  _RGBtoCMYK : function (RGB: { r: number; g: number; b: number }) {
    let cmyk = new CMYK(0, 0, 0, 0)

    let r = RGB.r / 255
    let g = RGB.g / 255
    let b = RGB.b / 255

    cmyk.k = Math.min( 1 - r, 1 - g, 1 - b )
    cmyk.c = ( 1 - r - cmyk.k ) / ( 1 - cmyk.k )
    cmyk.m = ( 1 - g - cmyk.k ) / ( 1 - cmyk.k )
    cmyk.y = ( 1 - b - cmyk.k ) / ( 1 - cmyk.k )

    cmyk.c = Math.round( cmyk.c * 100 )
    cmyk.m = Math.round( cmyk.m * 100 )
    cmyk.y = Math.round( cmyk.y * 100 )
    cmyk.k = Math.round( cmyk.k * 100 )

    return cmyk
  },

  _CMYKtoRGB : function (CMYK: { c: number; m: number; y: number; k: number }) {
    let rgb = new RGB(0, 0, 0)

    let c = CMYK.c / 100
    let m = CMYK.m / 100
    let y = CMYK.y / 100
    let k = CMYK.k / 100

    rgb.r = 1 - Math.min( 1, c * ( 1 - k ) + k )
    rgb.g = 1 - Math.min( 1, m * ( 1 - k ) + k )
    rgb.b = 1 - Math.min( 1, y * ( 1 - k ) + k )

    rgb.r = Math.round( rgb.r * 255 )
    rgb.g = Math.round( rgb.g * 255 )
    rgb.b = Math.round( rgb.b * 255 )

    return rgb
  },

  _HEXtoRGB : function (HEX: string) {
    let rgb = new RGB(0, 0, 0)

    HEX = HEX.replace("#", "")

    rgb.r = parseInt(HEX.substring(0, 2), 16)
    rgb.g = parseInt(HEX.substring(2, 4), 16)
    rgb.b = parseInt(HEX.substring(4, 6), 16)

    return rgb
  },

  _RGBtoHEX : function (RGB: { r: { toString: (arg0: number) => any }; g: { toString: (arg0: number) => any }; b: { toString: (arg0: number) => any } }) {
    let hex = "#"

    let hr = `000${RGB.r.toString(16)}`.slice(-2)
    let hg = `000${RGB.g.toString(16)}`.slice(-2)
    let hb = `000${RGB.b.toString(16)}`.slice(-2)

    hex += hr + hg + hb

    return hex
  },

  toRGB : function (o: any) {
    if (o instanceof RGB) {return o}
    else if (o instanceof HSV) {return this._HSVtoRGB(o)}
    else if (o instanceof CMYK) {return this._CMYKtoRGB(o)}
    else {return this._HEXtoRGB(o)}
  },

  toHSV : function (o: any) {
    if (o instanceof HSV) {return o}
    else if (o instanceof RGB) {return this._RGBtoHSV(o)}
    else if (o instanceof CMYK) {return this._RGBtoHSV(this._CMYKtoRGB(o))}
    else {return this._RGBtoHSV(this._HEXtoRGB(o))}
  },

  toCMYK : function (o: any) {
    if (o instanceof CMYK) {return o}
    else if (o instanceof RGB) {return this._RGBtoCMYK(o)}
    else if (o instanceof HSV) {return this._RGBtoCMYK(this._HSVtoRGB(o))}
    else {return this._RGBtoCMYK(this._HEXtoRGB(o))}
  },

  toHEX : function (o: any) {
    if (o instanceof RGB) {return this._RGBtoHEX(o)}
    else if (o instanceof HSV) {return this._RGBtoHEX(this._HSVtoRGB(o))}
    else if (o instanceof CMYK) {return this._RGBtoHEX(this._CMYKtoRGB(o))}
    else {return o}
  }
}

export { Convert as convert, RGB, HSV, CMYK }
module.exports = { convert: Convert, RGB, HSV, CMYK }