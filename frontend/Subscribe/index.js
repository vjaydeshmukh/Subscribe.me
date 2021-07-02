

function verify(){
  const clientId=document.getElementById("clientId").value
  const url=`https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`
  loadScript(url, function() {
    alert("Here is your clientId"+ clientId);
    paypal.Buttons({

      createSubscription: function(data, actions) {

        return actions.subscription.create({

          'plan_id': document.getElementById("planId").value

        });

      },


      onApprove: function(data, actions) {

        alert('You have successfully created subscription ' + data.subscriptionID);

      }


    }).render('#paypal-button-container');
    // here you can use anything you defined in the loaded script
});
}
function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}







/* paypal.Buttons({

    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units : [{
                amount: {
                    value: '0.1'
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            console.log(details)

        })
    },
    onCancel: function (data) {
        alert("cancelled")
    } */
