import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

url = "https://hsrinivasan768.github.io/Aarogyam_Homeopath/"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Generate high-contrast clinical dark green QR code
qr_img = qr.make_image(fill_color="#0D4A38", back_color="white").convert("RGBA")

# Optional: Add clinical card border and branding header/footer
w, h = qr_img.size
card_padding_top = 80
card_padding_bottom = 60
card_padding_sides = 30

card_w = w + card_padding_sides * 2
card_h = h + card_padding_top + card_padding_bottom

card = Image.new("RGBA", (card_w, card_h), (255, 255, 255, 255))
draw = ImageDraw.Draw(card)

# Draw subtle border
draw.rounded_rectangle([(4, 4), (card_w - 5, card_h - 5)], radius=16, outline="#D0E3DA", width=3)

# Paste QR
card.paste(qr_img, (card_padding_sides, card_padding_top), qr_img)

# Try basic font drawing
try:
    font_title = ImageFont.load_default()
except Exception:
    font_title = None

draw.text((card_w // 2, 28), "AAROGYAM HOMEOPATHY", fill="#0D4A38", anchor="mm", font=font_title)
draw.text((card_w // 2, 48), "Scan to Visit Online Clinic", fill="#5A7D71", anchor="mm", font=font_title)
draw.text((card_w // 2, card_h - 28), "hsrinivasan768.github.io/Aarogyam_Homeopath", fill="#889892", anchor="mm", font=font_title)

# Save standard QR and branded Card
output_project_qr = os.path.abspath("assets/aarogyam_qr_code.png")
output_project_card = os.path.abspath("assets/aarogyam_qr_card.png")
output_artifact_qr = r"C:\Users\Gouda Suryani\.gemini\antigravity-ide\brain\8b478c79-2b2b-4748-808a-98f58aa43d18\aarogyam_qr_card.png"

qr_img.convert("RGB").save(output_project_qr)
card.convert("RGB").save(output_project_card)
card.convert("RGB").save(output_artifact_qr)

print(f"Generated QR Code: {output_project_qr}")
print(f"Generated QR Card: {output_project_card}")
print(f"Artifact Copy: {output_artifact_qr}")
