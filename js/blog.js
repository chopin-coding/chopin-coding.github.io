async function gql() {
    "use strict";

    const cachedData = localStorage.getItem('cachedData');
    const cachedTimestamp = localStorage.getItem('cachedTimestamp');
    const currentTime = Date.now();

    if (cachedData && cachedTimestamp && currentTime - parseInt(cachedTimestamp) <= TTL) {
        return JSON.parse(cachedData);
    }

    const query = `
    {
        user(username: "chopin") {
            publication {
                posts(page: 0) {
                    title
                    brief
                    slug
                    dateAdded
                    readTime
                }
            }
        }
    }`;

    try {
        const response = await fetch('https://api.hashnode.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                page: 0,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('cachedData', JSON.stringify(data));
            localStorage.setItem('cachedTimestamp', currentTime.toString());
            return data; // Return the data
        } else {
            console.error('Error fetching blogs');
            return false;
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return false;
    }
}

const TTL = 300000; // 5 minute TTL for the cache

function formatHashnodeDate(hashnodeDate) {
  const date = new Date(hashnodeDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return formattedDate;
}
