import RegisterPresenter from '../../presenter/RegisterPresenter';
import Swal from 'sweetalert2';

const Register = {
  render() {
    return `
      <div class="flex min-h-screen items-center justify-center bg-[#FAF5E5] px-4 py-8">
        <section class="w-full max-w-6xl mx-auto">
          <div class="flex w-full flex-col items-center gap-8 rounded-[30px] sm:rounded-[50px] px-4 py-6 lg:flex-row">
            <img 
              class="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[550px] bg-blue-950 lg:order-2 lg:w-1/2 rounded-[40px] lg:rounded-[80px]" 
              src="../img/auth-hero.png" 
              alt="Authentication Hero" 
            />

            <div class="w-full max-w-[450px] rounded-2xl bg-white p-6 sm:p-8 shadow-md">
              <div class="logo-container flex flex-col items-center mb-6">
                
                <h1 class="text-2xl sm:text-3xl font-bold">Register</h1>
              </div>
              
              <form id="registerForm" class="space-y-4 sm:space-y-6">
                <div>
                  <label class="mb-2 block font-semibold text-gray-700" for="fullname">Fullname</label>
                  <input 
                    class="w-full rounded border px-3 py-2 text-sm sm:text-base leading-tight text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-950"
                    id="fullname" 
                    name="fullname" 
                    type="text" 
                    required
                    placeholder="Silahkan masukkan fullname kamu, ya"
                  />
                </div>

                <div>
                  <label class="mb-2 block font-semibold text-gray-700" for="username">Username</label>
                  <input 
                    class="w-full rounded border px-3 py-2 text-sm sm:text-base leading-tight text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-950"
                    id="username" 
                    name="username" 
                    type="text" 
                    required
                    placeholder="Silahkan masukkan username kamu, ya"
                  />
                </div>

                <div>
                  <label class="mb-2 block font-semibold text-gray-700" for="password">Password</label>
                  <input 
                    class="w-full rounded border px-3 py-2 text-sm sm:text-base leading-tight text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-950"
                    id="password" 
                    name="password" 
                    type="password" 
                    required
                    placeholder="Silahkan masukkan password kamu, ya"
                  />
                </div>

                <div>
                  <button 
                    class="w-full rounded bg-blue-950 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2"
                    type="submit"
                  >
                    Register
                  </button>
                </div>

                <p class="text-center text-sm text-gray-600">
                  Kamu sudah punya akun?
                  <a href="#/login" class="text-blue-600 hover:underline">Masuk ke sini yaa</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async afterRender() {
    const form = document.getElementById('registerForm');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullname = document.getElementById('fullname').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('https://tabir-backend-service-production.up.railway.app/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullname, username, password }),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            title: 'Berhasil Registrasi!',
            text: result.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          window.location.hash = '#/login';
        } else {
          Swal.fire({
            title: 'Gagal Registrasi',
            text: result.message,
            icon: 'error',
            showConfirmButton: true,
          });
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Gagal menghubungi server.');
      }
    });
  },
};

export default Register; 