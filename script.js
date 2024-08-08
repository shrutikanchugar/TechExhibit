document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const leftSplit = document.querySelector('.split.left');
    const rightSplit = document.querySelector('.split.right');

    let audioContext, analyser, audioInput, dataArray, bufferLength;

    function startListening() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                audioInput = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                audioInput.connect(analyser);
                analyser.fftSize = 256;
                bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                function detectClap() {
                    analyser.getByteTimeDomainData(dataArray);
                    let maxVal = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        if (dataArray[i] > maxVal) {
                            maxVal = dataArray[i];
                        }
                    }
                    if (maxVal > 200) { // Adjust this threshold based on testing
                        initiateTransition();
                    }
                    requestAnimationFrame(detectClap);
                }

                detectClap();
            })
            .catch(err => console.error('Error accessing microphone', err));
    }

    function initiateTransition() {
        welcomeScreen.classList.add('hidden');
        leftSplit.classList.add('transition');
        rightSplit.classList.add('transition');
        setTimeout(() => {
            window.location.href = 'welcome.html';
        }, 1000); // Match this with the CSS transition duration
    }

    // Start listening for clap on first user interaction
    document.body.addEventListener('click', () => {
        if (!audioContext) {
            startListening();
        }
    }, { once: true }); // The event listener will be removed after the first click
});
