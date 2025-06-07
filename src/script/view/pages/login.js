import LoginPresenter from '../../presenter/LoginPresenter';
import Swal from 'sweetalert2';

const Login = {
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
              <h1 class="mb-6 sm:mb-8 text-2xl sm:text-3xl text-center font-bold">Login</h1>
              <form id="loginForm" class="space-y-4 sm:space-y-6">
                <div>
                  <label class="mb-2 block font-semibold text-gray-700" for="username">Username</label>
                  <input 
                    class="w-full rounded border px-3 py-2 text-sm sm:text-base leading-tight text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-950"
                    id="username" 
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
                    type="password" 
                    required
                    placeholder="Silahkan masukkan password kamu, ya" 
                  />
                  <a class="mt-1 inline-block text-sm text-gray-600 hover:text-gray-800" href="#">Lupa passwordnya?</a>
                </div>
                <div>
                  <button 
                    class="w-full rounded bg-blue-950 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
                <p class="text-center text-sm text-gray-600">
                  Kamu belum punya akun?
                  <a href="#/register" class="text-blue-600 hover:underline">Daftar di sini yaa</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    `;
    },

    async afterRender() {
        const form = document.getElementById('loginForm');

        form?.addEventListener('submit', async (e) => {
          e.preventDefault();

          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          const presenter = new LoginPresenter();

          try {
            const success = await presenter.login({ username, password });

            if (success){
              Swal.mixin({
              toast: true,
              position: "bottom-right",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
              }
            }).fire({
              icon: "success",
              title: "Berhasil Login!",
            });
            }
          } catch (error) {
            Swal.fire({
              title: 'Login Gagal',
              text: error.message || 'Terjadi kesalahan saat login.',
              icon: 'error',
            });
          }

        });
    },
};

export default Login; 