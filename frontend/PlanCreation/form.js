
let productId = '';
let gPlanId = '';
let gAccessToken = '';

function main() {

  hideMainContent();
  const accessToken = window.localStorage.getItem("subAccessToken");
  if (accessToken) {
    gAccessToken = accessToken;
    displayMainContent();
    disableSubmitButtonState();
    loadProducts();
  }
}

async function loadProducts() {
  const selectProducts = document.getElementById("select-product");
  const response = await fetch("https://api-m.sandbox.paypal.com/v1/catalogs/products", {
    headers: {
      "Authorization": "Bearer " + gAccessToken,
      "Content-Type": "application/json"
    }
  });
  const responseJson = await response.json();

  if (response.status === 200 && responseJson && responseJson.products) {
    const products = responseJson.products;
    for (let product of products) {
      const productOption = document.createElement("option");
      productOption.text = `${product.name} - ${product.id.substr(-4)}`;
      productOption.value = product.id;
      selectProducts.add(productOption);
    }
    selectProducts.disabled = false;
  } else if(response.status === 401 || response.status === 403) {
    logout();
  }
}

async function createPlans() {
  const name = document.getElementById('inputName').value;
  const description = document.getElementById("inputDescription").value

  const regIntervalUnit = document.getElementById('interval2').value
  const regIntervalCount = document.getElementById('inputic2').value
  const regTenureType = document.getElementById('inputttype2').value
  const regSequence = document.getElementById('inputseq2').value
  const regTotalCycles = document.getElementById('inputtc2').value
  const regFixedpriceVal = document.getElementById('priceValue').value
  const regcurrency = document.getElementById('currency').value

  const regular = {
    "frequency": {
      "interval_unit": regIntervalUnit,
      "interval_count": regIntervalCount
    },
    "tenure_type": regTenureType,
    "sequence": regSequence,
    "total_cycles": regTotalCycles,
    "pricing_scheme": {
      "fixed_price": {
        "value": regFixedpriceVal,
        "currency_code": regcurrency
      }
    }
  }

  const service_type = document.getElementById('serviceType').value
  const auto_bill_outstanding = document.getElementById('autobill').checked;
  const fee = document.getElementById('fee').value
  const currency_code = document.getElementById('currencyCode').value
  const setup_fail = document.getElementById('feeFail').value
  const payment_failure_threshold = document.getElementById('failThreshold').value
  const quantity_supported = document.getElementById('quantity_supported').checked;
  console.log(quantity_supported);
  const percentage = document.getElementById('percentage').value
  const inclusive = document.getElementById('inclusive').checked

  const body = {
    "product_id": productId,
    "name": name,
    "description": description,
    "billing_cycles": [regular],
    "payment_preferences": {
      "service_type": service_type,
      "auto_bill_outstanding": auto_bill_outstanding,
      "setup_fee": {
        "value": fee,
        "currency_code": currency_code
      },
      "setup_fee_failure_action": setup_fail,
      "payment_failure_threshold": payment_failure_threshold
    },
    "quantity_supported": quantity_supported,
    "taxes": {
      "percentage": percentage,
      "inclusive": inclusive
    },
  }

  try {
    console.log(JSON.stringify(body))
    console.log(gAccessToken)
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/billing/plans", {
      body:JSON.stringify(body),
      headers: {
        "Accept": "application/json",
        Authorization: "Bearer " + gAccessToken,
        Prefer: "return=representation",
        "Content-Type": "application/json"
      },

      method: "POST"
    });
    const responseJson = await response.json();
    if(response.status === 401 || response.status === 403){
        logout();
    }else if(response.status !== 201){
      throw new Error(response.status);
    }
    // Redirecting to the product creation page
    window.location.href = "../PlanDetailsPage/PlanDetails.html";
  } catch (error) {
    console.log(error);
  }
  // if (responseJson && responseJson.id) {
  //   alert("Plan has been successfully created and the plan Id is" + responseJson.id);
  // }

}

function onProductChangeSelectHandler() {
  const selectProducts = document.getElementById("select-product");
  productId = selectProducts.value;
  if (productId) {
    enableSubmitButtonState();
  } else {
    disableSubmitButtonState();
  }
  console.log(productId);
}

function enableSubmitButtonState() {
  const getPlansButton = document.getElementById("submit-plan");
  getPlansButton.disabled = false;
}

function disableSubmitButtonState() {
  const getPlansButton = document.getElementById("submit-plan");
  getPlansButton.disabled = true;
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
