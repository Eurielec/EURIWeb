function GalleryFrame({ 
  src, 
  index, 
  total, 
  scrollYProgress, 
  title 
}: { 
  src: string, 
  index: number, 
  total: number, 
  scrollYProgress: MotionValue<number>,
  title: string
}) {
  const divisor = total > 1 ? total - 1 : 1;
  const peak = index / divisor;
  const start = (index - 1) / divisor;
  const end = (index + 1) / divisor;

  const opacity = useTransform(
    scrollYProgress,
    total > 1 ? [start, peak, end] : [0, 1],
    total > 1 ? [0, 1, 0] : [1, 1]
  );

  const scale = useTransform(
    scrollYProgress,
    total > 1 ? [start, peak, end] : [0, 1],
    total > 1 ? [1.1, 1, 1.1] : [1, 1]
  );

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <Image 
        src={src} 
        alt={`${title} frame ${index + 1}`}
        fill
        className="object-cover opacity-60 filter grayscale-[0.2]"
        unoptimized={src.startsWith('http')}
      />
    </motion.div>
  );
}
