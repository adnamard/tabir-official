import TabirIdb from '../../utils/db';

const Dashboard = {
    render() {
        return `
            <div class="min-h-screen bg-[#FAF5E5]">
                <!-- Header/Navbar -->
                <header class="bg-white shadow">
                    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
                        <a href="#" class="w-36 md:w-40">
                            <img src="../img/logo-tabir.png" alt="Logo" />
                        </a>
                        <div class="flex items-center gap-4">
                            <button id="logoutBtn" class="text-[#013366] hover:text-[#4A708B]">Logout</button>
                        </div>
                    </nav>
                </header>

                <!-- Main Content -->
                <main class="container mx-auto px-4 py-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h1 class="text-2xl font-bold text-[#013366] mb-6">Welcome to Your Dashboard</h1>
                        
                        <!-- Quick Actions -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div class="bg-[#4A708B] text-white p-6 rounded-lg">
                                <h2 class="text-xl font-semibold mb-2">Upload Video</h2>
                                <p class="mb-4">Upload a pre-recorded video for sign language interpretation</p>
                                <div class="space-y-4">
                                    <input type="file" id="videoUpload" accept="video/*" class="hidden" />
                                    <label for="videoUpload" 
                                        class="inline-block bg-white text-[#4A708B] px-4 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                                        Choose Video
                                    </label>
                                    <div id="uploadStatus" class="text-sm hidden">
                                        <p class="file-name"></p>
                                        <div class="progress-bar w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                            <div class="progress bg-white h-2.5 rounded-full" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-[#7A8052] text-white p-6 rounded-lg">
                                <h2 class="text-xl font-semibold mb-2">Live Camera</h2>
                                <p class="mb-4">Use your camera for real-time sign language interpretation</p>
                                <a href="#/detection" class="inline-block bg-white text-[#7A8052] px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                                    Start Detection
                                </a>
                            </div>
                        </div>

                        <!-- Video Preview -->
                        <div id="videoPreview" class="hidden mb-8">
                            <h2 class="text-xl font-semibold text-[#013366] mb-4">Video Preview</h2>
                            <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <video id="previewPlayer" class="w-full h-full object-contain" controls></video>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <h2 class="text-xl font-semibold text-[#013366] mb-4">Recent Activity</h2>
                            <div id="activityList" class="space-y-4">
                                <p class="text-gray-600">No recent activity to show.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    async afterRender() {
        const logoutBtn = document.getElementById('logoutBtn');
        const videoUpload = document.getElementById('videoUpload');
        const uploadStatus = document.getElementById('uploadStatus');
        const videoPreview = document.getElementById('videoPreview');
        const previewPlayer = document.getElementById('previewPlayer');
        const activityList = document.getElementById('activityList');

        // Logout handler
        logoutBtn?.addEventListener('click', () => {
            // Clear all auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data'); // If you store any user data

            // Redirect to home
            window.location.hash = '#/';

            // Optional: Reload the page to clear any cached data
            window.location.reload();
        });

        // File upload handler
        videoUpload?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Show upload status
            uploadStatus.classList.remove('hidden');
            uploadStatus.querySelector('.file-name').textContent = file.name;
            const progressBar = uploadStatus.querySelector('.progress');

            // Show video preview
            const videoURL = URL.createObjectURL(file);
            previewPlayer.src = videoURL;
            videoPreview.classList.remove('hidden');

            try {
                const token = localStorage.getItem('auth_token');
                if (!token) throw new Error('No authentication token found');

                const formData = new FormData();
                formData.append('video', file);

                const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    // Add to activity list
                    const activity = document.createElement('div');
                    activity.className = 'flex items-center justify-between p-4 bg-white rounded-lg shadow';
                    activity.innerHTML = `
                        <div>
                            <h3 class="font-semibold text-[#013366]">${file.name}</h3>
                            <p class="text-sm text-gray-600">Uploaded successfully</p>
                        </div>
                        <span class="text-green-500">✓</span>
                    `;

                    if (activityList.firstChild.textContent === 'No recent activity to show.') {
                        activityList.innerHTML = '';
                    }
                    activityList.insertBefore(activity, activityList.firstChild);
                } else {
                    throw new Error(result.message || 'Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Failed to upload video: ' + error.message);
                uploadStatus.classList.add('hidden');
            }
        });
    },
};

export default Dashboard; 