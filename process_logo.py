import sys
from PIL import Image

def process_logo():
    input_path = 'assets/nexora_logo.jpg'
    output_path = 'assets/nexora_n_transparent.png'
    
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # 1. Crop out the bottom text
    crop_height = int(height * 0.65)
    img = img.crop((0, 0, width, crop_height))
    width, height = img.size
    
    # 2. Make the background transparent
    # The background is a solid dark blue. We sample it from (0,0).
    pixels = img.load()
    bg_r, bg_g, bg_b, _ = pixels[0, 0]
    
    tolerance = 25 # tolerance for background color matching
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # If the pixel is close to the background color, make it transparent
            if abs(r - bg_r) < tolerance and abs(g - bg_g) < tolerance and abs(b - bg_b) < tolerance:
                pixels[x, y] = (0, 0, 0, 0)
                
    img.save(output_path)
    print(f"Successfully processed logo to {output_path}")

if __name__ == "__main__":
    process_logo()
