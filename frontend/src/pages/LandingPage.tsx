import { useState } from 'react'
import { Link } from 'react-router-dom';
import type { Photo } from "@shared"
import { getPhotos, useOnMountUnsafe } from '@api';

export const LandingPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useOnMountUnsafe(() => {
    getPhotos()
      .then((res) => {
        setPhotos(res.data);
      })
      .finally(() => setLoading(false));
  });

  if (loading) return <div>Loading ...</div>;

  return (
    <div className="photo_grid">
      {photos.map(photo => (
        <Link to={`/photos/${photo.id}`} key={photo.id} className="photo_small_container">
          <img
            className="photo_small"
            src={photo.url}
          />
        </Link>
      ))}
    </div>
  )
}

