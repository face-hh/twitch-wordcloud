import os
import sys
from PIL import Image

import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_gradient_magnitude

from wordcloud import WordCloud, ImageColorGenerator

# get data directory (using getcwd() is needed to support running example in generated IPython notebook)
d = os.path.dirname(__file__) if "__file__" in locals() else os.getcwd()

print("1. Getting the text file.")
text_file = sys.argv[1]
print("2. Getting the output file.")
le_output = sys.argv[3]

print("3. Reading text file.")
text = open(os.path.join(d, text_file), encoding="utf-8").read()

print("4. Getting the image file.")
image_file = sys.argv[2]

print("5. Opening image.")
general_color = np.array(Image.open(os.path.join(d, image_file)))

print("6. Resampling image.")
general_color = general_color

print("7. Creating mask.")
general_mask = general_color.copy()
general_mask[general_mask.sum(axis=2) == 0] = 255

print("8. Getting edges.")
edges = np.max([gaussian_gradient_magnitude(general_color[:, :, i] / 255., 2) for i in range(3)], axis=0)

print("9. Setting threshold.")
threshold = 0.1

print("10. Creating edge mask.")
general_mask_edges = edges > threshold

print("11. Transparent edges.")
general_mask[general_mask_edges] = 0

print("12. Creating wordcloud.")
# REMOVE background_color=None, mode='RGBA' FOR NON-TRANSPARENT BACKGROUND
# YOU MAY WANT TO ADD: contour_width=1, contour_color="#FFFFFF" IN ORDER TO GET A STROKE/OUTLINE/CONTOUR
# INCREASE THE MAX_FONT_SIZE FOR IMAGES THAT DON'T HAVE MANY COLORS, RECOMMENDED: 400
wc = WordCloud(max_words=9999999999999, stopwords=None, background_color=None, mode='RGBA', include_numbers=True, mask=general_mask, max_font_size=50, min_font_size=0.000000000001, random_state=42)

# USED FOR STREAMERS AND NOT LOGO:
#wc = WordCloud(max_words=9999999999999, stopwords=None, include_numbers=True, mask=general_mask, max_font_size=400, min_font_size=0.000000000001, random_state=42)

# generate word cloud
wc.generate(text)
plt.imshow(wc)

# create coloring from image
image_colors = ImageColorGenerator(general_color)
wc.recolor(color_func=image_colors)

print("13. Saving image.")
wc.to_file(le_output)

print("14. Done!")