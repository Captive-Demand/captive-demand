import Image from 'next/image';

export function NashvilleLocalPhoto() {
  return (
    <div
      className="relative isolate aspect-[5/4] overflow-hidden rounded-2xl sm:aspect-[4/3]"
      role="img"
      aria-label="An in-person working session."
    >
      <Image
        src="/Office Discussion Scene (1).png"
        alt=""
        fill
        className="object-cover object-[30%_40%]"
        sizes="(max-width: 1024px) 100vw, 58vw"
      />
    </div>
  );
}
