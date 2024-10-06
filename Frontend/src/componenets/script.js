const fetchOptions = {
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,/;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Host': 'api.n2yo.com',
        'Priority': 'u=0, i',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0'
    }
};

// Perform the fetch request
fetch(apiUrl, fetchOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error(`"HTTP error! Status": ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        console.log('Satellite Position Data:', data); // Log the response data
    })
    .catch(error => {
        console.error('Error fetching satellite data:', error); // Handle errors
    });