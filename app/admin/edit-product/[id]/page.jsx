"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getProduct } from "@/lib/product-data";

export default function AdminEditProduct() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { token, logout } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [productData, setProductData] = useState({
    title: "",
    price: "",
    introduction: "",
    details: ""
  });
  const [productImage, setProductImage] = useState(null);

  const [variants, setVariants] = useState([]);

  // Fetch product data on mount
  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProduct(id);
        if (data) {
          setProductData({
            title: data.title || "",
            price: data.price || "",
            introduction: data.introduction || "",
            details: data.details || ""
          });
          setProductImage(data.image || null);
          
          // Map backend variants to our frontend state
          const mappedVariants = (data.variants || []).map((v) => ({
            id: v.id,
            name: v.name || "",
            gram: v.weight || v.gram || "",
            price: v.price || "",
            isPrimary: false,
            // Store image objects/strings as they come
            images: (v.images || []).map(imgObj => {
                if (typeof imgObj === 'string') return imgObj;
                return imgObj.image || imgObj;
            }), 
            backendId: v.id
          }));
          
          if (mappedVariants.length === 0) {
            mappedVariants.push({ id: Date.now(), name: "", gram: "", price: "", isPrimary: true, images: [] });
          } else {
            mappedVariants[0].isPrimary = true;
          }
          
          setVariants(mappedVariants);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  // Auth check
  useEffect(() => {
    if (!token && !loading) {
      router.push(`/admin/login?redirect=/admin/edit-product/${id}`);
    }
  }, [token, router, loading, id]);

  const addVariant = () => {
    const newId = variants.length > 0 ? Math.max(...variants.map((v) => v.id)) + 1 : Date.now();
    setVariants([
      ...variants,
      {
        id: newId,
        name: "",
        gram: "",
        price: "",
        isPrimary: false,
        images: [],
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
          if (field === "isPrimary" && value === true) return { ...v, isPrimary: true };
          return { ...v, [field]: value };
        }
        if (field === "isPrimary" && value === true) return { ...v, isPrimary: false };
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
    if (typeof img === "string") return img;
    try {
        return URL.createObjectURL(img);
    } catch (e) {
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // SUCCESS: Minimal worked! Now let's try the full update with PATCH to be safer.
      const fullFormData = new FormData();
      fullFormData.append('title', productData.title);
      fullFormData.append('price', String(productData.price));
      fullFormData.append('introduction', productData.introduction || "");
      fullFormData.append('details', productData.details || "");
      
      if (productImage instanceof File) {
        fullFormData.append('image', productImage);
      }
      
      variants.forEach((variant, index) => {
        const variantName = variant.name || `${variant.gram || '0'}g`;
        if (variant.backendId) {
          fullFormData.append(`variants[${index}][id]`, String(variant.backendId));
        }
        fullFormData.append(`variants[${index}][name]`, String(variantName));
        fullFormData.append(`variants[${index}][weight]`, String(variant.gram || '0'));
        fullFormData.append(`variants[${index}][price]`, String(variant.price || '0'));
        
        // Handle only NEW images
        if (variant.images) {
          variant.images.forEach((img) => {
            if (img instanceof File) {
               fullFormData.append(`variants[${index}][images]`, img);
            }
          });
        }
      });
      
      console.log('Final Attempt with PATCH...');
      
      const response = await api.patch(`/api/shop/products/${id}/`, fullFormData);

      router.push('/admin/products');
    } catch (err) {
      console.error('Final Patch Error:', err);
      let detail = 'Server rejected request';
      if (err.response) {
        detail = typeof err.response.data === 'string' 
          ? err.response.data 
          : JSON.stringify(err.response.data);
      } else {
        detail = err.message;
      }
        
      setError(`Update Failed (500): ${detail.substring(0, 400)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-medium text-amber-900">Loading Product Secrets...</div>;
  if (!token) return <div className="text-center p-5">Redirecting to login...</div>;

  return (
    <div className="admin-content">
      {/* Styles reused from add-product */}
      <style>{`
        .variant-row { background: rgba(86, 44, 27, 0.02); border-radius: 16px; padding: 2rem; margin-bottom: 2rem; position: relative; border: 1px solid var(--glass-border); transition: all 0.3s ease; }
        .variant-row:hover { background: white; box-shadow: 0 10px 30px rgba(86, 44, 27, 0.05); border-color: var(--admin-secondary); }
        .remove-variant { position: absolute; top: 1.5rem; right: 1.5rem; color: #dc3545; cursor: pointer; z-index: 5; font-size: 1.25rem; opacity: 0.6; transition: opacity 0.3s ease; }
        .variant-images-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px dashed var(--glass-border); }
        .variant-image-input-group { display: flex; gap: 15px; margin-bottom: 1rem; align-items: center; }
        .variant-image-preview { width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--glass-border); background: #fff; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .section-header h2 { font-family: 'Story Script', cursive; font-size: 2.5rem; color: var(--admin-primary); margin: 0; }
        .breadcrumb { display: flex; list-style: none; padding: 0; margin-bottom: 1rem; gap: 0.5rem; font-size: 0.85rem; color: var(--admin-text-muted); }
        .breadcrumb a { color: var(--admin-text-muted); text-decoration: none; }
        .breadcrumb .active { color: var(--admin-primary); font-weight: 600; }
        .form-label { font-weight: 600; color: var(--admin-primary); margin-bottom: 0.75rem; font-size: 0.9rem; }
        .form-control { padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--glass-border); }
      `}</style>

      <div className="mb-5">
        <ul className="breadcrumb">
          <li><Link href="/admin">Dashboard</Link></li>
          <li>/</li>
          <li><Link href="/admin/products">Products</Link></li>
          <li>/</li>
          <li className="active">Edit Product</li>
        </ul>
        <div className="section-header">
          <h2>Edit Creation</h2>
          <Link href="/admin/products" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i> Back to List
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4 p-4 rounded-3 d-flex align-items-center">
          <i className="fas fa-exclamation-circle me-3 fs-3"></i>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-card mb-5">
          <div className="card-header"><h2>General Information</h2></div>
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
                      <Image
                        src={getImagePreview(productImage)}
                        alt="Main Preview"
                        width={240}
                        height={240}
                        className="rounded-lg object-fit-cover mx-auto shadow-md"
                        style={{ height: '180px', width: '180px' }}
                        unoptimized={productImage instanceof File}
                      />
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
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Product Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productData.title}
                    onChange={(e) => setProductData({...productData, title: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-4">
                  <label className="form-label">Entry Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={productData.price}
                    onChange={(e) => setProductData({...productData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Teaser Introduction</label>
              <textarea
                className="form-control"
                rows="2"
                value={productData.introduction}
                onChange={(e) => setProductData({...productData, introduction: e.target.value})}
                required
              ></textarea>
            </div>
            <div className="mb-0">
              <label className="form-label">Detailed Story</label>
              <textarea
                className="form-control"
                rows="6"
                value={productData.details}
                onChange={(e) => setProductData({...productData, details: e.target.value})}
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="admin-card mb-5">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2>Product Variations</h2>
            <button type="button" className="btn btn-primary btn-sm" onClick={addVariant}>
              <i className="fas fa-plus me-2"></i> Add Variant
            </button>
          </div>
          <div className="card-body p-4 p-md-5">
            {variants.map((variant, index) => (
              <div className="variant-row" key={variant.id}>
                {variants.length > 1 && (
                  <span className="remove-variant" onClick={() => removeVariant(variant.id)}><i className="fas fa-times-circle"></i></span>
                )}
                <div className="row g-4">
                  <div className="col-md-4">
                    <label className="form-label">Variant Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(variant.id, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Weight (g)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={variant.gram}
                      onChange={(e) => handleVariantChange(variant.id, "gram", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(variant.id, "price", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-2 text-center">
                    <label className="form-label d-block mb-3">Default?</label>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="primary_variant"
                      checked={variant.isPrimary}
                      onChange={() => handleVariantChange(variant.id, "isPrimary", true)}
                    />
                  </div>
                </div>

                <div className="variant-images-section">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 small fw-bold uppercase">Variant Gallery</h5>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addImageToVariant(variant.id)}>
                      <i className="fas fa-plus me-1"></i> Add Image
                    </button>
                  </div>
                  <div className="row g-3">
                    {variant.images.map((img, i) => (
                      <div className="col-lg-6" key={i}>
                        <div className="variant-image-input-group">
                          <a 
                            href={getImagePreview(img)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="leading-none"
                          >
                            <Image
                              src={getImagePreview(img) || "https://placehold.co/100x100?text=No+Image"}
                              className="variant-image-preview shadow-sm hover:opacity-80 transition-opacity"
                              alt="Product Preview"
                              width={100}
                              height={100}
                              quality={95}
                              unoptimized={typeof img !== "string"}
                              style={{ cursor: 'zoom-in' }}
                              onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Image")}
                            />
                          </a>
                          <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) updateImage(variant.id, i, file);
                          }} />
                          {variant.images.length > 1 && (
                            <button type="button" className="btn btn-sm text-danger p-2" onClick={() => removeImageFromVariant(variant.id, i)}>
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

        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link href="/admin/products" className="btn btn-outline-secondary px-5 py-3">Cancel</Link>
          <button type="submit" className="btn btn-primary px-5 py-3" disabled={saving}>
            {saving ? "Saving Changes..." : "Update Masterpiece"}
          </button>
        </div>
      </form>
    </div>
  );
}
