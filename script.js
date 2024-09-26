const PICKER_SIZE = 320;
const inputHex = document.getElementById("hex");
const inputRgb = document.getElementById("rgb");
const inputHsl = document.getElementById("hsl");
const inputHsv = document.getElementById("hsv");
const inputCmyk = document.getElementById("cmyk");
const rangeColor = document.getElementById("color-selector");
const colorPicker = document.getElementById("color-picker");
const colorPickerBg = document.getElementById("bg-current");
const pickerIndicator = document.getElementById("color-picker-indicator");
const copyAlert = document.getElementById("copy-alert");

const color = new Color(180, 50, 50);
updateValues();

function updateValues() {
  colorPickerBg.style.backgroundColor = color.baseColor;
  pickerIndicator.style.left = color.saturation + "%";
  pickerIndicator.style.bottom = color.value + "%";
  pickerIndicator.style.backgroundColor = color.rgb;
  rangeColor.value = color.hue;

  inputHex.value = color.hex;
  inputRgb.value = color.rgb;
  inputHsl.value = color.hsl;
  inputHsv.value = color.hsv;
  inputCmyk.value = color.cmyk;
}

function onPickerChange(event) {
  const x = Math.round(100 * (event.offsetX / PICKER_SIZE));
  const y = Math.round((100 * (PICKER_SIZE - event.offsetY)) / PICKER_SIZE);

  color.saturation = x;
  color.value = y;
  updateValues();
}

function copyToClipboard(input) {
  navigator.clipboard.writeText(input.value);
  showCopyAlert();
}

function changeColorRange(value) {
  color.hue = value;
  updateValues();
}

function showCopyAlert() {
  void copyAlert.offsetWidth;
  copyAlert.classList.remove("hidden");
  copyAlert.classList.remove("animate-fadeOut");

  copyAlert.classList.add("animate-fall");
  setTimeout(() => {
    copyAlert.classList.add("animate-fadeOut");
    copyAlert.classList.remove("animate-fall");
  }, 1500);
}
