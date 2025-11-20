module.exports = ({ src }: { src: string }) => {
  if (src.startsWith("http")) return src;
  return `${process.env.NEXT_PUBLIC_ASSET_PREFIX || ""}${src}`;
};
