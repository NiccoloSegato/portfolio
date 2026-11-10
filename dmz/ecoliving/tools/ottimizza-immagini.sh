#!/bin/zsh
# Converte le foto prodotto PNG in WebP leggeri per il sito.
#   uso: ./tools/ottimizza-immagini.sh
# Legge assets/images/product_*.png, scrive assets/images/product_*.webp
# (1200px di larghezza, qualità 78) e sposta i PNG originali in
# assets/images/originali/. Serve cwebp (brew install webp).
set -euo pipefail
cd "$(dirname "$0")/../assets/images"
mkdir -p originali

for png in product_*.png(N); do
  webp="${png:r}.webp"
  cwebp -quiet -q 78 -m 6 -resize 1200 0 "$png" -o "$webp"
  mv "$png" originali/
  printf "%-16s %6s KB → %-17s %4s KB\n" "$png" $(( $(stat -f%z "originali/$png") / 1024 )) "$webp" $(( $(stat -f%z "$webp") / 1024 ))
done
