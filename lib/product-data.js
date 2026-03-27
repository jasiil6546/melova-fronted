import api from "./axios";

export async function getProducts() {
  const isServer = typeof window === "undefined";
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.mymelova.com/").trim().replace(/\/$/, "");

  try {
    let data;
    if (isServer) {
      // Use native fetch on server for direct backend communication without legacy Axios warnings
      const res = await fetch(`${API_URL}/api/shop/products/`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(25000),
      });

      if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server API returned ${res.status}: ${text.substring(0, 50)}`);
      }

      data = await res.json();
    } else {
      // Use native fetch on client. Bypassing the proxy to resolve 'Failed to fetch' issues
      // The backend (api.mymelova.com) has been confirmed to support CORS '*'
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        let res = await fetch(`${API_URL}/api/shop/products/`, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            ...(sessionStorage.getItem("melova_token") 
                ? { "Authorization": `Bearer ${sessionStorage.getItem("melova_token")}` } 
                : {})
          }
        });

        // 401 handling for public endpoint: if token is invalid, retry WITHOUT token
        if (res.status === 401 && sessionStorage.getItem("melova_token")) {
          console.warn("Public API returned 401. Retrying without token...");
          res = await fetch(`${API_URL}/api/shop/products/`, {
            signal: controller.signal,
            headers: { "Accept": "application/json" }
          });
        }

        clearTimeout(timeoutId);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Client API returned ${res.status}: ${text.substring(0, 50)}`);
        }
        data = await res.json();
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Direct Fetch Error Details:", err);
        throw err;
      }
    }

    const products = Array.isArray(data) ? data : data.results;

    if (!Array.isArray(products))
      throw new Error(`Unexpected API response structure for products.`);

    // Normalize for UI
    return products.map(p => ({
      id: p.id,
      name: p.title || p.name,
      title: p.title || p.name,
      intro: p.introduction || p.intro,
      introduction: p.introduction || p.intro,
      description: p.details || p.description,
      details: p.details || p.description,
      image: p.image,
      price: p.price,
      variants: p.variants || []
    }));

  } catch (error) {
    console.error("Error in getProducts:", error.message, error.response?.data || "");
    // Silent fail returning empty array OR fallback based on app design
    return [];
  }
}

export async function getProduct(id) {
  const isServer = typeof window === "undefined";
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.mymelova.com/").trim().replace(/\/$/, "");

  try {
    let p;
    if (isServer) {
      const res = await fetch(`${API_URL}/api/shop/products/${id}/`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(25000),
      });

      if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server API returned ${res.status}: ${text.substring(0, 50)}`);
      }

      p = await res.json();
    } else {
      // Use native fetch on client bypassing proxy for stability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        let res = await fetch(`${API_URL}/api/shop/products/${id}/`, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            ...(sessionStorage.getItem("melova_token") 
                ? { "Authorization": `Bearer ${sessionStorage.getItem("melova_token")}` } 
                : {})
          }
        });

        // 401 handling for public endpoint: if token is invalid, retry WITHOUT token
        if (res.status === 401 && sessionStorage.getItem("melova_token")) {
           res = await fetch(`${API_URL}/api/shop/products/${id}/`, {
             signal: controller.signal,
             headers: { "Accept": "application/json" }
           });
        }

        clearTimeout(timeoutId);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Client API returned ${res.status}: ${text.substring(0, 50)}`);
        }
        p = await res.json();
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    }

    // Normalize for UI including old names for admin autofill
    return {
      id: p.id,
      name: p.title,
      title: p.title,
      intro: p.introduction,
      introduction: p.introduction,
      description: p.details,
      details: p.details,
      image: p.image,
      price: p.price,
      variants: p.variants || []
    };

  } catch (error) {
    console.error(`Error in getProduct(${id}):`, error.message);
    return null;
  }
}