from flask import Flask, request, jsonify, send_from_directory, render_template, send_file
from PIL import Image
import os
import io

app = Flask(__name__)
IMAGE_ROOT = '<Path to Image Database>'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_images', methods=['POST'])
def get_images():
    data = request.json
    print('data:', data)
    hashcode = data.get('hashcodes')

    tif_path = os.path.join('tif_path', hashcode, hashcode + '.tif')
    png_path = os.path.join('png_path', hashcode, hashcode + '.png')
    mask_path = os.path.join('mask_path', hashcode, hashcode + '.png')
    image = {
        'imguid': hashcode,
        'tif': tif_path if os.path.exists(os.path.join(IMAGE_ROOT, tif_path)) else '',
        'png': png_path if os.path.exists(os.path.join(IMAGE_ROOT, png_path)) else '',
        'mask': mask_path if os.path.exists(os.path.join(IMAGE_ROOT, mask_path)) else '',
    }
    return jsonify(image)

@app.route('/image/<path:filename>')
def images(filename):
    #return send_file(filename)
    tif_path = os.path.join(IMAGE_ROOT, filename)
    with Image.open(tif_path) as img:
        img = img.convert("RGBA")
        background = Image.new("RGBA", img.size, (0, 0, 0))
        img = Image.alpha_composite(background, img)
        img = img.convert("RGB")

        img_io = io.BytesIO()
        img.convert('RGB').save(img_io, 'JPEG') # convert to jpeg to reduce rendering time. Current solution of generating ppt is slow
        img_io.seek(0)

    return send_file(img_io, mimetype='image/jpeg')
    
if __name__ == '__main__':
    app.run(debug=True, port=5001)