const btn = document.querySelector('talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speech = new SpeechSynthesisUtterance(text);
    text_speech.rate = 0.5;
    text_speech.pitch = 0.7;
    text_speech.volume = 1;
    window.speechSynthesis.speak(text_speech);
}

function wishme(){
    let day = new Date();
    let hour = day.getHours();

    if (hour >= 0 && hour < 12){
        speak('Good Morning Boss...');
    }
    else if (hour >=12 && hour<17){
        speak('Good Afternoon Boss...');
    }
    else{
        speak('Good Evening Bosss...');
    }
}

window.addEventListener('load', () => {
    speak("Initializing Jarvis...");
    wishme();
})

