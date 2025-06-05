import Swal from "sweetalert2";

const Detection = {
    // Constants
    MODEL_PATH: './models/sign_language/model.json',
    IMAGE_SIZE: 224,
    CLASS_NAMES: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'W', 'X', 'Y', 'Z', 'del', 'blank', 'space'],
    HAND_CONNECTIONS: [
        [0, 1], [1, 2], [2, 3], [3, 4], // thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // index finger
        [0, 9], [9, 10], [10, 11], [11, 12], // middle finger
        [0, 13], [13, 14], [14, 15], [15, 16], // ring finger
        [0, 17], [17, 18], [18, 19], [19, 20], // pinky
        [0, 5], [5, 9], [9, 13], [13, 17], // palm
    ],
    PRED_QUEUE_MAXLEN: 7,

    async render() {
        return `
            <!DOCTYPE html>
            <div class="min-h-screen bg-[#FAF5E5]">
                <!-- Required Libraries -->
                <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.min.js" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>

                <!-- Header/Navbar -->
                <header class="bg-white shadow">
                    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
                        <a href="#" class="w-36 md:w-40">
                            <img src="../img/logo-tabir.png" alt="Logo" />
                        </a>
                        <div class="flex items-center gap-4">
                            <button id="backBtn" class="text-[#013366] hover:text-[#4A708B]">Back</button>
                        </div>
                    </nav>
                </header>

                <!-- Main Content -->
                <main class="container mx-auto px-4 py-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h1 class="text-2xl font-bold text-[#013366] mb-6">Deteksi Bahasa Isyarat</h1>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Live Camera Section -->
                            <div class="bg-[#7A8052] text-white p-6 rounded-lg">
                                <h2 class="text-xl font-semibold mb-4">Live Camera</h2>
                                <div class="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                                    <video id="videoInput" style="opacity: 0; position: absolute; pointer-events: none"></video>
                                    <canvas id="webcam" class="w-full h-full object-contain"></canvas>
                                </div>
                                <div class="flex gap-4">
                                    <button id="startButton"
                                        class="bg-white text-[#7A8052] px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                                        Mulai Deteksi
                                    </button>
                                    <button id="stopButton"
                                        class="bg-white text-[#7A8052] px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                                        disabled>
                                        Hentikan Deteksi
                                    </button>
                                </div>
                            </div>

                            <!-- Results Section -->
                            <div class="bg-[#4A708B] text-white p-6 rounded-lg">
                                <h2 class="text-xl font-semibold mb-4">Hasil Deteksi</h2>
                                <textarea id="output_text" class="w-full h-48 p-4 rounded-lg bg-white/90 text-gray-800 resize-none"
                                    placeholder="Hasil deteksi akan muncul di sini..." readonly></textarea>
                                <p id="loadingStatus" class="mt-4 text-sm italic">
                                    Klik "Mulai Deteksi" untuk memuat model dan memulai webcam.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    async afterRender() {
        // Initialize state
        this.state = {
            model: null,
            hands: null,
            stream: null,
            animationFrameId: null,
            isDetecting: false,
            predQueue: [],
            lastStableLabel: ""
        };

        // Get DOM elements
        this.elements = {
            video: document.getElementById('videoInput'),
            canvasElement: document.getElementById('webcam'),
            outputText: document.getElementById('output_text'),
            startButton: document.getElementById('startButton'),
            stopButton: document.getElementById('stopButton'),
            loadingStatus: document.getElementById('loadingStatus'),
            backBtn: document.getElementById('backBtn')
        };

        // Set canvas size
        this.elements.canvasElement.width = 640;
        this.elements.canvasElement.height = 480;
        this.elements.canvasCtx = this.elements.canvasElement.getContext('2d');

        // Bind methods
        this.startDetection = this.startDetection.bind(this);
        this.stopDetection = this.stopDetection.bind(this);
        this.detectLoop = this.detectLoop.bind(this);
        this.onHandsResults = this.onHandsResults.bind(this);

        // Add event listeners
        this.elements.startButton.addEventListener('click', () => {
            this.startDetection();
        });
        this.elements.stopButton.addEventListener('click', () => {
            Swal.mixin({
                toast: true,
                position: "bottom-right",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
                }
            }).fire({
                icon: "warning",
                title: "Deteksi dihentikan",
            });
            this.stopDetection();
        });
        this.elements.backBtn.addEventListener('click', () => {
            this.stopDetection();
            window.location.hash = '#/dashboard';
        });

        // Load required libraries
        await this.loadLibraries();
    },

    async loadLibraries() {
        // Load TensorFlow.js if not already loaded
        if (!window.tf) {
            const tfScript = document.createElement('script');
            tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
            document.head.appendChild(tfScript);
            await new Promise(resolve => tfScript.onload = resolve);
        }

        // Load MediaPipe Hands if not already loaded
        if (!window.Hands) {
            const handsScript = document.createElement('script');
            handsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.min.js';
            document.head.appendChild(handsScript);
            await new Promise(resolve => handsScript.onload = resolve);
        }

        // Load MediaPipe Drawing Utils
        if (!window.drawConnectors) {
            const drawingScript = document.createElement('script');
            drawingScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
            document.head.appendChild(drawingScript);
            await new Promise(resolve => drawingScript.onload = resolve);
        }
    },

    async loadSignLanguageModel() {
        try {
            this.elements.loadingStatus.innerText = 'Memuat model deteksi isyarat...';
            console.log(`Attempting to load GraphModel from: ${this.MODEL_PATH}`);
            this.state.model = await tf.loadGraphModel(this.MODEL_PATH);

            // Warmup model
            const dummyTensor = tf.zeros([1, this.IMAGE_SIZE, this.IMAGE_SIZE, 3]);
            let result;
            try {
                console.log("Attempting warmup with model.execute()...");
                const inputs = {};
                inputs['keras_tensor_1766'] = dummyTensor;
                result = this.state.model.execute(inputs);
                console.log("Warmup with model.execute() likely succeeded.");
            } catch (e) {
                console.warn("Warmup with model.execute() failed, trying model.predict():", e);
                result = this.state.model.predict(dummyTensor);
            }

            if (Array.isArray(result)) result.forEach(t => tf.dispose(t));
            else if (result instanceof tf.Tensor) result.dispose();
            else if (typeof result === 'object' && result !== null) {
                Object.values(result).forEach(t => { if (t instanceof tf.Tensor) tf.dispose(t); });
            }
            tf.dispose(dummyTensor);

            this.elements.loadingStatus.innerText = 'Model deteksi isyarat berhasil dimuat.';
            console.log('Sign language model (GraphModel) loaded successfully.');
            return this.state.model;
        } catch (error) {
            console.error('Fatal error loading sign language model (GraphModel):', error);
            this.elements.loadingStatus.innerText = 'Gagal memuat model! Periksa konsol.';
            if (error.message) {
                this.elements.loadingStatus.innerText += ` Error: ${error.message.substring(0, 100)}...`;
            }
            return null;
        }
    },

    loadMediaPipeHands() {
        this.elements.loadingStatus.innerText = 'Memuat model deteksi tangan (MediaPipe)...';
        this.state.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        this.state.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.8,
            minTrackingConfidence: 0.7
        });
        this.state.hands.onResults((results) => this.onHandsResults(results));
        this.elements.loadingStatus.innerText = 'Model deteksi tangan berhasil dimuat.';
        console.log('MediaPipe Hands loaded');
    },

    async startDetection() {
        try {
            // Load model if needed
            if (!this.state.model) {
                this.state.model = await this.loadSignLanguageModel();
            }
            if (!this.state.hands) {
                this.loadMediaPipeHands();
            }

            // Start camera
            this.state.stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false
            });

            // Set up video
            this.elements.video.srcObject = this.state.stream;
            await this.elements.video.play();

            // Update state and UI
            this.state.isDetecting = true;
            this.elements.startButton.disabled = true;
            this.elements.stopButton.disabled = false;
            this.elements.loadingStatus.innerText = 'Deteksi berjalan...';

            // Start detection loop
            this.detectLoop();
        } catch (error) {
            console.error('Error starting detection:', error);
            this.elements.loadingStatus.innerText = 'Error memulai deteksi. Silakan coba lagi.';
            this.stopDetection();
        }
    },

    stopDetection() {
        // Stop detection loop
        this.state.isDetecting = false;
        if (this.state.animationFrameId) {
            cancelAnimationFrame(this.state.animationFrameId);
        }

        // Stop camera
        if (this.state.stream) {
            this.state.stream.getTracks().forEach(track => track.stop());
            this.state.stream = null;
        }
        this.elements.video.srcObject = null;

        // Reset UI
        this.elements.startButton.disabled = false;
        this.elements.stopButton.disabled = true;
        this.elements.canvasCtx.clearRect(0, 0, this.elements.canvasElement.width, this.elements.canvasElement.height);
        this.elements.outputText.value = "";
        this.elements.loadingStatus.innerText = 'Deteksi dihentikan. Tekan Mulai Deteksi jika ingin mendeteksi lagi';

        // Reset state
        this.state.predQueue = [];
        this.state.lastStableLabel = "";
    },

    async detectLoop() {
        // If we're not detecting anymore, stop the loop
        if (!this.state.isDetecting) {
            console.log('Detection stopped, ending loop');
            return;
        }

        // Check if we have all required resources
        if (this.elements.video.paused ||
            this.elements.video.ended ||
            !this.state.hands ||
            !this.state.model ||
            this.elements.video.readyState < this.elements.video.HAVE_ENOUGH_DATA) {

            console.log('Missing required resources, retrying...');
            this.state.animationFrameId = requestAnimationFrame(() => this.detectLoop());
            return;
        }

        try {
            await this.state.hands.send({ image: this.elements.video });
        } catch (e) {
            console.error("Error sending frame to MediaPipe Hands:", e);
        }

        // Only request next frame if we're still detecting
        if (this.state.isDetecting) {
            this.state.animationFrameId = requestAnimationFrame(() => this.detectLoop());
        } else {
            console.log('Detection stopped during loop');
        }
    },

    async onHandsResults(results) {
        const { canvasCtx, canvasElement, video, outputText } = this.elements;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.translate(canvasElement.width, 0);
        canvasCtx.scale(-1, 1);
        canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.restore();

        let labelToDrawOnFrame = "Processing...";

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // Calculate bounding box in video coordinates
            let videoMinX = video.videoWidth, videoMinY = video.videoHeight;
            let videoMaxX = 0, videoMaxY = 0;
            for (const landmark of landmarks) {
                const x = landmark.x * video.videoWidth;
                const y = landmark.y * video.videoHeight;
                videoMinX = Math.min(videoMinX, x);
                videoMinY = Math.min(videoMinY, y);
                videoMaxX = Math.max(videoMaxX, x);
                videoMaxY = Math.max(videoMaxY, y);
            }

            const margin = 25;
            const handRectXOriginal = Math.max(0, videoMinX - margin);
            const handRectYOriginal = Math.max(0, videoMinY - margin);
            const handRectWidthOriginal = Math.min(
                video.videoWidth - handRectXOriginal,
                (videoMaxX - videoMinX) + 2 * margin
            );
            const handRectHeightOriginal = Math.min(
                video.videoHeight - handRectYOriginal,
                (videoMaxY - videoMinY) + 2 * margin
            );

            if (handRectWidthOriginal > 0 && handRectHeightOriginal > 0) {
                // Create offscreen canvas for hand region
                const offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = handRectWidthOriginal;
                offscreenCanvas.height = handRectHeightOriginal;
                const offscreenCtx = offscreenCanvas.getContext('2d');
                offscreenCtx.drawImage(
                    video,
                    handRectXOriginal,
                    handRectYOriginal,
                    handRectWidthOriginal,
                    handRectHeightOriginal,
                    0,
                    0,
                    handRectWidthOriginal,
                    handRectHeightOriginal
                );
                const handImageData = offscreenCtx.getImageData(
                    0,
                    0,
                    handRectWidthOriginal,
                    handRectHeightOriginal
                );

                // Draw landmarks and connections
                const flippedLandmarks = landmarks.map(lm => ({
                    x: 1 - lm.x,
                    y: lm.y,
                    z: lm.z
                }));

                // Calculate display coordinates for bounding box
                let displayMinX = canvasElement.width, displayMinY = canvasElement.height;
                let displayMaxX = 0, displayMaxY = 0;
                for (const landmark of flippedLandmarks) {
                    const x = landmark.x * canvasElement.width;
                    const y = landmark.y * canvasElement.height;
                    displayMinX = Math.min(displayMinX, x);
                    displayMinY = Math.min(displayMinY, y);
                    displayMaxX = Math.max(displayMaxX, x);
                    displayMaxY = Math.max(displayMaxY, y);
                }

                const displayHandRectX = Math.max(0, displayMinX - margin);
                const displayHandRectY = Math.max(0, displayMinY - margin);
                const displayHandRectWidth = Math.min(
                    canvasElement.width - displayHandRectX,
                    (displayMaxX - displayMinX) + 2 * margin
                );
                const displayHandRectHeight = Math.min(
                    canvasElement.height - displayHandRectY,
                    (displayMaxY - displayMinY) + 2 * margin
                );

                // Draw bounding box
                if (displayHandRectWidth > 0 && displayHandRectHeight > 0) {
                    canvasCtx.strokeStyle = 'lime';
                    canvasCtx.lineWidth = 2;
                    canvasCtx.strokeRect(
                        displayHandRectX,
                        displayHandRectY,
                        displayHandRectWidth,
                        displayHandRectHeight
                    );
                }

                // Draw hand landmarks
                if (window.drawConnectors && window.drawLandmarks) {
                    drawConnectors(
                        canvasCtx,
                        flippedLandmarks,
                        this.HAND_CONNECTIONS,
                        { color: '#00FF00', lineWidth: 2 }
                    );
                    drawLandmarks(
                        canvasCtx,
                        flippedLandmarks,
                        { color: '#FF0000', lineWidth: 1, radius: 3 }
                    );
                }

                // Model prediction
                let handTensorForModel = tf.browser.fromPixels(handImageData);
                let resizedTensorForModel = tf.image.resizeBilinear(
                    handTensorForModel,
                    [this.IMAGE_SIZE, this.IMAGE_SIZE]
                );
                let normalizedTensorForModel = resizedTensorForModel.div(tf.scalar(255.0));
                let batchedTensorForModel = normalizedTensorForModel.expandDims(0);

                handTensorForModel.dispose();
                resizedTensorForModel.dispose();
                normalizedTensorForModel.dispose();

                let modelOutput;
                try {
                    const inputs = {};
                    inputs['keras_tensor_1766'] = batchedTensorForModel;
                    modelOutput = this.state.model.execute(inputs);
                } catch (e) {
                    console.warn("model.execute failed, trying model.predict:", e);
                    modelOutput = this.state.model.predict(batchedTensorForModel);
                }
                batchedTensorForModel.dispose();

                let predictionTensor;
                if (Array.isArray(modelOutput) && modelOutput.length > 0 && modelOutput[0] instanceof tf.Tensor) {
                    predictionTensor = modelOutput[0];
                    modelOutput.slice(1).forEach(t => {
                        if (t instanceof tf.Tensor) t.dispose();
                    });
                } else if (modelOutput instanceof tf.Tensor) {
                    predictionTensor = modelOutput;
                } else if (typeof modelOutput === 'object' && modelOutput !== null) {
                    const outputName = 'output_0';
                    predictionTensor = modelOutput[outputName];
                    for (const key in modelOutput) {
                        if (key !== outputName && modelOutput[key] instanceof tf.Tensor) {
                            modelOutput[key].dispose();
                        }
                    }
                }

                if (!predictionTensor || predictionTensor.isDisposed) {
                    console.error("Prediction tensor is null or disposed before processing.");
                    labelToDrawOnFrame = "Err: Pred Tensor";
                } else {
                    try {
                        const classIdTensor = predictionTensor.argMax(1);
                        const classId = classIdTensor.dataSync()[0];
                        classIdTensor.dispose();

                        if (classId === undefined || classId < 0 || classId >= this.CLASS_NAMES.length) {
                            labelToDrawOnFrame = "Invalid Class";
                        } else {
                            const predictedLabel = this.CLASS_NAMES[classId];

                            // Add to prediction queue
                            this.state.predQueue.push(predictedLabel);
                            if (this.state.predQueue.length > this.PRED_QUEUE_MAXLEN) {
                                this.state.predQueue.shift();
                            }

                            // Check for stable prediction
                            const counts = {};
                            let maxCount = 0;
                            let mostFrequent = null;

                            for (const label of this.state.predQueue) {
                                counts[label] = (counts[label] || 0) + 1;
                                if (counts[label] > maxCount) {
                                    maxCount = counts[label];
                                    mostFrequent = label;
                                }
                            }

                            // If we have a stable prediction (appears more than 60% of the time)
                            const stabilityThreshold = Math.floor(this.PRED_QUEUE_MAXLEN * 0.6);
                            if (maxCount >= stabilityThreshold && mostFrequent !== this.state.lastStableLabel) {
                                if (mostFrequent === 'space') {
                                    outputText.value += ' ';
                                } else if (mostFrequent === 'del') {
                                    outputText.value = outputText.value.slice(0, -1);
                                } else if (mostFrequent !== 'blank') {
                                    outputText.value += mostFrequent;
                                }
                                this.state.lastStableLabel = mostFrequent;
                            }

                            labelToDrawOnFrame = `${predictedLabel} (${(maxCount / this.PRED_QUEUE_MAXLEN * 100).toFixed(0)}%)`;
                        }
                    } catch (e) {
                        console.error("Error processing prediction:", e);
                        labelToDrawOnFrame = "Err: Processing";
                    } finally {
                        if (predictionTensor && !predictionTensor.isDisposed) {
                            predictionTensor.dispose();
                        }
                    }
                }

                // Draw prediction label
                canvasCtx.fillStyle = "yellow";
                canvasCtx.font = "bold 20px Arial";
                canvasCtx.fillText(labelToDrawOnFrame, displayHandRectX, displayHandRectY - 5);
            } else {
                this.state.predQueue = [];
                this.state.lastStableLabel = "";
                labelToDrawOnFrame = "Invalid ROI";
            }
        } else {
            labelToDrawOnFrame = "No Hand";
            this.state.predQueue = [];
            this.state.lastStableLabel = "";
        }

        // Draw status text
        if (labelToDrawOnFrame === "No Hand" || labelToDrawOnFrame === "Invalid ROI" || labelToDrawOnFrame.startsWith("Err:")) {
            canvasCtx.fillStyle = "red";
            canvasCtx.font = "24px Arial";
            canvasCtx.fillText(labelToDrawOnFrame, 10, 30);
        } else if (this.state.lastStableLabel && this.state.lastStableLabel !== 'blank') {
            canvasCtx.fillStyle = "blue";
            canvasCtx.font = "bold 28px Arial";
            canvasCtx.fillText(
                `Output: ${this.state.lastStableLabel}`,
                10,
                canvasElement.height - 20
            );
        }
    }
};

export default Detection; 
