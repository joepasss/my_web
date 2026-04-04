import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPhoto, useOnMountUnsafe } from '@api';
import type { Photo } from "@shared"

export const PhotoDetailPage = () => {
  const { id } = useParams<{  id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useOnMountUnsafe(() => {
    if (id) {
      getPhoto(id)
        .then((res) => {
          setPhoto(res.data);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  })

  if (loading) return <div>Loading ...</div>;

  if (!photo) {
    return <div />;
  }

  return (
    <div className="photo_detail">
      <div className="photo_large_container">
        <img className="photo_large" src={photo.url} />
      </div>
    </div>
  )
}
