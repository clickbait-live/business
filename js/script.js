// Function to show popup with dynamic content
function showPopup(type) {
    const popup = document.getElementById('infoPopup');
    const title = document.getElementById('popupTitle');
    const content = document.getElementById('popupContent');
    
    // Set title based on button clicked
    switch(type) {
        case 'news':
            title.textContent = "Today's News Highlights";
            fetchNews(content);
            break;
        case 'neet':
            title.textContent = "NEET Preparation Question";
            fetchQuestion(content, 'neet');
            break;
        case 'jee':
            title.textContent = "JEE Preparation Question";
            fetchQuestion(content, 'jee');
            break;
        case 'ssc':
            title.textContent = "SSC Preparation Question";
            fetchQuestion(content, 'ssc');
            break;
        case 'health':
            title.textContent = "Health Tip of the Day";
            fetchHealthTip(content);
            break;
    }
    
    popup.style.display = 'block';
}

// Function to close popup
function closePopup() {
    document.getElementById('infoPopup').style.display = 'none';
}

// Fetch news from Indian news source (using RSS to JSON converter)
async function fetchNews(container) {
    container.innerHTML = "<p>Loading news...</p>";
    
    try {
        // Using an RSS to JSON proxy service
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.ndtv.com/rss/latest');
        const data = await response.json();
        
        let html = '<div class="news-container">';
        data.items.slice(0, 5).forEach(item => {
            html += `
                <div class="news-item">
                    <h3>${item.title}</h3>
                    <p>${item.description.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                    <a href="${item.link}" target="_blank">Read more</a>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = "<p>Couldn't load news. Please try again later.</p>";
        console.error("Error fetching news:", error);
    }
}

// Fetch exam questions (stored locally)
function fetchQuestion(container, examType) {
    // In a real implementation, you might fetch from a database
    // For now, using sample questions
    
    const questions = {
        neet: {
            question: "Which of the following is not a function of the liver?",
            options: ["A. Glycogenesis", "B. Detoxification", "C. Secretion of bile", "D. Secretion of digestive enzymes"],
            answer: "D. Secretion of digestive enzymes (This is done by pancreas)"
        },
        jee: {
            question: "If f(x) = x³ - 3x² + 3x - 1, then f(2) is equal to:",
            options: ["A. 0", "B. 1", "C. -1", "D. 2"],
            answer: "B. 1 (Solution: f(2) = 8 - 12 + 6 - 1 = 1)"
        },
        ssc: {
            question: "The 'Dandi March' was associated with which of the following movements?",
            options: ["A. Non-Cooperation Movement", "B. Civil Disobedience Movement", "C. Quit India Movement", "D. Swadeshi Movement"],
            answer: "B. Civil Disobedience Movement (1930)"
        }
    };
    
    const q = questions[examType];
    container.innerHTML = `
        <div class="question">
            <p><strong>Question:</strong> ${q.question}</p>
            <ul class="options">${q.options.map(opt => `<li>${opt}</li>`).join('')}</ul>
            <details>
                <summary>View Answer</summary>
                <p class="answer">${q.answer}</p>
            </details>
        </div>
    `;
}

// Sample health tip
function fetchHealthTip(container) {
    const tips = [
        "Drinking warm water with lemon in the morning aids digestion.",
        "Makhana (fox nuts) are rich in protein and low in cholesterol.",
        "Taking short breaks while studying improves retention.",
        "Proper hydration is essential for maintaining concentration."
    ];
    
    const todayTip = tips[new Date().getDay() % tips.length];
    container.innerHTML = `
        <div class="health-tip">
            <p>${todayTip}</p>
            <small>Health Tip of the Day</small>
        </div>
    `;
}

// Ad Popup Functionality - ALWAYS SHOW
document.addEventListener('DOMContentLoaded', function() {
    // Always show the ad after 1 second delay
    setTimeout(() => {
        document.getElementById('adPopup').style.display = 'flex';
    }, 1000);
    
    // Close button functionality
    document.querySelector('.close-ad').addEventListener('click', function() {
        document.getElementById('adPopup').style.display = 'none';
    });
    
    // Close when clicking outside ad content
    document.getElementById('adPopup').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    const travelBtn = document.getElementById('travelBtn');
    const menuBtn = document.getElementById('menuBtn');
    const travelContent = document.getElementById('travelContent');
    const menuContent = document.getElementById('menuContent');

    // Initially set both buttons as inactive
    travelBtn.classList.remove('active');
    menuBtn.classList.remove('active');
    travelContent.classList.remove('active');

    // Add event listeners to activate buttons when clicked
    travelBtn.addEventListener('click', function () {
        travelBtn.classList.add('active');
        menuBtn.classList.remove('active');
        travelContent.classList.add('active');
        menuContent.classList.remove('active');
    });

    menuBtn.addEventListener('click', function () {
        menuBtn.classList.remove('inactive');
        menuBtn.classList.add('active');
        travelBtn.classList.remove('active');
        menuContent.classList.add('active');
        travelContent.classList.remove('active');
    });

    // Shopping cart functionality
    const cart = [];
    const cartItemsList = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartModal = document.getElementById('cartModal');
    const cartButton = document.getElementById('cartButton');
    const closeCartModal = document.getElementById('closeCartModal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const DELIVERY_CHARGE = 15;

    // Show cart modal when "Your Cart" button is clicked
    cartButton.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
    });

    // Close cart modal
    closeCartModal.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.getAttribute('data-item');
            const price = parseFloat(this.getAttribute('data-price'));

            // Check if item already exists in the cart
            const existingItem = cart.find(cartItem => cartItem.item === item);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ item, price, quantity: 1 });
            }

            updateCart();

            // Show cart if it was hidden
            if (cartSection.classList.contains('hidden')) {
                cartSection.classList.remove('hidden');
            }
        });
    });

    function updateCart() {
        // Clear current items
        cartItemsList.innerHTML = '';

        // Add all items
        let total = 0;
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.item} (x${item.quantity})</span>
                <span>₹${item.price * item.quantity}</span>
                <div>
                    <button class="decrement-item" data-index="${index}">-</button>
                    <button class="increment-item" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">✕</button>
                </div>
            `;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        // Add event listeners to increment, decrement, and remove buttons
        document.querySelectorAll('.increment-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                updateCart();
            });
        });

        document.querySelectorAll('.decrement-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
                if (cart.length === 0) {
                    cartSection.classList.add('hidden');
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
                if (cart.length === 0) {
                    cartSection.classList.add('hidden');
                }
            });
        });

        // Update total with delivery charge
        if (cart.length > 0) {
            total += DELIVERY_CHARGE;
            cartTotal.textContent = `Total: ₹${total} (including ₹${DELIVERY_CHARGE} delivery charge)`;
            cartTotal.style.display = 'block';
        } else {
            cartTotal.style.display = 'none'; // Hide total when cart is empty
        }
    }

    // WhatsApp order confirmation
    const confirmOrderBtn = document.getElementById('confirmOrder');
    confirmOrderBtn.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Please add items to your order first');
            return;
        }

        const busNumber = prompt('Please enter your KSRTC bus number plate:');
        if (!busNumber) {
            alert('Bus number is required to place your order');
            return;
        }

        // Prepare WhatsApp message
        let message = 'Hello! I would like to order:\n\n';
        let total = 0;

        cart.forEach(item => {
            message += `- ${item.item} (x${item.quantity}): ₹${item.price * item.quantity}\n`;
            total += item.price * item.quantity;
        });

        total += DELIVERY_CHARGE;
        message += `\nTotal: ₹${total} (including ₹${DELIVERY_CHARGE} delivery charge)\n\n`;
        message += `Bus Number: ${busNumber}\n`;
        message += 'Estimated Arrival Time: [Your arrival time at Attingal Bus Stand]';

        // Redirect to WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/9539024555?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank'); // Open WhatsApp in a new tab
    });
});
