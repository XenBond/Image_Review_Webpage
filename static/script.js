function loadImages() {
    const hashcodes = document.getElementById('hashcodes').value.split('\n');
    const rightPanel = document.getElementById('right-panel');
    rightPanel.innerHTML = ''; // Clear previous images

    hashcodes.forEach(hashcode => {
        if (hashcode.trim()) {
            fetch('/get_images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hashcodes: hashcode.trim() })
            })
            .then(response => response.json())
            .then(data => {
                const row = document.createElement('div');
                row.className = 'image-row';

                const hashcodeDiv = document.createElement('div');
                hashcodeDiv.textContent = hashcode.trim();
                row.appendChild(hashcodeDiv);

                const tifDiv = document.createElement('div');
                if (data.tif) {
                    const tifPath = data.tif.replace('.tif', '.jpg');
                    tifDiv.innerHTML = `<img src="/image/${data.tif}" alt="TIF Image">`;
                } else {
                    tifDiv.textContent = 'No TIF image available';
                }
                row.appendChild(tifDiv);

                const pngDiv = document.createElement('div');
                if (data.png) {
                    const pngPath = data.png.replace('.png', '.jpg');
                    pngDiv.innerHTML = `<img src="/image/${data.png}" alt="PNG Image" class="bounding-box">`;
                } else {
                    pngDiv.textContent = 'No PNG image available';
                }
                row.appendChild(pngDiv);

                const maskDiv = document.createElement('div');
                if (data.mask) {
                    const maskPath = data.png.replace('.png', '.jpg');
                    maskDiv.innerHTML = `<img src="/image/${data.mask}" alt="Mask Image" class="bounding-box">`;
                } else {
                    maskDiv.textContent = 'No Mask image available';
                }
                row.appendChild(maskDiv);

                rightPanel.appendChild(row);
            })
            .catch(error => console.error('Error:', error));
        }
    });
}