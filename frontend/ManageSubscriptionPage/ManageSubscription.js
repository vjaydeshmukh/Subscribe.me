let productId = '';
let gSubscriptionId = '';
let gAccessToken = '';

function main() {
    hideMainContent();
    const accessToken = window.localStorage.getItem("subAccessToken");
    if (accessToken) {
        gAccessToken = accessToken;
        displayMainContent();
    }
}

async function getTransactions() {
    var subscriptionId = document.getElementById("transaction-button").value;
    const et = (new Date()).toISOString();
    var date = new Date();
    date.setDate(date.getDate() - 7);
    const st = date.toISOString();
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${st}&end_time=${et}`, {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    const responseJson = await response.json();

    if (response.status === 200 && responseJson && responseJson.transactions) {
        const transactionsTable = document.getElementById("transactions-list-content");
        let transactionsHtmlContent = "";
        for (let i = 0; i < responseJson.transactions.length; i++) {
            transactionsHtmlContent += `
            <tr>
                <td scope="row">${i + 1}</th>
                <td colspan="2">${responseJson.transactions[i].id}</td>
                <td colspan="2">${responseJson.transactions[i].status}</td>
                <td colspan="2">${responseJson.transactions[i].payer_email}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-outline-primary mx-2" data-bs-toggle="modal"
                        data-bs-target="#transactionDetailsModal" data-bs-value="${responseJson.transactions[i].amount_with_breakdown.net_amount.value}" data-bs-currcode="${responseJson.transactions[i].amount_with_breakdown.net_amount.currency_code}"
                        data-bs-fname="${responseJson.transactions[i].payer_name.given_name}" data-bs-sname="${responseJson.transactions[i].payer_name.surname}"
                        data-bs-status="${responseJson.transactions[i].status}">Details</button>
                </td>
            </tr>
            `;
        }
        transactionsHtmlContent += '<br>'
        transactionsTable.innerHTML = transactionsHtmlContent;
        displayTransactionsList();
    } else if(response.status === 401 || response.status === 403) {
        console.log("Manage subscriptions : " + response.status);
        logout();
    } else{
        alert("Error with status code : " + response.status);
    }

}

async function getSubscription() {
    const subscriptionID = document.getElementById("subscription-id").value;
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}`, {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    const responseJson = await response.json();

    if (response.status === 200 && responseJson) {
        const subscriptionTable = document.getElementById("subscription-list-content");
        let subscriptionHtmlContent = "";
        subscriptionHtmlContent += `
            <h2 class="text-center">${responseJson.id}</h2><br>
            <p class="text-center">
                <button type="button" class="btn btn-outline-primary mx-2" data-bs-toggle="modal"
                    data-bs-target="#detailsModal" data-bs-subscriptionId="${responseJson.id}">Details</button>
                <button type="button" class="btn btn-outline-warning mx-2" onclick="getTransactions()" id="transaction-button" value="${responseJson.id}">Transactions</button>
                <button type="button" class="btn btn-outline-success mx-2" data-bs-toggle="modal"
                    data-bs-target="#activateModal" data-bs-subscriptionId="${responseJson.id}">Activate</button>
                <button type="button" class="btn btn-outline-danger mx-2" data-bs-toggle="modal"
                    data-bs-target="#deactivateModal" data-bs-subscriptionId="${responseJson.id}">Suspend</button>
                <button type="button" class="btn btn-outline-danger mx-2" data-bs-toggle="modal"
                    data-bs-target="#cancelModal" data-bs-subscriptionId="${responseJson.id}">Cancel</button>
            </p>
        `;
        subscriptionHtmlContent += '<br>'
        subscriptionTable.innerHTML = subscriptionHtmlContent;
        displaySubscriptionsList();
    } else {
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

function displaySubscriptionsList() {
    document.getElementById('subscription-list').classList.remove("hidden-display");
    document.getElementById('no-subscription').classList.add("hidden-display");
}

function hideSubscriptionsList() {
    document.getElementById('subscription-list').classList.add("hidden-display");
    document.getElementById('no-subscription').classList.remove("hidden-display");
}

function displayTransactionsList() {
    document.getElementById('transactions-list').classList.remove("hidden-display");
    document.getElementById('no-transactions').classList.add("hidden-display");
}

function hideTransactionsList() {
    document.getElementById('transactions-list').classList.add("hidden-display");
    document.getElementById('no-transactions').classList.remove("hidden-display");
}

function logout() {
    gAccessToken = '';
    window.localStorage.removeItem("subAccessToken");
    window.localStorage.removeItem("subClientId");
    hideMainContent();
}

document.getElementById('transactionDetailsModal').addEventListener('show.bs.modal', async function (event) {
    document.getElementById('transaction-details-modal-content').innerHTML = "<p>Waiting for content</p>";
    const button = event.relatedTarget;
    const currcode = button.getAttribute('data-bs-currcode');
    const value = button.getAttribute('data-bs-value');
    const fname = button.getAttribute('data-bs-fname');
    const sname = button.getAttribute('data-bs-sname');
    const status = button.getAttribute('data-bs-status');
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    /* const et = (new Date()).toISOString();
    var date = new Date();
    date.setDate(date.getDate() - 7);
    const st = date.toISOString();
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${st}&end_time=${et}`, {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    const responseJson = await response.json();
    console.log(responseJson);*/
    var mainDiv = document.createElement("div");
    var p1 = document.createElement("p");
    p1.innerText = "Payer Name: "+fname + " " + sname;
    var p2 = document.createElement("p");
    p2.innerHTML = "Net Amount: "+value + " " + currcode;
    var p3 = document.createElement("p");
    p3.innerHTML = "Transaction Status: "+status;

    mainDiv.appendChild(p1);
    mainDiv.appendChild(p2);
    mainDiv.appendChild(p3);
    document.getElementById('transaction-details-modal-content').innerHTML = mainDiv.innerHTML;

});

document.getElementById('detailsModal').addEventListener('show.bs.modal', async function (event) {
    document.getElementById('details-modal-content').innerHTML = "<p>Waiting for content</p>";
    const button = event.relatedTarget;
    const subscriptionId = button.getAttribute('data-bs-subscriptionId');

    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    const responseJson = await response.json();


    if(response.status === 200) {
        var mainDiv = document.createElement("div");
      var p1 = document.createElement("p");
      p1.innerText = "Subscription ID: "+responseJson.id;
      var p2 = document.createElement("p");
      p2.innerHTML = "Status: "+responseJson.status;
      var p3 = document.createElement("p");
      p3.innerHTML = "Plan ID: "+responseJson.plan_id;
      mainDiv.appendChild(p1);
      mainDiv.appendChild(p2);
      mainDiv.appendChild(p3);
      document.getElementById('details-modal-content').innerHTML = mainDiv.innerHTML;
    }else{
      logout();
    }
});

document.getElementById('activateModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const subscriptionId = button.getAttribute('data-bs-subscriptionId');
    gSubscriptionId = subscriptionId;
});

document.getElementById('deactivateModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const subscriptionId = button.getAttribute('data-bs-subscriptionId');
    gSubscriptionId = subscriptionId;
});

document.getElementById('cancelModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const subscriptionId = button.getAttribute('data-bs-subscriptionId');
    gSubscriptionId = subscriptionId;
});

async function activateSubscription() {
    try {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${gSubscriptionId}/activate`, {
            headers: {
                "Authorization": "Bearer " + gAccessToken,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if(response.status === 401 || response.status === 403){
            logout();
        }else if(response.status !== 204){
          throw new Error(response.status);
        }
        alert(`This subscription with Id ${gSubscriptionId} has been activated.`)
    } catch (error) {
        alert(error);
    }
}

async function deactivateSubscription() {
    try {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${gSubscriptionId}/suspend`, {
            headers: {
                "Authorization": "Bearer " + gAccessToken,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if(response.status === 401 || response.status === 403){
            logout();
        }else if(response.status !== 204){
          throw new Error(response.status);
        }
        alert(`This subscription with Id ${gSubscriptionId} has been suspended.`)
    } catch (error) {
      alert(error);
    }
}

async function cancelSubscription() {
    try {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${gSubscriptionId}/cancel`, {
            headers: {
                "Authorization": "Bearer " + gAccessToken,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if(response.status === 401 || response.status === 403){
            logout();
        }else if(response.status !== 204){
          throw new Error(response.status);
        }
        alert(`This subscription with Id ${gSubscriptionId} has been cancelled.`)
    } catch (error) {
      alert(error);
    }
}
