import './ui.css'

const colorToggle = document.getElementById('color-toggle') as HTMLInputElement;
let colorInput = document.getElementById('color') as HTMLInputElement

colorToggle.addEventListener('change', function (event: any) {
  if (this.checked) {
    colorInput.type = 'color';
  } else {
    colorInput.type = 'text';
  }
})

document.getElementById('create').onclick = () => {
  const name = document.getElementById('paletteName') as HTMLInputElement
  const schema = document.getElementById('schema') as HTMLInputElement

  parent.postMessage({
    pluginMessage: {
      type: 'create-palette',
      schema: schema.value,
      value: colorInput.value,
      name: name.value,
    }
  }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
