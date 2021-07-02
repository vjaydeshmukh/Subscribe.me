# PayPal Subscriptions 
*Subscriptions Management App*

## Working flow of our application:
## 'Authentication' Page 
- Generate an auth_token with the client_id and secret (`POST - /v1/oauth2/token`)
- All pages except 'Suscribe' are authorized

## 'Create a Service' Page (Product Creation Page) - Authorized
- Create a new Product (Service) with respective name and description fields (`POST - /v1/catalogs/products`)
- Redirects to 'View Service Details' Page

## 'View Service Details' Page (Product Details Page) - Authorized
- List all the Products (Services) created by the authorized user (`GET - /v1/catalogs/products`)
- For each of the Products (Services), details can also be fetched (`GET - /v1/catalogs/products/{productId}`)

## 'Create a Plan' Page (Plan Creation Page) - Authorized
- Select a Product (Service) from the list of created Products (`GET - /v1/catalogs/products`)
- Create a new plan for the Product (Service) selected (`POST - /v1/billing/plans`)

## 'View Plan Details' Page (Plan Details Page) - Authorized
- Fetch the list of plans created by the user (`GET - /v1/billing/plans`)
- For each of the plan, the details can also be fetched (`GET - /v1/billing/plans/{planId}`)
- Any of the plans, can be activated or deactivated (`POST - /v1/billing/plans/{planId}/activate` and `POST - /v1/billing/plans/{planId}/deactivate`)

## 'Subscribe' Page - Not Authorized 
### (Any user, with a merchant provided URL will be able to subscribe to a plan)
- Using PayPal Smart Payment Buttons, `createSubscription` was implemented, to call `actions.subscription.create()` to subscribe the user to the given plan (`POST - /v1/billing/subscriptions`)

## 'Manage Subscriptions' Page - Authorized 
- Given the subscriptionId, we can obtain the details of a subscription (`GET - /v1/billing/subscriptions/{subscriptionId}`)
- The respective subscription can also be activated or suspended or even, cancelled 
    - (`POST - /v1/billing/subscriptions/{subscriptionId}/activate`)
    - (`POST - /v1/billing/subscriptions/{subscriptionId}/suspend`)
    - (`POST - /v1/billing/subscriptions/{subscriptionId}/cancel`)

- With the subscriptionId, we can obtain the list of transactions for a subscription (`GET - /v1/billing/subscriptions/{subscriptionId}/transaction?start_time&end_time`)
- With the transactionId, we can obtain the details of a transaction (`GET - /v1/billing/subscriptions/{subscriptionId}/transaction?start_time&end_time`)

Note: All HTTP requests have been made using `fetch()` API 

## Setup Instructions

- **Front-end**:
Open `frontend/SignIn/SignIn.html` in your browser of choice

- **Back-end**:
    1. Open your terminal in the `backend` folder,
    2. Run `npm install` to download the dependencies
    3. Run `npm run dev` to run the server in the dev environment. (Runs in port 5050 by default)
