'use client';

import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import MajorEventGallery from '@/components/MajorEventGallery';

interface HomeGalleryButtonProps {
  label?: string;
}

export default function HomeGalleryButton({ label = 'Galería' }: HomeGalleryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-outline-white inline-flex items-center gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        {label}
      </button>

      <MajorEventGallery
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        eventTitle="Galería Eurielec"
        eventId="all"
      />
    </>
  );
}
