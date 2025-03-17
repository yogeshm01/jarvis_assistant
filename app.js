const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const jarvisGifImg = document.getElementById('jarvis-gif-img');

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyCADkndPsA5ziLUR4_y-9KsfJLzvtEzKxs";
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

function speak(text) {
    const textSpeak = new SpeechSynthesisUtterance(text);
    textSpeak.rate = 0.8;
    textSpeak.volume = 1;
    textSpeak.pitch = 0.5;
    window.speechSynthesis.speak(textSpeak);
}

async function getAIResponse(message) {
    
    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: `You are JARVIS, a helpful AI assistant. Keep responses concise and friendly. User message: ${message}` }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            if (response.status === 401) {
                return "Invalid API key. Please check your Gemini API key.";
            }
            return "I encountered an error while processing your request. Please try again.";
        }

        const data = await response.json();
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Unexpected API response:', data);
            return "I received an unexpected response. Please try again.";
        }

        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Error getting AI response:', error);
        if (error.message.includes('Failed to fetch')) {
            return "I'm having trouble connecting to my AI services. Please check your internet connection.";
        }
        return "I encountered an unexpected error. Please try again in a moment.";
    }
}

function wishMe() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

function switchGif() {
    setTimeout(() => {
        jarvisGifImg.src = 'jarvis-main.gif';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    speak("Initializing JARVIS");
    setTimeout(() => {
        wishMe();
    }, 2000); // Wait 2 seconds before the greeting
});

window.addEventListener('load', () => {
    switchGif();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

async function takeCommand(message) {
    // Handle specific commands first
    if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak("Today's date is " + date);
    } else {
        // Get AI response for all other queries
        const aiResponse = await getAIResponse(message);
        speak(aiResponse);
        
        // If the query seems like a search request, also open Google search
        // if (message.includes('what is') || message.includes('who is') || message.includes('what are') || message.includes('how to')) {
        //     window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        // }
    }
}