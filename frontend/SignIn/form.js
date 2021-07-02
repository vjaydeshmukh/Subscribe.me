// function main() {
//   localStorage.removeItem("subAccessToken");
// }

async function setLocalStorage() {
  const loginButton = document.getElementById("login-button");
  loginButton.disabled = true;
  event.preventDefault()
  const clientId = document.getElementById("clientId").value;
  const clientSecret = document.getElementById("clientSecret").value;
    const reqHeader = new Headers();
    reqHeader.append("Authorization", "Basic " + btoa(clientId + ":" + clientSecret));
    reqHeader.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
      method: 'POST',
      headers: reqHeader,
      body: urlencoded,
      redirect: 'follow'
    };

    const response =  await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", requestOptions);
    const responseJson = await response.json();
    // const responseJson = JSON.parse(`{
    //   "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund https://api-m.paypal.com/v1/vault/credit-card https://api-m.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://api-m.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
    //   "access_token": "A21AAFEpH4PsADK7qSS7pSRsgzfENtu-Q1ysgEDVDESseMHBYXVJYE8ovjj68elIDy8nF26AwPhfXTIeWAZHSLIsQkSYz9ifg",
    //   "token_type": "Bearer",
    //   "app_id": "APP-80W284485P519543T",
    //   "expires_in": 31668,
    //   "nonce": "2020-04-03T15:35:36ZaYZlGvEkV4yVSz8g6bAKFoGSEzuy3CQcz3ljhibkOHg"
    //   }`);

    if (response.status === 200 && responseJson && responseJson.access_token) {
      // console.log("hi");
      localStorage.setItem("subAccessToken", responseJson.access_token);
      localStorage.setItem("subClientId", clientId);
      // Redirecting to the product creation page
      window.location.href = "../ProductCreationPage/ProductCreation.html";
    }
    else {
      alert("Please try again!");
      localStorage.removeItem("subAccessToken");
      loginButton.disabled = false;
    }
}
