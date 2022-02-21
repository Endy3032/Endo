const { ActivityType } = require("discord.js")

class HSV {
  constructor(h, s, v) {
    h <= 0 ? h = 0 : h > 360 ? h = 360 : h
    s <= 0 ? s = 0 : s > 100 ? s = 100 : s
    v <= 0 ? v = 0 : v > 100 ? v = 100 : v

    this.h = h
    this.s = s
    this.v = v
  }
}

class RGB {
  constructor(r, g, b) {
    r < 0 ? r = 0 : r > 255 ? r = 255 : r
    g < 0 ? g = 0 : g > 255 ? g = 255 : g
    b < 0 ? b = 0 : b > 255 ? b = 255 : b

    this.r = r
    this.g = g
    this.b = b
  }
}

class CMYK {
  constructor(c, m, y, k) {
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

  _RGBtoHSV : (RGB) => {
    hsv = new HSV(0, 0, 0)

    r = RGB.r / 255
    g = RGB.g / 255
    b = RGB.b / 255

    min = Math.min(r, g, b)
    max = Math.max(r, g, b)
    delta = max - min

    hsv.v = max

    if (delta == 0) {
      hsv.h = 0
      hsv.s = 0
    } else {
      hsv.s = delta / max
      del_R = (((max - r) / 6) + (delta / 2)) / delta
      del_G = (((max - g) / 6) + (delta / 2)) / delta
      del_B = (((max - b) / 6) + (delta / 2)) / delta

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

  _HSVtoRGB : function  (HSV) {
    rgb = new RGB(0, 0, 0)

    h = HSV.h / 360
    s = HSV.s / 100
    v = HSV.v / 100

    if (s == 0) {
      rgb.r = v * 255
      rgb.g = v * 255
      rgb.v = v * 255
    } else {
      var_h = h * 6
      var_i = Math.floor(var_h)
      var_1 = v * (1 - s)
      var_2 = v * (1 - s * (var_h - var_i))
      var_3 = v * (1 - s * (1 - (var_h - var_i)))

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

  _RGBtoCMYK : function (RGB) {
    cmyk = new CMYK(0, 0, 0, 0)

    r = RGB.r / 255
    g = RGB.g / 255
    b = RGB.b / 255

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

  _CMYKtoRGB : function (CMYK) {
    rgb = new RGB(0, 0, 0)

    c = CMYK.c / 100
    m = CMYK.m / 100
    y = CMYK.y / 100
    k = CMYK.k / 100

    rgb.r = 1 - Math.min( 1, c * ( 1 - k ) + k )
    rgb.g = 1 - Math.min( 1, m * ( 1 - k ) + k )
    rgb.b = 1 - Math.min( 1, y * ( 1 - k ) + k )

    rgb.r = Math.round( rgb.r * 255 )
    rgb.g = Math.round( rgb.g * 255 )
    rgb.b = Math.round( rgb.b * 255 )

    return rgb
  },

  _HEXtoRGB : function (HEX) {
    rgb = new RGB(0, 0, 0)

    HEX = HEX.replace("#", "")

    rgb.r = parseInt(HEX.substring(0, 2), 16)
    rgb.g = parseInt(HEX.substring(2, 4), 16)
    rgb.b = parseInt(HEX.substring(4, 6), 16)

    return rgb
  },

  _RGBtoHEX : function (RGB) {
    hex = "#"

    hr = `000${RGB.r.toString(16)}`.substr(-2)
    hg = `000${RGB.g.toString(16)}`.substr(-2)
    hb = `000${RGB.b.toString(16)}`.substr(-2)

    hex += hr + hg + hb

    return hex
  },

  toRGB : function (o) {
    if (o instanceof RGB) {return o}
    else if (o instanceof HSV) {return this._HSVtoRGB(o)}
    else if (o instanceof CMYK) {return this._CMYKtoRGB(o)}
    else {return this._HEXtoRGB(o)}
  },

  toHSV : function (o) {
    if (o instanceof HSV) {return o}
    else if (o instanceof RGB) {return this._RGBtoHSV(o)}
    else if (o instanceof CMYK) {return this._RGBtoHSV(this._CMYKtoRGB(o))}
    else {return this._HEXtoHSV(this._HEXtoRGB(o))}
  },

  toCMYK : function (o) {
    if (o instanceof CMYK) {return o}
    else if (o instanceof RGB) {return this._RGBtoCMYK(o)}
    else if (o instanceof HSV) {return this._RGBtoCMYK(this._HSVtoRGB(o))}
    else {return this._RGBtoCMYK(this._HEXtoRGB(o))}
  },

  toHEX : function (o) {
    if (o instanceof RGB) {return this._RGBtoHEX(o)}
    else if (o instanceof HSV) {return this._RGBtoHEX(this._HSVtoRGB(o))}
    else if (o instanceof CMYK) {return this._RGBtoHEX(this._CMYKtoRGB(o))}
    else {return o}
  }
}

async function rep(interaction, object) {
  interaction.replied || interaction.deferred
    ? await interaction.followUp(object)
    : await interaction.reply(object)
}

module.exports = {
  colors: [
    "5865F2", "57F287", "FEE75C", "EB459E", "ED4245",
    "F47B67", "F8A532", "48B784", "45DDCO", "99AAB5",
    "23272A", "B7C2CE", "4187ED", "36393F", "3E70DD",
    "4P5D7F", "7289DA", "4E5D94", "9C84EF", "F47FFF",
    "FFFFFF", "9684ec", "583694", "37393e", "5866ef",
    "3da560", "f9a62b", "f37668", "49ddc1", "4f5d7e",
    "09bOf2", "2f3136", "ec4145", "fe73f6", "000000"
  ],
  emojis: {
    checkmark: { shorthand: "<:checkmark:924151198339174430>", id: "944867707202301952" },
    crossmark: { shorthand: "<:crossmark:944867707201937409>", id: "944867707201937409" },
    trash: { shorthand: "<:trash:927050313943380089>", id: "927050313943380089" },
    WeatherAPI: { shorthand: "<:WeatherAPI:932557801153241088>", id: "932557801153241088" },
  },
  a: "🇦", b: "🇧", c: "🇨", d: "🇩",
  e: "🇪", f: "🇫", g: "🇬", h: "🇭",
  i: "🇮", j: "🇯", k: "🇰", l: "🇱",
  m: "🇲", n: "🇳", o: "🇴", p: "🇵",
  q: "🇶", r: "🇷", s: "🇸", t: "🇹",
  u: "🇺", v: "🇻", w: "🇼", x: "🇽",
  y: "🇾", z: "🇿", 0: "0️⃣", 1: "1️⃣",
  2: "2️⃣", 3: "3️⃣", 4: "4️⃣", 5: "5️⃣",
  6: "6️⃣", 7: "7️⃣", 8: "8️⃣", 9: "9️⃣",
  10: "🔟", "#": "#️⃣", "*": "*️⃣",
  "!": "❗", "?": "❓",
  activities: [
    {
      activities: [{ name: "discord.js", type: ActivityType.Playing }],
      status: "idle"
    },
    {
      activities: [{ name: "replit", type: ActivityType.Playing }],
      status: "idle"
    },
    {
      activities: [{ name: "Code", type: ActivityType.Playing }],
      status: "idle"
    },
    {
      activities: [{ name: "lofi", type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
      status: "idle"
    },
    {
      activities: [{ name: "lofi", type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=9FIkzOrryf8" }],
      status: "idle"
    },
    {
      activities: [{ name: "lofi", type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=5qap5aO4i9A" }],
      status: "idle"
    },
    {
      activities: [{ name: "lofi", type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=DWcJFNfaw9c" }],
      status: "idle"
    },
    {
      activities: [{ name: "lofi", type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=TsTtqGAxvWk" }],
      status: "idle"
    },
    {
      activities: [{ name: "lofi", type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=CIfGUiICf8U" }],
      status: "idle"
    },
    {
      activities: [{ name: "llusion - jealous", type: ActivityType.Listening }],
      status: "idle"
    },
    {
      activities: [{ name: "/help", type: ActivityType.Listening }],
      status: "idle"
    },
    {
      activities: [{ name: "🌧agoraphobic🌧", type: ActivityType.Listening }],
      status: "idle"
    },
    {
      activities: [{ name: "Stranger Things", type: ActivityType.Watching }],
      status: "idle"
    },
    {
      activities: [{ name: "Thinger Strangs", type: ActivityType.Watching }],
      status: "idle"
    },
  ],
  HSV: HSV,
  RGB: RGB,
  CMYK: CMYK,
  Convert: Convert,
  rep: rep
}