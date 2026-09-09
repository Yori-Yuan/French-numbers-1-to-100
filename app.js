const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
const ipaUnits = ['', 'œ̃', 'dø', 'tʁwa', 'katʁ', 'sɛ̃k', 'sis', 'sɛt', 'ɥit', 'nœf', 'dis', 'ɔ̃z', 'duz', 'tʁɛz', 'katɔʁz', 'kɛ̃z', 'sɛz'];
const tens = {
  20: ['vingt', 'vɛ̃'],
  30: ['trente', 'tʁɑ̃t'],
  40: ['quarante', 'kaʁɑ̃t'],
  50: ['cinquante', 'sɛ̃kɑ̃t'],
  60: ['soixante', 'swasɑ̃t'],
};

function frenchNumber(number) {
  if (number <= 16) return units[number];
  if (number < 20) return `dix-${units[number - 10]}`;
  if (number < 70) {
    const base = Math.floor(number / 10) * 10;
    const rest = number % 10;
    if (rest === 0) return tens[base][0];
    if (rest === 1) return `${tens[base][0]} et un`;
    return `${tens[base][0]}-${units[rest]}`;
  }
  if (number < 80) return number === 71 ? 'soixante et onze' : `soixante-${frenchNumber(number - 60)}`;
  if (number === 80) return 'quatre-vingts';
  if (number < 100) return `quatre-vingt-${frenchNumber(number - 80)}`;
  return 'cent';
}

function numberIpa(number) {
  if (number <= 16) return ipaUnits[number];
  if (number === 17) return 'dis sɛt';
  if (number === 18) return 'diz ɥit';
  if (number === 19) return 'diz nœf';
  if (number < 70) {
    const base = Math.floor(number / 10) * 10;
    const rest = number % 10;
    if (!rest) return tens[base][1];
    if (rest === 1) return `${tens[base][1]} e œ̃`;
    return `${tens[base][1]}${rest === 8 && base === 20 ? 't ' : ' '}${ipaUnits[rest]}`;
  }
  if (number === 70) return 'swasɑ̃t dis';
  if (number === 71) return 'swasɑ̃t e ɔ̃z';
  if (number < 77) return `swasɑ̃t ${ipaUnits[number - 60]}`;
  if (number === 77) return 'swasɑ̃t dis sɛt';
  if (number === 78) return 'swasɑ̃t diz ɥit';
  if (number === 79) return 'swasɑ̃t diz nœf';
  if (number === 80) return 'katʁə vɛ̃';
  if (number < 90) return `katʁə vɛ̃ ${ipaUnits[number - 80]}`;
  if (number === 90) return 'katʁə vɛ̃ dis';
  if (number === 97) return 'katʁə vɛ̃ dis sɛt';
  if (number === 98) return 'katʁə vɛ̃ diz ɥit';
  if (number === 99) return 'katʁə vɛ̃ diz nœf';
  if (number < 100) return `katʁə vɛ̃ ${ipaUnits[number - 80]}`;
  return 'sɑ̃';
}

const numbers = Array.from({ length: 100 }, (_, index) => ({
  value: index + 1,
  french: frenchNumber(index + 1),
  ipa: numberIpa(index + 1),
}));

function speak(text) {
  if (!('speechSynthesis' in window)) {
    window.alert('当前浏览器不支持语音播放，请使用最新版 Chrome、Safari 或 Edge。');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.82;
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith('fr'));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

const grid = document.querySelector('#number-grid');
const search = document.querySelector('#search');
const emptyMessage = document.querySelector('#empty-message');

function render(items) {
  grid.replaceChildren();
  for (const item of items) {
    const card = document.createElement('button');
    card.className = 'number-card';
    card.type = 'button';
    card.setAttribute('aria-label', `播放 ${item.value}，${item.french} 的法语读音`);
    card.innerHTML = `<span class="numeral">${item.value}</span><span class="word">${item.french}</span><span class="ipa">/${item.ipa}/</span><span class="play" aria-hidden="true">▶</span>`;
    card.addEventListener('click', () => speak(item.french));
    grid.append(card);
  }
  emptyMessage.hidden = items.length !== 0;
}

search.addEventListener('input', () => {
  const query = search.value.trim().toLowerCase();
  render(query ? numbers.filter((item) => String(item.value).includes(query) || item.french.includes(query)) : numbers);
});

document.querySelector('#listen-sample').addEventListener('click', () => speak('un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix'));
render(numbers);

