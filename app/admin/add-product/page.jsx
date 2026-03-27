"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminAddProduct() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

  const [variants, setVariants] = useState([
    { id: 0, name: "", gram: "", price: "", isPrimary: true, images: [""] },
  ]);

  // Check if token exists on mount
  useEffect(() => {
    if (!token) {
      router.push('/admin/login?redirect=/admin/products/add');
    }
  }, [token, router]);

const addVariant = () => {
  const newId = variants.length > 0 ? Math.max(...variants.map((v) => v.id)) + 1 : 0;
  setVariants([
    ...variants,
    {
      id: newId,
      name: "", // Leave empty - we'll handle default in form submission
      gram: "",
      price: "",
      isPrimary: false,
      images: [""],
    },
  ]);
};

  const removeVariant = (id) => {
    const filtered = variants.filter((v) => v.id !== id);
    if (filtered.length > 0 && variants.find((v) => v.id === id)?.isPrimary) {
      filtered[0].isPrimary = true;
    }
    setVariants(filtered);
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          if (field === "isPrimary" && value === true) {
            return { ...v, isPrimary: true };
          }
          return { ...v, [field]: value };
        }
        if (field === "isPrimary" && value === true) {
          return { ...v, isPrimary: false };
        }
        return v;
      }),
    );
  };

  const addImageToVariant = (variantId) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, images: [...v.images, ""] } : v,
      ),
    );
  };

  const removeImageFromVariant = (variantId, imageIndex) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newImages = [...v.images];
          newImages.splice(imageIndex, 1);
          return { ...v, images: newImages };
        }
        return v;
      }),
    );
  };

  const updateImage = (variantId, imageIndex, file) => {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newImages = [...v.images];
          newImages[imageIndex] = file;
          return { ...v, images: newImages };
        }
        return v;
      }),
    );
  };

  const getImagePreview = (img) => {
    if (!img) return null;
    if (typeof img === "string") return img || null;
    return URL.createObjectURL(img);
  };

  // Function to refresh the token using your existing refresh token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("melova_refresh");

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(
        `${API_URL}api/token/refresh/`,
        { refresh: refreshToken }
      );

      const newAccessToken = response.data.access;

      // Update token in localStorage and axios headers
      localStorage.setItem("melova_token", newAccessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout the user
      logout();
      router.push('/admin/login?redirect=/admin/products/add');
      return null;
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    // DEBUG: Check what's in your variants state
    console.log('Current variants state:', JSON.stringify(variants, null, 2));
    
    const formData = new FormData();
    
    // Get form input values
    const title = document.getElementById('productName').value;
    const introduction = document.getElementById('productIntro').value;
    const description = document.getElementById('productDescription').value;
    const basePrice = document.getElementById('basePrice').value;
    
    console.log('Form values:', { title, introduction, description, basePrice });
    
    // Basic Product Info
    formData.append('title', title);
    formData.append('introduction', introduction);
    formData.append('details', description);
    formData.append('price', basePrice);
    
    if (productImage) {
      formData.append('image', productImage);
    }
    
    // Loop through variants and add each field individually
    variants.forEach((variant, index) => {
      console.log(`Processing variant ${index}:`, variant);
      
      // Make sure we have values
      const variantName = variant.name || `${variant.gram || '0'}g`;
      const variantWeight = variant.gram || '0';
      const variantPrice = variant.price || '0';
      
      // Append each field with the correct nested structure
      formData.append(`variants[${index}][name]`, variantName);
      formData.append(`variants[${index}][weight]`, variantWeight);
      formData.append(`variants[${index}][price]`, variantPrice);
      
      // Add images for this variant
      if (variant.images && variant.images.length > 0) {
        variant.images.forEach((file, imgIndex) => {
          if (file && typeof file !== 'string' && file instanceof File) {
            formData.append(`variants[${index}][images]`, file);
            console.log(`Added image ${imgIndex} for variant ${index}:`, file.name);
          }
        });
      }
    });
    
    // DEBUG: Check what's in FormData
    for (let pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1] instanceof File ? pair[1].name : pair[1]);
    }
    
    // Get the current token
    let currentToken = localStorage.getItem("melova_token");
    console.log('Using token:', currentToken ? 'Token exists' : 'No token');
    
    // Make the request using shared api instance for auto-refresh
    const response = await api.post(`/api/shop/products/`, formData);
    
    console.log('Product created successfully:', response.data);

    // Success - redirect to products list
    router.push('/admin/products');

    } catch (err) {
      console.error('Submission error:', err);

      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout();
        setTimeout(() => {
          router.push('/admin/login?redirect=/admin/products/add');
        }, 1500);
      } else {
        setError(err.response?.data ? JSON.stringify(err.response.data) : (err.message || 'Failed to create product'));
      }
    } finally {
      setLoading(false);
    }
  };
  // If no token, show nothing while redirecting
  if (!token) {
    return <div className="text-center p-5">Redirecting to login...</div>;
  }

  return (
    <div className="admin-content">
      <style>{`
        .variant-row {
            background: rgba(86, 44, 27, 0.02);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 2rem;
            position: relative;
            border: 1px solid var(--glass-border);
            transition: all 0.3s ease;
        }
        .variant-row:hover {
            background: white;
            box-shadow: 0 10px 30px rgba(86, 44, 27, 0.05);
            border-color: var(--admin-secondary);
        }
        .remove-variant {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            color: #dc3545;
            cursor: pointer;
            z-index: 5;
            font-size: 1.25rem;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        .remove-variant:hover {
            opacity: 1;
        }
        .variant-images-section {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px dashed var(--glass-border);
        }
        .variant-image-input-group {
            display: flex;
            gap: 15px;
            margin-bottom: 1rem;
            align-items: center;
        }
        .variant-image-preview {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid var(--glass-border);
            background: #fff;
        }
        .form-label {
            font-weight: 600;
            color: var(--admin-primary);
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
            letter-spacing: 0.3px;
        }
        .form-control {
            padding: 0.75rem 1rem;
            border-radius: 10px;
            border: 1px solid var(--glass-border);
            background: white;
        }
        .form-control:focus {
            border-color: var(--admin-secondary);
            box-shadow: 0 0 0 4px rgba(158, 124, 41, 0.1);
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .section-header h2 {
            font-family: 'Story Script', cursive;
            font-size: 2.5rem;
            color: var(--admin-primary);
            margin: 0;
        }
        .breadcrumb {
          display: flex;
          list-style: none;
          padding: 0;
          margin-bottom: 1rem;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--admin-text-muted);
        }
        .breadcrumb a {
          color: var(--admin-text-muted);
          text-decoration: none;
        }
        .breadcrumb .active {
          color: var(--admin-primary);
          font-weight: 600;
        }
      `}</style>

      {/* Breadcrumb & Title */}
      <div className="mb-5">
        <ul className="breadcrumb">
          <li><Link href="/admin">Dashboard</Link></li>
          <li>/</li>
          <li><Link href="/admin/products">Products</Link></li>
          <li>/</li>
          <li className="active">Add New Product</li>
        </ul>
        <div className="section-header">
          <h2>Create New Creation</h2>
          <Link href="/admin/products" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i> Back to List
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4 d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-3 fs-4"></i>
          <div>
            <h5 className="mb-1 fw-bold">Creation Failed</h5>
            <p className="mb-0 small">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center g-5">
          <div className="col-lg-12">
            {/* Product Info */}
            <div className="admin-card mb-5">
              <div className="card-header">
                <h2>General Information</h2>
              </div>
              <div className="card-body p-4 p-md-5">
                <div className="row g-4">
                  <div className="col-md-3">
                    <label className="form-label">Featured Product Image</label>
                    <div 
                      className="border-2 border-dashed rounded-xl p-3 text-center cursor-pointer hover:bg-stone-50 transition-all border-stone-200"
                      onClick={() => document.getElementById('mainImageInput').click()}
                    >
                      {productImage ? (
                        <div className="position-relative">
                        <a 
                          href={URL.createObjectURL(productImage)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="d-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Image
                            src={URL.createObjectURL(productImage)}
                            alt="Main Preview"
                            width={400}
                            height={400}
                            quality={100}
                            className="rounded-lg object-fit-cover mx-auto shadow-md hover:scale-[1.02] transition-transform duration-200"
                            style={{ height: '240px', width: '240px', cursor: 'zoom-in' }}
                          />
                        </a>
                          <p className="mt-2 text-xs text-stone-500">Click to change</p>
                        </div>
                      ) : (
                        <div className="py-4">
                          <i className="fas fa-cloud-upload-alt text-3xl text-stone-300 mb-2"></i>
                          <p className="small text-stone-500 mb-0">Select Main Image</p>
                        </div>
                      )}
                      <input 
                        id="mainImageInput"
                        type="file" 
                        className="d-none" 
                        accept="image/*"
                        onChange={(e) => setProductImage(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="mb-4">
                      <label htmlFor="productName" className="form-label">
                        Product Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        placeholder="e.g. Belgian Dark Chocolate Bar"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-4">
                      <label htmlFor="basePrice" className="form-label">
                        Entry Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="basePrice"
                        placeholder="0.00"
                        required
                      />
                      <div className="form-text small opacity-75">Visible as &apos;Starting from&apos; price</div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="productIntro" className="form-label">
                    Teaser Introduction
                  </label>
                  <textarea
                    className="form-control"
                    id="productIntro"
                    rows="2"
                    placeholder="A enticing one-liner about your chocolate treat..."
                    required
                  ></textarea>
                </div>
                <div className="mb-0">
                  <label htmlFor="productDescription" className="form-label">
                    Detailed Story
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    rows="6"
                    placeholder="Describe the notes, origin, and craftsmanship involved..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="admin-card mb-5">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h2>Product Variations</h2>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addVariant}
                >
                  <i className="fas fa-plus me-2"></i> Add Size/Variant
                </button>
              </div>
              <div className="card-body p-4 p-md-5">
                {variants.map((variant, index) => (
                  <div className="variant-row" key={variant.id}>
                    {variants.length > 1 && (
                      <span
                        className="remove-variant"
                        onClick={() => removeVariant(variant.id)}
                        title="Remove Variant"
                      >
                        <i className="fas fa-times-circle"></i>
                      </span>
                    )}

                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="form-label">Variant Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Large Box (12 pcs)"
                          required
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Weight (g)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="500"
                          required
                          value={variant.gram}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "gram",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Weight Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="250"
                          required
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "price",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label d-block text-center mb-3">Default?</label>
                        <div className="d-flex justify-content-center">
                          <div className="form-check form-switch p-0 m-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="primary_variant"
                              style={{ width: '2.5em', height: '1.25em', float: 'none', cursor: 'pointer' }}
                              checked={variant.isPrimary}
                              onChange={() =>
                                handleVariantChange(variant.id, "isPrimary", true)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Variant Images */}
                    <div className="variant-images-section">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0 small fw-bold text-uppercase letter-spacing-1">Variant Gallery</h5>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => addImageToVariant(variant.id)}
                        >
                          <i className="fas fa-plus me-1"></i> Add Image
                        </button>
                      </div>

                      <div className="row g-3">
                        {variant.images.map((imgUrl, imgIndex) => (
                          <div className="col-lg-6" key={imgIndex}>
                            <div className="variant-image-input-group">
                              <Image
                                src={getImagePreview(imgUrl) || "https://placehold.co/100x100?text=No+Image"}
                                className="variant-image-preview"
                                alt="Preview"
                                width={50}
                                height={50}
                                quality={90}
                                unoptimized
                                onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Image")}
                              />
                              <input
                                type="file"
                                accept="image/*"
                                className="form-control form-control-sm"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) updateImage(variant.id, imgIndex, file);
                                }}
                              />
                              {variant.images.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-sm text-danger p-2"
                                  onClick={() =>
                                    removeImageFromVariant(variant.id, imgIndex)
                                  }
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-between align-items-center mt-5 mb-5 p-4 bg-white rounded-3 shadow-sm border">
              <span className="text-muted small italic">Ready to add this masterpiece to your collection?</span>
              <div className="d-flex gap-3">
                <Link
                  href="/admin/products"
                  className="btn btn-outline-secondary px-4"
                >
                  Discard Changes
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle me-2"></i> Publish Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}