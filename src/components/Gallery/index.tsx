import 'react-photo-view/dist/react-photo-view.css';
import Image from 'next/image';
import styles from './gallery.module.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import LockUp from '@/components/Common/lockup';
import { iSize, iTheme, iVariant } from '@/lib/types';

interface iGallery {
  images: string[];
  variant?: iVariant;
}

const Gallery: React.FC<iGallery> = ({
  images,
  variant = iVariant.Primary,
}) => {
  return (
    <PhotoProvider
      easing={(type) =>
        type === 2
          ? 'cubic-bezier(0.36, 0, 0.66, -0.56)'
          : 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    >
      {variant === iVariant.Primary ? (
        <section className={styles.gallery}>
          <LockUp
            title="Event Gallery"
            subtitle="Explore captivating images from our past events and venue."
            theme={iTheme.Dark}
            size={iSize.Large}
          />
          <div className={styles.imageContainer + ' foo'}>
            {images?.map((item) => (
              <PhotoView key={item} src={item}>
                <Image width={300} height={300} src={item} alt={item} />
              </PhotoView>
            ))}
          </div>
        </section>
      ) : (
        <section
          className={
            images.length === 1
              ? styles.gallerySecSingle
              : styles.gallerySec + ' foo'
          }
        >
          {images?.map((img) => (
            <PhotoView key={img} src={img}>
              <Image src={img} alt="Concert Ticket" width={500} height={500} />
            </PhotoView>
          ))}
        </section>
      )}
    </PhotoProvider>
  );
};

export default Gallery;
