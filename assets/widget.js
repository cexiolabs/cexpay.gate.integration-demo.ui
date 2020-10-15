const widgetIframeId = 'cryptopay-widget';

window.addEventListener('message', (event) => widgetMessageHandler(event.data));

async function openPaymentPage(currency, amount) {
    try {
        const amountStr = amount ? amount :  document.querySelector('#deposit-amount').value;
        const { paymentURL } = await getPaymentURL(currency, amountStr);
        window.open(paymentURL);
    } catch (e) {
        alert('Cannot open payment widget. ' + e.message);
        console.error(e);
    }
}

async function openPaymentFrame(currency, amount) {
    try {
        const amountStr = amount ? amount :  document.querySelector('#deposit-amount').value;
        const { paymentURL } = await getPaymentURL(currency, amountStr);
        showWidget(paymentURL);
    } catch (e) {
        alert('Cannot open payment widget. ' + e.message);
        console.error(e);
    }
}

async function getPaymentURL(currency, amount) {
    let webAppLocation = window.location.toString();
    if (!webAppLocation.endsWith('/')) { webAppLocation += '/'; }
    const fetchResponse = await fetch(`${webAppLocation}api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, amount }),
    });

    if (fetchResponse.ok !== true) {
        throw new Error(`${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    const json = await fetchResponse.json();

    if (json.error) {
        throw new Error(json.error);
    }

    return json;
}

function widgetMessageHandler(data) {
    if (data.type === 'HIDE') {
        hideWidget();
    }
}

function showWidget(paymentURL) {
    let iframe = window.document.getElementById(widgetIframeId);
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = widgetIframeId;
        iframe.style.zIndex = '999999';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.position = 'fixed';
        iframe.style.display = 'block';
        iframe.style.top = 0;
        iframe.style.left = 0;
        iframe.frameBorder = "0"
        window.document.body.appendChild(iframe);
    }
    document.body.style.overflow = 'hidden';
    iframe.src = paymentURL;
}

function hideWidget() {
    const settedIfreme = window.document.getElementById(widgetIframeId)
    if (settedIfreme) {
        settedIfreme.remove();
        document.body.style.overflow = 'auto';
    }
}