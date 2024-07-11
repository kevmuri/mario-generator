import './App.css';
import {useEffect, useState} from "react";
import replaceColor from "replace-color";
import mergeImages from "merge-images";

import mario_overalls from './mario_overalls.png';
import mario_hairShirtBoots from './mario_hairShirtBoots.png';
import mario_skin from './mario_skin.png';
import JsBarcode from "jsbarcode";

const colors = {
  orange: {hex: '#ffa347', key: '00'},
  red: {hex: '#f83800', key: '01'},
  brown: {hex: '#af7f00', key: '02'},
  blue: {hex: '#0099ff', key: '03'},
  green: {hex: '#00cc66', key: '04'},
  black: {hex: '#000000', key: '05'}
}

function App() {
  const [overallsColor, setOverallsColor] = useState(colors.red);
  const [hairShirtBootsColor, setHairShirtBootsColor] = useState(colors.brown);
  const [skinColor, setSkinColor] = useState(colors.orange);

  const [overallsImage, setOverallsImage] = useState(mario_overalls);
  const [hairShirtBootsImage, setHairShirtBootsImage] = useState(mario_hairShirtBoots);
  const [skinImage, setSkinImage] = useState(mario_skin);

  const [imageData, setImageData] = useState('');

  async function updateColors(target) {

    if (target === 'overalls') {
      const new_color = getNextColor(overallsColor)

      replaceColor({
        image: mario_overalls, colors: {
          type: 'hex', targetColor: colors.red.hex, replaceColor: new_color.hex
        }, deltaE: 20
      }).then((jimp_obj) => {
        jimp_obj.getBase64(jimp_obj.getMIME(), (err, src) => {
          setOverallsImage(src);
        })
      })

      setOverallsColor(new_color);
    } else if (target === 'hairShirtBoots') {
      const new_color = getNextColor(hairShirtBootsColor)

      replaceColor({
        image: mario_hairShirtBoots, colors: {
          type: 'hex', targetColor: colors.brown.hex, replaceColor: new_color.hex
        }, deltaE: 20
      }).then((jimp_obj) => {
        jimp_obj.getBase64(jimp_obj.getMIME(), (err, src) => {
          setHairShirtBootsImage(src);
        })
      })

      setHairShirtBootsColor(new_color);
    } else if (target === 'skin') {
      const new_color = getNextColor(skinColor)

      replaceColor({
        image: mario_skin, colors: {
          type: 'hex', targetColor: colors.orange.hex, replaceColor: new_color.hex
        }, deltaE: 20
      }).then((jimp_obj) => {
        jimp_obj.getBase64(jimp_obj.getMIME(), (err, src) => {
          setSkinImage(src);
        })
      })

      setSkinColor(new_color);
    }
  }


  function updateBarcode() {
    const barcodeString = `${overallsColor.key}${hairShirtBootsColor.key}${skinColor.key}`
    JsBarcode("#barcode", barcodeString)

    console.log(barcodeString)
  }

  function getNextColor(currentColor) {
    let currentKey = Number(currentColor.key);
    let nextKey = (currentKey + 1) % Object.keys(colors).length;
    nextKey = String(nextKey).padStart(2, '0');

    return Object.values(colors).find(color => color.key === nextKey);
  }

  useEffect(() => {
    mergeImages([overallsImage, hairShirtBootsImage, skinImage])
  }, [])

  useEffect(() => {
    mergeImages([overallsImage, hairShirtBootsImage, skinImage]).then(setImageData)
    updateBarcode()
  }, [overallsImage, hairShirtBootsImage, skinImage])

  return (<div className="App">
    <img src={imageData}/>
    <div/>
    <button onClick={() => updateColors('overalls')}>Next Color: Overalls</button>
    <button onClick={() => updateColors('hairShirtBoots')}>Next Color: Hair, Shirt, Boots</button>
    <button onClick={() => updateColors('skin')}>Next Color: Skin</button>
    <div/>
    <svg id="barcode"></svg>
  </div>);
}

export default App;
