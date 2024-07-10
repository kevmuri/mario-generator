import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import replaceColor from "replace-color";
import mergeImages from "merge-images";

import mario_overalls from './mario_overalls.png';
import mario_hairShirtBoots from './mario_hairShirtBoots.png';
import mario_skin from './mario_skin.png';
import JsBarcode from "jsbarcode";

const colors = [
  '#ffa347',
  '#f83800',
  '#af7f00',
  '#0099ff',
  '#00cc66',
  '#ffffff',
  '#000000'
]

function App() {
  const [overallsColor, setOverallsColor] = useState(colors[1]);
  const [hairShirtBootsColor, setHairShirtBootsColor] = useState(colors[2]);
  const [skinColor, setSkinColor] = useState(colors[0]);

  const [overallsImage, setOverallsImage] = useState(mario_overalls);
  const [hairShirtBootsImage, setHairShirtBootsImage] = useState(mario_hairShirtBoots);
  const [skinImage, setSkinImage] = useState(mario_skin);


  const [imageData, setImageData] = useState('');
  const [barcodeData, setBarcodeData] = useState('0');

  async function updateColors() {
    setOverallsColor(colors[Math.floor(Math.random() * colors.length)])

    replaceColor({
      image: mario_overalls,
      colors: {
        type: 'hex',
        targetColor: colors[1],
        replaceColor: overallsColor
      },
      deltaE: 0
    }).then((jimp_obj) => {
      jimp_obj.getBase64(jimp_obj.getMIME(), (err, src) => {
            setOverallsImage(src);
          }
      )
    });

    mergeImages([overallsImage, hairShirtBootsImage, skinImage]).then(setImageData);

  }

  function updateBarcode() {
    const barcodeString = `${colors.indexOf(overallsColor)}${colors.indexOf(hairShirtBootsColor)}${colors.indexOf(skinColor)}`
    JsBarcode("#barcode", barcodeString)
  }

  useEffect(() => {
    mergeImages([overallsImage, hairShirtBootsImage, skinImage]).then(setImageData);
    updateBarcode();
  }, [])

  useEffect(() => {
    updateBarcode();
  }, [overallsColor, hairShirtBootsColor, skinColor])

  async function getBase64(image) {
    const response = await fetch(image);
    const imageBlob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
  }

  return (
      <div className="App">
        <button onClick={() => updateColors()}>Change Overalls Color</button>
        <img src={imageData}/>
        <div/>
        <svg id="barcode"></svg>
      </div>
  );
}

export default App;
