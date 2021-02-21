rm -rf .next/ out/;
rm throwaway.zip;

yarn next build;
yarn next export;

cp manifest.json ./out;

mv ./out/_next ./out/next
cd ./out && grep -rli '_next' * | xargs -I@ sed -i 's/_next/next/g' @;

zip -r -FS ../throwaway.zip *;