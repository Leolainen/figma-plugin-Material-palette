import './ui.css'

document.getElementById('create').onclick = () => {
  const color = document.getElementById('color') as HTMLInputElement
  const name = document.getElementById('paletteName') as HTMLInputElement

  parent.postMessage({ 
    pluginMessage: { 
      type: 'create-palette', 
      value: color.value,
      name: name.value,
    } 
  }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
