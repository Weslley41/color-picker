class Color {
  constructor(hue, saturation, value) {
    this.hue = hue;
    this.saturation = saturation;
    this.value = value;
  }

  updateFromHex(value) {
    this._rgb2instance(...this._hex2rgb(value.replace("#", "")));
  }

  updateFromRgb(value) {
    value = value
      .replaceAll(" ", "")
      .replace("rgb(", "")
      .replace(")", "")
      .split(",");
    this._rgb2instance(...value);
  }

  updateFromHsl(value) {
    value = value
      .replaceAll(" ", "")
      .replace("hsl(", "")
      .replace(")", "")
      .replace("°", "")
      .replace("deg", "")
      .replaceAll("%", "")
      .split(",");

    this._rgb2instance(...this._hsl2rgb(...value));
  }

  updateFromHsv(value) {
    [this.hue, this.saturation, this.value] = value
      .replaceAll(" ", "")
      .replace("hsv(", "")
      .replace(")", "")
      .replace("°", "")
      .replace("deg", "")
      .replaceAll("%", "")
      .split(",");
  }

  updateFromCmyk(value) {
    value = value
      .replaceAll(" ", "")
      .replace("cmyk(", "")
      .replace(")", "")
      .replaceAll("%", "")
      .split(",");

    this._rgb2instance(...this._cmyk2rgb(...value));
  }

  get baseColor() {
    const [r, g, b] = this._instance2rgb(true);
    return `rgb(${r}, ${g}, ${b})`;
  }

  get hex() {
    const rgb = this._instance2rgb();
    let hexa = "#";
    for (const value of rgb) {
      hexa += value.toString(16).padStart(2, "0");
    }
    return hexa;
  }

  get rgb() {
    const [r, g, b] = this._instance2rgb();
    return `rgb(${r}, ${g}, ${b})`;
  }

  get hsl() {
    const rgb = this._instance2rgb();
    const [r, g, b] = rgb.map((v) => v / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    const l = (max + min) / 2;
    let s = 0;
    if (max !== 0) {
      s = Math.round(100 * (delta / (1 - Math.abs(2 * l - 1))));
    }

    return `hsl(${this.hue}°, ${s}%, ${Math.round(l * 100)}%)`;
  }

  get hsv() {
    return `hsv(${this.hue}°, ${this.saturation}%, ${this.value}%)`;
  }

  get cmyk() {
    const rgb = this._instance2rgb();
    const [r, g, b] = rgb.map((v) => v / 255);
    const k = 1 - Math.max(r, g, b);
    const c = Math.round(100 * ((1 - r - k) / (1 - k)));
    const m = Math.round(100 * ((1 - g - k) / (1 - k)));
    const y = Math.round(100 * ((1 - b - k) / (1 - k)));

    return `cmyk(${c}%, ${m}%, ${y}%, ${Math.round(100 * k)}%)`;
  }

  _rgb2instance(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta > 0) {
      switch (max) {
        case r:
          h = 60 * (((g - b) / delta) % 6);
          break;
        case g:
          h = 60 * ((b - r) / delta + 2);
          break;
        case b:
          h = 60 * ((r - g) / delta + 4);
          break;
      }
    }

    let s = 0;
    if (max !== 0) {
      s = Math.round(100 * (delta / max));
    }

    this.hue = Math.round(h);
    this.saturation = s;
    this.value = Math.round(max * 100);
  }

  _instance2rgb(baseColor = false) {
    let value = baseColor ? 1 : this.value / 100;
    let saturation = baseColor ? 1 : this.saturation / 100;

    const c = value * saturation;
    const x = c * (1 - Math.abs(((this.hue / 60) % 2) - 1));
    const m = value - c;

    const tempRGB = this._auxRgbFromHue(this.hue, x, c);
    return tempRGB.map((v) => Math.round((v + m) * 255));
  }

  _hex2rgb(hex) {
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ];
  }

  _hsl2rgb(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    const tempRGB = this._auxRgbFromHue(h, x, c);
    return tempRGB.map((v) => Math.round((v + m) * 255));
  }

  _cmyk2rgb(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return [r, g, b];
  }

  _auxRgbFromHue(hue, x, c) {
    if (hue < 60) {
      return [c, x, 0];
    } else if (hue < 120) {
      return [x, c, 0];
    } else if (hue < 180) {
      return [0, c, x];
    } else if (hue < 240) {
      return [0, x, c];
    } else if (hue < 300) {
      return [x, 0, c];
    } else {
      return [c, 0, x];
    }
  }
}
