// Function to handle header active link based on current page
function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    navLinks.forEach(link => {
        if (link.href.includes(currentPath) && currentPath !== "/") {
            link.classList.add('active');
        } else if (currentPath === "/" && link.href.includes("index.html")) {
            link.classList.add('active');
        }
    });
}

// Data for destinations (simplified, in a real app this would come from an API or JSON file)
const destinationsData = [
    {
        id: 'sydney',
        type: 'city',
        name: 'Sydney, Australia',
        description: 'A beautiful coastal city with a relaxed atmosphere, featuring the Sydney Opera House, Harbour Bridge, and stunning beaches.',
        image: 'images/sydney.png',
        keywords: ['city', 'australia', 'opera house', 'beach', 'bridge', 'sydney'],
        currentTime: '' // Will be fetched dynamically
    },
    {
        id: 'rio',
        type: 'city',
        name: 'Rio de Janeiro, Brazil',
        description: 'Vibrant city known for its breathtaking landscapes, iconic Christ the Redeemer statue, and lively Carnival celebrations.',
        image: 'images/rio.png',
        keywords: ['city', 'brazil', 'christ the redeemer', 'carnival', 'sugarloaf mountain', 'rio'],
        currentTime: ''
    },
    {
        id: 'boracay-beach',
        type: 'beach',
        name: 'Boracay, Philippines',
        description: 'Famed for its stunning white sand beaches and vibrant nightlife.',
        image: 'images/beach_one.png',
        keywords: ['beach', 'philippines', 'white sand', 'island', 'tropical'],
        currentTime: ''
    },
    {
        id: 'maldives-beach',
        type: 'beach',
        name: 'Maldives',
        description: 'An island nation in the Indian Ocean, famous for its overwater bungalows, crystal-clear waters, and extensive reefs.',
        image: 'images/beach_two.png',
        keywords: ['beach', 'maldives', 'luxury', 'tropical', 'diving', 'resort'],
        currentTime: ''
    },
    {
        id: 'wat-arun-temple',
        type: 'temple',
        name: 'Wat Arun, Thailand',
        description: 'A Buddhist temple in Bangkok, Thailand, known for its intricate spire and riverside location.',
        image: 'images/temple_one.png',
        keywords: ['temple', 'thailand', 'bangkok', 'buddhist', 'culture'],
        currentTime: ''
    },
    {
        id: 'kinkaku-ji-temple',
        type: 'temple',
        name: 'Kinkaku-ji, Japan',
        description: 'The Golden Pavilion, a Zen Buddhist temple in Kyoto, Japan, famous for its stunning golden exterior.',
        image: 'images/temple_two.png',
        keywords: ['temple', 'japan', 'kyoto', 'zen', 'golden pavilion', 'buddhist'],
        currentTime: ''
    },
    // Add more destinations as needed
];

// Function to fetch current local time for a city (using a dummy API or a simple approximation for demo)
async function fetchLocalTime(city) {
    // In a real application, you'd use a robust timezone API like TimezoneDB, WorldTimeAPI, or Google Time Zone API.
    // For this example, we'll return a static or slightly varied time to demonstrate.
    console.log(`Attempting to fetch time for: ${city}`);
    try {
        // Dummy logic for demonstration:
        // You would replace this with an actual API call.
        // Example with a public API (might require API key or have rate limits):
        // const response = await fetch(`http://worldtimeapi.org/api/timezone/America/${city.replace(/\s/g, '_')}`);
        // if (!response.ok) throw new Error('Time API request failed');
        // const data = await response.json();
        // return new Date(data.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Simplified dummy time for demo
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} (Local Time)`;

    } catch (error) {
        console.error("Error fetching local time:", error);
        return 'Time N/A'; // Fallback if API fails
    }
}


// Function to display search results
async function displaySearchResults(query) {
    const searchResultsDiv = document.getElementById('search-results');
    if (!searchResultsDiv) return; // Exit if not on the home page

    searchResultsDiv.innerHTML = ''; // Clear previous results
    searchResultsDiv.classList.remove('hidden'); // Ensure results are visible

    const lowerCaseQuery = query.toLowerCase().trim();

    if (lowerCaseQuery === '') {
        searchResultsDiv.innerHTML = '<p class="initial-search-prompt">Please enter a valid search query.</p>';
        return;
    }

    let filteredDestinations = [];

    // Filter by specific types (beach, temple) or keywords
    if (lowerCaseQuery === 'beach' || lowerCaseQuery.includes('beaches')) {
        filteredDestinations = destinationsData.filter(d => d.type === 'beach');
    } else if (lowerCaseQuery === 'temple' || lowerCaseQuery.includes('temples')) {
        filteredDestinations = destinationsData.filter(d => d.type === 'temple');
    } else {
        // General keyword search
        filteredDestinations = destinationsData.filter(d =>
            d.name.toLowerCase().includes(lowerCaseQuery) ||
            d.description.toLowerCase().includes(lowerCaseQuery) ||
            d.keywords.some(keyword => keyword.includes(lowerCaseQuery))
        );
    }

    if (filteredDestinations.length > 0) {
        for (const destination of filteredDestinations) {
            // Fetch current time only for city types if applicable, or if needed for all
            if (destination.type === 'city') {
                destination.currentTime = await fetchLocalTime(destination.name.split(',')[0].trim());
            } else {
                destination.currentTime = ''; // Clear time for non-city results
            }

            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.innerHTML = `
                <img src="${destination.image}" alt="${destination.name}">
                <div class="search-result-info">
                    <h4>${destination.name}</h4>
                    <p>${destination.description}</p>
                    ${destination.currentTime ? `<p class="current-time">${destination.currentTime}</p>` : ''}
                    <a href="#" class="btn">Visit</a>
                </div>
            `;
            searchResultsDiv.appendChild(resultItem);
        }
    } else {
        searchResultsDiv.innerHTML = '<p class="initial-search-prompt">No destinations found matching your search.</p>';
    }
}


// Event Listeners for Search Bar (only on home page)
document.addEventListener('DOMContentLoaded', () => {
    setActiveLink(); // Set active class for current page link

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-button');
    const searchResultsDiv = document.getElementById('search-results');
    const contactForm = document.getElementById('contact-form'); // Get contact form

    if (searchButton && searchInput && searchResultsDiv) { // Only add if elements exist (on home page)
        searchButton.addEventListener('click', () => {
            displaySearchResults(searchInput.value);
        });

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                displaySearchResults(searchInput.value);
            }
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            searchResultsDiv.innerHTML = '<p class="initial-search-prompt">Please enter a valid search query.</p>';
            searchResultsDiv.classList.remove('hidden'); // Ensure prompt is visible
        });
    }

    // Contact Form Submission (only on contact page)
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const formStatus = document.getElementById('form-status');

            // Basic validation
            if (name && email && message) {
                // In a real application, you would send this data to a server
                // using fetch() or XMLHttpRequest.
                // Example:
                /*
                fetch('/submit-contact-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                        formStatus.style.color = 'var(--accent-color)'; // Green for success
                        contactForm.reset(); // Clear the form
                    } else {
                        formStatus.textContent = 'Failed to send message. Please try again later.';
                        formStatus.style.color = 'red';
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    formStatus.textContent = 'An error occurred. Please try again.';
                    formStatus.style.color = 'red';
                });
                */

                // For this demo, simulate success:
                formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
                formStatus.style.color = 'var(--accent-color)';
                contactForm.reset(); // Clear the form
                console.log('Form Submitted:', { name, email, message });

            } else {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.style.color = 'red';
            }
        });
    }
});