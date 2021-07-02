let productId = '';
let gAccessToken = '';

function main() {
  hideMainContent();
  const accessToken = window.localStorage.getItem("subAccessToken");
  if (accessToken) {
    gAccessToken = accessToken;
    console.log(gAccessToken);
    displayMainContent();
  }
}

async function createNewService() {
  const nameField = document.getElementById('input-name').value;
  const descField = document.getElementById('input-desc').value;
  if (!nameField || !descField) {
    alert(`Name and description are required to create a product`);
    return;
  }
  const imageUrl = document.getElementById('image-url').value;
  const serviceUrl = document.getElementById('service-url').value;
  const body = {
    name : nameField,
    description : descField,
    type : "SERVICE",
    category : "SOFTWARE",
    image_url : imageUrl ? imageUrl : "https://example.com/streaming.jpg",
    home_url : serviceUrl ? serviceUrl : "https://example.com/home"
  }
  try {
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/catalogs/products", {
      body: JSON.stringify(body),
      headers: {
        "Authorization": "Bearer " + gAccessToken,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    if(response.status === 401 || response.status === 403){
        logout();
    }else if(response.status !== 200 && response.status !== 201) {
      throw new Error(response.status);
    }
    // Redirecting to the product creation page
    window.location.href = "../ProductDetailsPage/ProductDetails.html";
  } catch (error) {
    alert(error);
  }
}

function displayMainContent() {
  document.getElementById('content').classList.remove("hidden-display");
  document.getElementById('no-content').classList.add("hidden-display");
}

function hideMainContent() {
  document.getElementById('content').classList.add("hidden-display");
  document.getElementById('no-content').classList.remove("hidden-display");
}

function logout() {
  gAccessToken = '';
  window.localStorage.removeItem("subAccessToken");
  window.localStorage.removeItem("subClientId");
  hideMainContent();
}