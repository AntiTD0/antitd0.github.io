document.addEventListener("DOMContentLoaded", function() {
    // Load existing car posts from localStorage on page load
    displayCarListings();

    // Image preview handler
    document.getElementById('car-images').addEventListener('change', function(event) {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = ''; // Clear existing images

        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    });

    // Form submission handler
    document.getElementById('car-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const carModel = document.getElementById('car-model').value;
        const carPrice = document.getElementById('car-price').value;
        const carDescription = document.getElementById('car-description').value;
        const carImages = document.getElementById('car-images').files;

        // Validate form
        if (!carModel || !carPrice || !carDescription || carImages.length === 0) {
            alert('Please fill out all fields and upload images.');
            return;
        }

        // Create an object for the post
        const carPost = {
            model: carModel,
            price: carPrice,
            description: carDescription,
            images: []
        };

        // Convert images to base64 strings
        Array.from(carImages).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                carPost.images.push(e.target.result);
                if (carPost.images.length === carImages.length) {
                    saveCarPost(carPost);
                }
            };
            reader.readAsDataURL(file);
        });

        // Clear the form
        this.reset();
        document.getElementById('image-preview').innerHTML = '';
    });

    // Save post in localStorage and display it
    function saveCarPost(carPost) {
        const carListings = JSON.parse(localStorage.getItem('carListings')) || [];
        carListings.push(carPost);
        localStorage.setItem('carListings', JSON.stringify(carListings));
        displayCarListings();
    }

    // Display all car listings
    function displayCarListings() {
        const carListings = JSON.parse(localStorage.getItem('carListings')) || [];
        const carListingsContainer = document.getElementById('car-listings');
        carListingsContainer.innerHTML = '';

        carListings.forEach(post => {
            const listingDiv = document.createElement('div');
            listingDiv.className = 'listing';

            let imagesHtml = '';
            post.images.forEach(img => {
                imagesHtml += `<img src="${img}" alt="Car Image">`;
            });

            listingDiv.innerHTML = `
                <h3>${post.model} - $${post.price}</h3>
                <div class="details">
                    <p>${post.description}</p>
                </div>
                <div class="images">${imagesHtml}</div>
            `;

            carListingsContainer.appendChild(listingDiv);
        });
    }
});