const fs = require('fs');

document.getElementById('encodeButton').addEventListener('click', () => {
  const imageInput = document.getElementById('imageInput').files[0];
  if (imageInput) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const base64String = event.target.result.split(',')[1];
      fs.writeFile('encodedImage.txt', base64String, (err) => {
        if (err) throw err;
        alert('Image encoded and saved to encodedImage.txt');
      });
    };
    reader.readAsDataURL(imageInput);
  }
});

document.getElementById('decodeButton').addEventListener('click', () => {
  const textInput = document.getElementById('textInput').files[0];
  if (textInput) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const base64String = event.target.result;
      const imgElement = document.getElementById('outputImage');
      imgElement.src = `data:image/png;base64,${base64String}`;
      imgElement.style.display = 'block';
    };
    reader.readAsText(textInput);
  }
});