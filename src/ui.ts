import './ui.css'

document.getElementById('create').onclick = () => {
  const textbox = document.getElementById('color') as HTMLInputElement
  console.log("textbox value", textbox.value);

  // const count = parseInt(textbox.value, 10)

  parent.postMessage({ 
    pluginMessage: { 
      type: 'create-palette', 
      value: textbox.value,
    } 
  }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
