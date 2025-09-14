// src/utils/github-api.js

/**
 * Fetch products JSON from GitHub raw content.
 * Make sure to point to your repo's raw products.json file.
 */
export async function fetchProductsFromGitHub() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/gokro/donna-jewelry/main/src/data/products.json"
    )

    if (!res.ok) {
      throw new Error(`GitHub fetch failed: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.error("Error fetching products from GitHub:", err)
    return []
  }
}

/**
 * Update products.json on GitHub via the REST API.
 * Requires a GitHub personal access token with repo access.
 */
export async function updateProductsOnGitHub(products, token, repo = "gokro/donna-jewelry") {
  const url = `https://api.github.com/repos/${repo}/contents/src/data/products.json`

  try {
    // Step 1: get current file SHA (required by GitHub API for updates)
    const getRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const fileData = await getRes.json()
    const sha = fileData.sha

    // Step 2: encode products as base64
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(products, null, 2))))

    // Step 3: send PUT request to update file
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update products.json",
        content,
        sha,
      }),
    })

    if (!putRes.ok) {
      throw new Error(`GitHub update failed: ${putRes.status}`)
    }

    const result = await putRes.json()
    return result
  } catch (err) {
    console.error("Error updating products on GitHub:", err)
    return null
  }
}
