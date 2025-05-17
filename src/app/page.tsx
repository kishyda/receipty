"use client";

import { useState, useRef, FormEvent } from 'react';

export default function UploadReceipt() {
  const [receiptData, setReceiptData] = useState<{
    receipt: any | null;
    items: any[];
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // Create a ref for the form

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { // Specify the event type
    event.preventDefault();
    const form = event.currentTarget; // Now TypeScript knows it's an HTMLFormElement

    if (!form) {
      console.error("Form element not found.");
      setError("An unexpected error occurred.");
      setUploading(false);
      return;
    }

    const formData = new FormData(form);
    const imageFile = formData.get('image');

    if (!imageFile || typeof imageFile === 'string') {
      setError('Please select an image file.');
      return;
    }

    setUploading(true);
    setReceiptData(null);
    setError(null);

    try {
      const response = await fetch('/api/process_receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process receipt.');
      }

      const data = await response.json();
      console.log(data);
      setReceiptData(data);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Receipt Data Extractor</h1>

      <form onSubmit={handleSubmit} ref={formRef}> {/* Attach the ref to the form */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Upload Receipt Image:
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }}
            required
          />
          {selectedImage && (
            <div style={{ marginTop: '10px' }}>
              <h3 style={{ fontSize: '1.1em', marginBottom: '5px' }}>Preview:</h3>
              <img src={selectedImage} alt="Receipt Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={uploading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '1em',
          }}
        >
          {uploading ? 'Processing...' : 'Extract Data'}
        </button>

        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>
        )}
      </form>

      {receiptData && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Extracted Data:</h2>
          {receiptData.receipt ? (
            <div>
              <h3 style={{ fontSize: '1.2em', marginBottom: '5px' }}>Receipt Details:</h3>
              <pre>{JSON.stringify(receiptData.receipt, null, 2)}</pre>
            </div>
          ) : (
            <p>No receipt details found.</p>
          )}

          {receiptData.items && receiptData.items.length > 0 ? (
            <div style={{ marginTop: '15px' }}>
              <h3 style={{ fontSize: '1.2em', marginBottom: '5px' }}>Items:</h3>
              <pre>{JSON.stringify(receiptData.items, null, 2)}</pre>
            </div>
          ) : (
            <p>No items found.</p>
          )}
        </div>
      )}
    </div>
  );
}
