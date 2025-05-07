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
});
