import React, { useState } from "react";

const UploaderComponent = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Handle image upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed with status: ${response.status}`);

      const data = await response.json();
      setUploadedUrls(data.imageUrls); // Store uploaded image URLs
      onUploadSuccess(data.imageUrls); // Pass uploaded URLs to parent component
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader-container">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      {selectedFiles.length > 0 && (
        <div className="preview-container">
          {selectedFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt="Preview" className="preview-image" />
          ))}
        </div>
      )}

      <button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      {uploadedUrls.length > 0 && (
        <div className="uploaded-links">
          <h3>Uploaded Images:</h3>
          {uploadedUrls.map((url, index) => (
            <p key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploaderComponent;
