let productId = '';
let gProductId = '';
let gAccessToken = '';

function main() {
    hideMainContent();
    const accessToken = window.localStorage.getItem("subAccessToken");
    if (accessToken) {
        gAccessToken = accessToken;
        displayMainContent();
        getProducts();
    }
}

async function getProducts() {
    const ProductsTable = document.getElementById("Products-list-content");
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/catalogs/products", {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    const responseJson = await response.json();

    if (response.status === 200 && responseJson && responseJson.products) {
        const Products = responseJson.products;
        let ProductsHtmlContent = "";
        for (let i = 0; i < Products.length; i++) {
            ProductsHtmlContent += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td colspan="2">${Products[i].name}</td>
                <td colspan="2">${Products[i].description}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-outline-primary mx-2" data-bs-toggle="modal"
                        data-bs-target="#detailsModal" data-bs-ProductId="${Products[i].id}">Details</button>
                </td>
            </tr>
            `;
            ProductsHtmlContent += '<br>'
        }
        ProductsTable.innerHTML = ProductsHtmlContent;
        displayProductsList();
    } else if(response.status === 401 || response.status === 403) {
        logout();
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

function displayProductsList() {
    document.getElementById('Products-list').classList.remove("hidden-display");
    document.getElementById('no-Products').classList.add("hidden-display");
}

function hideProductsList() {
    document.getElementById('Products-list').classList.add("hidden-display");
    document.getElementById('no-Products').classList.remove("hidden-display");
}

function logout() {
    gAccessToken = '';
    window.localStorage.removeItem("subAccessToken");
    window.localStorage.removeItem("subClientId");
    hideMainContent();
}

document.getElementById('detailsModal').addEventListener('show.bs.modal', async function (event) {
    document.getElementById('details-modal-content').innerHTML = "<p>Waiting for content</p>";
    const button = event.relatedTarget;
    const ProductId = button.getAttribute('data-bs-ProductId');
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/catalogs/products/${ProductId}`, {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    
    const responseJson = await response.json();

    if(response.status === 200) {
      var mainDiv = document.createElement("div");
      var p1 = document.createElement("p");
      p1.innerText = "Name: "+responseJson.name;
      var p2 = document.createElement("p");
      p2.innerHTML = "Description: "+responseJson.description;
      var p3 = document.createElement("p");
      p3.innerHTML = "Type: "+responseJson.type;
      mainDiv.appendChild(p1);
      mainDiv.appendChild(p2);
      mainDiv.appendChild(p3);
      document.getElementById('details-modal-content').innerHTML = mainDiv.innerHTML;
    }else if(response.status === 401 || response.status === 403){
      logout();
    }
});
