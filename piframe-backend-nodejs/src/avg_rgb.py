import sys
import json
from PIL import Image
import numpy as np

# Example: read image path from CLI argument
image_path = sys.argv[1]
#print(json.dumps({"path": image_path}))

img = Image.open(image_path).convert('RGB')
np_img = np.array(img)

#find average color to update
average_color_total = np.mean(np_img, axis=(0,1))

print(json.dumps({"avg_rgb": [int(round(c)) for c in average_color_total]}))
