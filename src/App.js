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
  orange: '#ffa347',
  red: '#f83800',
  brown: '#af7f00',
  blue: '#0099ff',
  green: '#00cc66',
  white: '#ffffff',
  black: '#000000'
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
          targetColor: colors.red,
          replaceColor: new_color
        },
        deltaE: 1.0
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
            targetColor: colors.brown,
            replaceColor: new_color
            },
            deltaE: 1.0
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
            targetColor: colors.orange,
            replaceColor: new_color
            },
            deltaE: 1.0
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
    function getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }

    const barcodeString = `${getKeyByValue(colors, new_color)}${getKeyByValue(colors, hairShirtBootsColor)}${getKeyByValue(colors, skinColor)}`
    JsBarcode("#barcode", barcodeString)

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
