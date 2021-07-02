let productId = '';
let gPlanId = '';
let gAccessToken = '';

function main() {
    hideMainContent();
    const accessToken = window.localStorage.getItem("subAccessToken");
    if (accessToken) {
        gAccessToken = accessToken;
        displayMainContent();
        disableGetPlansButtonState();
        loadProducts();
    }
}

async function loadProducts() {
    const selectProducts = document.getElementById("select-product");
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/catalogs/products`, {
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

async function getPlans() {
    const plansTable = document.getElementById("plans-list-content");
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/plans?product_id=${productId}`, {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    const responseJson = await response.json();

    if (response.status === 200 && responseJson && responseJson.plans) {
        const plans = responseJson.plans;
        let plansHtmlContent = "";
        for (let i = 0; i < plans.length; i++) {
            plansHtmlContent += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td colspan="2">${plans[i].name} (${plans[i].id})</td>
                <td class="text-center">
                    <button type="button" class="btn btn-outline-primary mx-2" data-bs-toggle="modal"
                        data-bs-target="#detailsModal" data-bs-planId="${plans[i].id}">Details</button>
                    <button type="button" class="btn btn-outline-success mx-2" data-bs-toggle="modal"
                        data-bs-target="#activateModal" data-bs-planId="${plans[i].id}">Activate</button>
                    <button type="button" class="btn btn-outline-danger mx-2" data-bs-toggle="modal"
                        data-bs-target="#deactivateModal" data-bs-planId="${plans[i].id}">Deactivate</button>
                </td>
            </tr>
            `;
            plansHtmlContent += '<br>'
        }
        plansTable.innerHTML = plansHtmlContent;
        displayPlansList();
    } else if(response.status === 401 || response.status === 403) {
        logout();
    }
}

function onProductChangeSelectHandler() {
    const selectProducts = document.getElementById("select-product");
    productId = selectProducts.value;
    if (productId) {
        enableSubmitButtonState();
    } else {
        disableGetPlansButtonState();
    }
    console.log(productId);
}

function enableSubmitButtonState() {
    const getPlansButton = document.getElementById("get-plans-button");
    getPlansButton.disabled = false;
}

function disableGetPlansButtonState() {
    const getPlansButton = document.getElementById("get-plans-button");
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

function displayPlansList() {
    document.getElementById('plans-list').classList.remove("hidden-display");
    document.getElementById('no-plans').classList.add("hidden-display");
}

function hidePlansList() {
    document.getElementById('plans-list').classList.add("hidden-display");
    document.getElementById('no-plans').classList.remove("hidden-display");
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
    const planId = button.getAttribute('data-bs-planId');
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/plans/${planId}`, {
        headers: {
            "Authorization": "Bearer " + gAccessToken,
            "Content-Type": "application/json"
        }
    });
    const responseJson = await response.json();
    if(response.status === 200) {
        let plansHtmlContent = "";
        if(responseJson.id){
            plansHtmlContent += `<p><b>Plan Id</b> - ${responseJson.id}</p>`;
        }
        if(responseJson.product_id){
            plansHtmlContent += `<p><b>Product Id</b> - ${responseJson.product_id}</p>`;
        }
        plansHtmlContent += `<p><b>Share this URL with your customer</b> - <a href="${"http://localhost:5050/" + window.localStorage.getItem("subClientId") + "/" + planId}"  target="_blank">Shareable Link for Plan</a></p>`;
        const plan = responseJson.billing_cycles;
        const s1 = 'TRIAL';
        for (let i = 0; i < responseJson.billing_cycles.length; i++) {

            if(plan[i].hasOwnProperty('tenure_type')) {
                const s2 = plan[i].tenure_type.toString();
                if(s1==s2) {
                    var interval_unit = plan[i].frequency.interval_unit;
                    var interval_count = plan[i].frequency.interval_count;
                    plansHtmlContent  += `
                        <p>Free for ${interval_count} ${interval_unit}</p>
                        <p>Then
                    `;
                }else {
                    if(plan[i].hasOwnProperty('pricing_scheme')) {
                        var currency_code = plan[i].pricing_scheme.fixed_price.currency_code;
                        var value = plan[i].pricing_scheme.fixed_price.value;
                        var interval_unit = plan[i].frequency.interval_unit;
                        var interval_count = plan[i].frequency.interval_count;
                        var total_cycles = plan[i].total_cycles;
                        plansHtmlContent  += `
                            $${value} ${currency_code} for  ${interval_count}  ${interval_unit}, for  ${total_cycles} installments</p>
                        `;
                    }
                }
            }
        }
        plansHtmlContent += '<hr>'
        var setup_fee_code="", setup_fee_value = 0, tax;
        if(responseJson.hasOwnProperty('payment_preferences') && responseJson.payment_preferences.hasOwnProperty('setup_fee')){
            setup_fee_code = responseJson.payment_preferences.setup_fee.currency_code;
            setup_fee_value = responseJson.payment_preferences.setup_fee.value;
            plansHtmlContent += `
                <p><b>${responseJson.description} *</b> $0.00 USD</p>
                <p><b>One-Time setup fee *</b> $${setup_fee_value} ${setup_fee_code}</p>
            `;
        }
        if(responseJson.hasOwnProperty('taxes')) {
            tax = responseJson.taxes.percentage;
            plansHtmlContent += `
                *Includes a ${tax}% tax set by the merchant
                <hr>
            `;
        }
        plansHtmlContent += `
            <h5><b>Total $${setup_fee_value} ${setup_fee_code}</b></h5>
        `;
        document.getElementById('details-modal-content').innerHTML = plansHtmlContent;
    }else if(response.status === 401 || response.status === 403){
      logout();
    }
});

document.getElementById('activateModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const planId = button.getAttribute('data-bs-planId');
    gPlanId = planId;
});

document.getElementById('deactivateModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const planId = button.getAttribute('data-bs-planId');
    gPlanId = planId;
});

async function activatePlan() {
    try {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/plans/${gPlanId}/activate`, {
            headers: {
                "Authorization": "Bearer " + gAccessToken,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if(response.status === 401 || response.status === 403){
            logout();
        }else if(response.status !== 200 && response.status !== 201 && response.status !== 204) {
          throw new Error(response.status);
        }
        alert(`This plan with planId ${gPlanId} has been activated and can now receive subscriptions.`)
    } catch (error) {
        alert(error);
    }
}

async function deactivatePlan() {
    try {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/plans/${gPlanId}/deactivate`, {
            headers: {
                "Authorization": "Bearer " + gAccessToken,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if(response.status === 401 || response.status === 403){
            logout();
        }else if(response.status !== 200 && response.status !== 201 && response.status !== 204) {
          throw new Error(response.status);
        }
        alert(`This plan with planId ${gPlanId} has been deactivated.`)
    } catch (error) {
        alert(error);
    }
}
