import Swal from 'sweetalert2';
import ResultPresenter from '../../presenter/ResultPresenter';

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
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                            <div class="bg-[#7A8052] text-white p-6 rounded-lg">
                                <h2 class="text-xl font-semibold mb-2">Live Camera</h2>
                                <p class="mb-4">Use your camera for real-time sign language interpretation</p>
                                <a href="#/detection" class="inline-block bg-white text-[#7A8052] px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                                    Start Detection
                                </a>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <h2 class="text-xl font-semibold text-[#013366] mb-4">Recent Activity</h2>
                            <div id="activityList" class="space-y-4 list-disc pl-5 text-gray-800">
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
        const activityList = document.getElementById('activityList');

        // Logout handler
        logoutBtn?.addEventListener('click', async (event) => {
            event.preventDefault();
            const logoutModal = await Swal.fire({
                icon: 'warning',
                title: 'Anda yakin ingin keluar?',
                showCancelButton: true,
                confirmButtonText: 'Ya, keluar',
                cancelButtonText: 'batal',
                reverseButtons: true,
            });

            if (logoutModal.isConfirmed) {
                // Clear all auth data
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data'); // If you store any user data

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil keluar',
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Redirect to home
                window.location.hash = '#/';

                // Optional: Reload the page to clear any cached data
                window.location.reload();
            }
        });

        async function loadRecentActivities() {
            const presenter = new ResultPresenter();

            if (!activityList) {
                return;
            }
            const items = await presenter.fetchPredictions();

            if (!Array.isArray(items) || items.length === 0) {
                activityList.innerHTML = `<li>No recent activity to show.</li>`;
                return;
            }

            activityList.innerHTML = '';

            items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'text-sm text-gray-800 border-b py-2';
                const date = new Date(item.created_at);
                const formatted = date.toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
                li.textContent = `${item.prediction} - ${formatted}`;
                activityList.appendChild(li);
            });
        }
        loadRecentActivities();
    },
};

export default Dashboard; 