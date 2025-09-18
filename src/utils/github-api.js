// src/utils/github-api.js
// Browser-side (insecure) GitHub read + write helpers.
// WARNING: tokens used here will be visible in the client (devtools). Use for quick demos only.

const RAW_PRODUCTS_URL =
  "https://raw.githubusercontent.com/godwinokronipa/donna-jewelry/main/src/data/products.json";

export async function fetchProductsFromGitHub() {
  try {
    const res = await fetch(RAW_PRODUCTS_URL);
    if (!res.ok) {
      throw new Error(`GitHub raw fetch failed: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
  console.error("Error fetching products from GitHub:", err);
  return { products: [] }; // always return an object with products array
  }
}

/**
 * Helper: encode string to base64 safely for most unicode.
 * Note: This uses the classic browser workaround (may still fail for extremely large payloads).
 */
function encodeBase64Unicode(str) {
  // Works for most cases (emoji and accented characters included)
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Update or create src/data/products.json in the repo.
 * WARNING: This runs in-browser and will expose `token` to anyone who inspects network/devtools.
 *
 * @param {Array|Object} products - JS object/array to be JSON-serialized
 * @param {string} token - GitHub Personal Access Token (must have repo access)
 * @param {string} repo - owner/repo (default: godwinokronipa/donna-jewelry)
 * @returns {object|null} GitHub API response or null on failure
 */
export async function updateProductsOnGitHub(
  products,
  token,
  repo = "godwinokronipa/donna-jewelry",
  branch = "main"
) {
  if (!token) {
    console.error("GitHub token is required for updateProductsOnGitHub (insecure).");
    return null;
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/src/data/products.json`;

  try {
    // 1) Try to GET the current file to obtain SHA
    const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    let sha;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    } else if (getRes.status === 404) {
      // File doesn't exist yet — we'll create it by omitting `sha` in the PUT body
      sha = undefined;
      console.warn("products.json not found on GitHub — will create a new file.");
    } else {
      // Other errors
      const errText = await getRes.text().catch(() => "");
      throw new Error(`GitHub GET failed: ${getRes.status} ${getRes.statusText} ${errText}`);
    }

    // 2) Prepare base64 content
    const jsonString = JSON.stringify(products, null, 2);
    const contentBase64 = encodeBase64Unicode(jsonString);

    // 3) Send PUT request to create/update the file
    const body = {
      message: "Update products.json via web UI",
      content: contentBase64,
      branch,
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const text = await putRes.text().catch(() => "");
      throw new Error(`GitHub PUT failed: ${putRes.status} ${putRes.statusText} ${text}`);
    }

    const result = await putRes.json();
    console.info("GitHub update successful:", result);
    return result;
  } catch (err) {
    console.error("Error updating products on GitHub:", err);
    return null;
  }
}
