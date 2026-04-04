import {
  deletePhoto,
  getPhoto,
  getPhotos,
  uploadPhoto,
  useOnMountUnsafe,
} from "@api";
import type { Photo } from "@shared";
import { useState } from "react";

export const AdminPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedPhoto, setExpandedPhoto] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  useOnMountUnsafe(() => {
    getPhotos()
      .then((res) => {
        setPhotos(res.data);
      })
      .finally(() => setPageLoading(false));
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("delete?")) return;

    deletePhoto(id.toString())
      .then(() => {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        if (expandedId === id) setExpandedId(null);
      })
      .catch((error) => {
        alert(`delete failed: ${error.statusText || "unknown error"}`);
      });
  };

  const handleExpand = (id: number) => {
    if (expandedId == id) {
      setExpandedId(null);
      setExpandedPhoto(null);
      return;
    }

    setExpandedId(id);
    setDetailLoading(true);
    setExpandedPhoto(null);

    getPhoto(id.toString())
      .then((res) => {
        setExpandedPhoto(res.data);
      })
      .catch((err) => {
        console.error("Detail fetch failed:", err);
      })
      .finally(() => {
        setDetailLoading(false);
      });
  };

  const handleUpload: React.SubmitEventHandler = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    setUploading(true);
    uploadPhoto(formData)
      .then((res) => {
        setPhotos((prev) => [res.data, ...prev]);
        setFile(null);
        alert("upload success");
      })
      .catch((err) => alert(`Upload failed: ${err.statusText}`))
      .finally(() => setUploading(false));
  };

  if (pageLoading) return <div>Loading</div>;

  return (
    <div>
      <h3>PHOTOS</h3>
      <section className="upload-section">
        <h3>upload</h3>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button type="submit" disabled={!file || uploading}>
            {uploading ? "Uploading ..." : "Upload Photo"}
          </button>
        </form>
      </section>
      {photos.map((photo) => (
        <div key={photo.id} className="photo-item-wrapper">
          <div
            className="photo-grid"
            onClick={() => handleExpand(photo.id)}
            key={photo.id}
          >
            <div className="thumbnail">
              <img className="thumbnail" src={photo.url} />
            </div>
            <div className="attrs">
              <p>filename: {photo.filename}</p>
              <p>url: {photo.url}</p>
              <p>{photo.created_at}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(photo.id);
              }}
            >
              delete
            </button>
          </div>
          {expandedId === photo.id && (
            <div className="expand-modal" onClick={(e) => e.stopPropagation}>
              <hr />
              {detailLoading ? (
                <p>Loading ...</p>
              ) : expandedPhoto ? (
                <div className="detail-content">
                  <h4>id: {expandedPhoto.id}</h4>
                  <h4>filename: {expandedPhoto.filename}</h4>
                  <h4>filename: {expandedPhoto.created_at}</h4>
                  <div className="photo-large-container">
                    <img className="photo-large" src={expandedPhoto.url} />
                  </div>
                </div>
              ) : (
                <p>Failed to load data</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
