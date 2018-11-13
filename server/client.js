// const vapidPublicKey = 'WWq6EPB5aIL30A5rSDPa0Z2sx6WmLvXCOgsjshIAEHY';

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//       this.navigator.serviceWorker.register('./worker.js').then( (registration) => {
//         console.log('serviceWorker Register', registration.scope);
//       }, function(err) {
//         console.log(err);
//       })
    
//     })

// }

// async function send() {
//     //Register Service Worker
//     console.log('Registering service worker...');
//     const register = await navigator.serviceWorker.register('/worker.js', {
//       scope: '/'
//     });
//     console.log('Service Worker Registered...');
  
//     //Register Push
//     console.log('Register Push');
//     const subscription = await register.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
//     });
//     console.log('Push Register....');
  
//     //Send Push Notification
//     console.log('Sending Push...');
//     await fetch('/status/:id', {
//         method: "PUT",
//         body: JSON.stringify(subscription),
//         headers: {
//             "content-type": "application/json"
//         }
//     });
//     console.log("Push Send");
//   }
//   function urlBase64ToUint8Array(base64String) {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//       .replace(/\-/g, '+')
//       .replace(/_/g, '/');
   
//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);
   
//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
//   }
// module.exports = send();