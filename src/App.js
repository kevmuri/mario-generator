import logo from './logo.svg';
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
  const [barcodeData, setBarcodeData] = useState('0');

  async function updateColors(target) {
    const new_color = randomColor();

    if (target === 'overalls') {
      replaceColor({
        image: mario_overalls,
        colors: {
          type: 'hex',
          targetColor: colors.red.hex,
          replaceColor: new_color.hex
        },
        deltaE: 20
      }).then((jimp_obj) => {
        jimp_obj.getBase64(jimp_obj.getMIME(), (err, src) => {
              setOverallsImage(src);
            }
        )
      })

      setOverallsColor(new_color);
    }
    else if (target === 'hairShirtBoots') {
        replaceColor({
            image: mario_hairShirtBoots,
            colors: {
            type: 'hex',
            targetColor: colors.brown.hex,
            replaceColor: new_color.hex
            },
          deltaE: 20
        }).then((jimp_obj) => {
            jimp_obj.getBase64(jimp_obj.getMIME(), (err, src) => {
                setHairShirtBootsImage(src);
                }
            )
        })

        setHairShirtBootsColor(new_color);
    }

    else if (target === 'skin') {
        replaceColor({
            image: mario_skin,
            colors: {
            type: 'hex',
            targetColor: colors.orange.hex,
            replaceColor: new_color.hex
            },
          deltaE: 20
        }).then((jimp_obj) => {
            jimp_obj.getBase64(jimp_obj.getMIME(), (err, src) => {
                setSkinImage(src);
                }
            )
        })

        setSkinColor(new_color);
    }
  }


  function updateBarcode(new_color) {
    const barcodeString = `${overallsColor.key}${hairShirtBootsColor.key}${skinColor.key}`
    JsBarcode("#barcode", barcodeString)

    console.log(overallsColor)
    console.log(barcodeString)
  }

  function randomColor() {
      return Object.values(colors)[Math.floor(Math.random() * Object.keys(colors).length)];
  }

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

  useEffect(() => {
    mergeImages([overallsImage, hairShirtBootsImage, skinImage])
  }, [])

  useEffect(() => {
    mergeImages([overallsImage, hairShirtBootsImage, skinImage]).then(setImageData)
    updateBarcode(overallsColor)
  }, [overallsImage, hairShirtBootsImage, skinImage])

  return (
      <div className="App">
        <img src={imageData}/>
        <div/>
        <button onClick={() => updateColors('overalls')}>Change Overalls Color</button>
        <button onClick={() => updateColors('hairShirtBoots')}>Change Hair, Shirt, Boots Color</button>
        <button onClick={() => updateColors('skin')}>Change skin Color</button>
        <div/>
        <svg id="barcode"></svg>
      </div>
  );
}

export default App;
