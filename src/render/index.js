const { ipcRenderer } = require('electron');

function setWidth () {
  const width = +this.window.getComputedStyle(this.document.querySelector('#app')).width.replace('px', '');
  ipcRenderer.send('set-width', width || 900);
}

window.onload = function () {
  const $input = this.document.querySelector('#search-input');
  
  setWidth();

  $input.addEventListener('change', (event) => {
    ipcRenderer.send('start-search', event.target.value || 'golang');
  });
}

window.onresize = function () {
  setWidth();
}
