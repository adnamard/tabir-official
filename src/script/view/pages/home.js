const Home = {
  render() {
    return `
      <header class="bg-white sticky top-0 py-4 shadow">
        <nav class="container mx-auto flex items-center justify-between text-[#013366] text-lg px-4">
          <a href="#" class="w-36 md:w-40">
            <img src="../img/logo-tabir.png" alt="Logo" />
          </a>

          <input type="checkbox" id="menu-toggle" class="peer hidden">
          <label for="menu-toggle" class="md:hidden cursor-pointer">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          <div class="peer-checked:flex hidden absolute top-full left-0 w-full flex-col bg-white p-4 md:relative md:flex md:flex-row md:items-center md:justify-center md:space-x-6 md:w-auto md:p-0 transition-all duration-300 ease-in-out transform peer-checked:translate-y-0 -translate-y-full md:translate-y-0">
            <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <a href="#" class="py-2 md:py-0 font-bold hover:text-[#4A708B] transition-colors duration-300">Home</a>
              <a href="#what" class="py-2 md:py-0 font-bold hover:text-[#4A708B] transition-colors duration-300">What</a>
              <a href="#why" class="py-2 md:py-0 font-bold hover:text-[#4A708B] transition-colors duration-300">Why</a>
              <a href="#how" class="py-2 md:py-0 font-bold hover:text-[#4A708B] transition-colors duration-300">How</a>
              <a href="#who" class="py-2 md:py-0 font-bold hover:text-[#4A708B] transition-colors duration-300">Who</a>
            </div>

            <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
              <a href="#/login" class="text-[#013366] font-bold hover:text-[#4A708B] transition-colors duration-300">Log In</a>
              <a href="#/register" class="bg-[#013366] text-white px-4 py-2 rounded-md hover:bg-[#4A708B] transition-colors duration-300">Create Account</a>
            </div>
          </div>
        </nav>
      </header>

      <section class="bg-[#FAF5E5] -mt-12">
        <div class="container mx-auto min-h-screen flex flex-col-reverse md:flex-row justify-center items-center gap-4 md:gap-12 text-center md:text-left px-4">
          <div class="w-full md:w-2/6">
            <h3 class="text-3xl my-5 md:text-5xl font-bold text-[#013366] md:leading-tight">
              Breaking Barriers<br>
              In Sign Language<br>
              Communication
            </h3>
            <p class="text-md text-balance text-[#013366]">TaBir (Tangan Bicara) uses AI to interpret sign language, making communication more accessible for everyone</p>
            <div class="text-white mt-4 flex justify-center md:justify-start gap-2">
              <button class="bg-[#4A708B] px-2 py-1 rounded-md hover:scale-105 transition-transform flex items-center gap-2">
                <img src="../img/use-camera.png" alt="camera-icon" class="w-5 h-5" />
              Use Camera</button>
            </div>
          </div>
          <img src="../img/tabir-page1.png" class="w-1/2 lg:w-1/4 lg:mb-0" />
        </div>
      </section>

      <section id="what" class="bg-white">
        <div class="container mx-auto min-h-screen flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 px-4 text-center md:text-left">
          <img src="../img/girl-think.png" class="w-2/5 mt-2 md:w-2/6 mb-4 md:mb-0" />
          <div class="w-full md:w-2/4">
            <h4 class="text-3xl md:text-5xl font-bold mb-4 text-[#013366]">What is TaBir?</h4>
            <p class="text-[#4A708B] text-sm md:text-base">TaBir is an innovative application that uses machine learning to interpret sign language from videos or real-time webcam bridging communication gaps between the deaf community and those who don't understand sign language</p>
            
            <div class="flex flex-col items-start space-y-2 my-6">
              <div class="flex items-center space-x-2 justify-center md:justify-start">
                <img src="../img/real-time.png">
                <h1 class="text-lg font-semibold text-[#4A708B]">Real-Time Recognition</h1>
              </div>
              <p class="text-sm text-[#7AA2B2] text-center md:text-left">Instanly interprets sign language gestures through your webcam</p>
            </div>

            <div class="flex flex-col items-start space-y-2 my-6">
              <div class="flex items-center space-x-2 justify-center md:justify-start">
                <img src="../img/text-transcription.png">
                <h1 class="text-lg font-semibold text-[#4A708B]">Text Transcription</h1>
              </div>
              <p class="text-sm text-[#7AA2B2] text-center md:text-left">Converts sign language to written text</p>
            </div>
          </div>
        </div>
      </section>

      <section id="why" class="bg-[#FAF5E5] py-12">
        <div class="container mx-auto min-h-screen flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 px-4 text-center md:text-left">
          <div class="w-full md:w-2/4">
            <h4 class="text-3xl md:text-5xl font-bold mb-4 text-[#013366]">Why TaBir Matters?</h4>
            <p class="text-[#4A708B] font-semibold text-sm md:text-base my-4 md:my-6 text-balance">
              Communication is a fundamental human right. For the 70 million deaf people worldwide who use sign language, barriers to communication can lead to isolation and limited opportunities
            </p>
            <p class="text-[#4A708B] font-semibold text-sm md:text-base my-4 md:my-6 text-balance">
              TaBir aims to bridge this gap by making sign language interpretation accessible to everyone, anytime, anywhere-without requiring human interprets who may not always be available
            </p>
            <img src="../img/group-people.png" class="w-3/4 md:w-2/4 mx-auto md:mx-4 mt-4 md:mt-0">
          </div>
          <div class="flex flex-col-3 justify-center items-center md:flex-col md:items-start gap-6 w-full md:w-auto mt-6 md:mt-0">
            <img src="../img/accuracy.png" class="w-1/4 md:w-2/3">
            <img src="../img/accessibility.png" class="w-1/4 md:w-2/3">
            <img src="../img/sibi.png" class="w-1/4 md:w-2/3">
          </div>
        </div>
      </section>

      <section id="how" class="bg-[#2C3E50] py-12">
        <div class="container mx-auto min-h-screen flex flex-col md:flex-row justify-center items-center md:gap-12 px-4 text-center md:text-left">
          <div class="w-full md:w-2/6">
            <img src="../img/camera-prev.png" class="mb-3 mx-auto md:mx-0">
            <div class="flex flex-col md:flex-row justify-center md:justify-center gap-4">
              <button class="bg-[#8B9368] px-16 py-3 rounded-lg text-white text-xl font-bold">Capture</button>
            </div>
          </div>
          <div class="w-full md:w-2/4 md:mt-0">
            <h1 class="text-3xl md:text-5xl font-bold text-[#F7F2E0] my-6">How TaBir Works?</h1>
            <p class="text-base md:text-lg font-semibold text-balance text-[#4A708B]">Our application uses advanced machine learning algorithms to recognize and interpret sign language gestures in real-time. Here's how you can use TaBir :</p>
            
            <div class="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-2 md:space-y-0 md:space-x-4 my-5">
              <img src="../img/number-1.png" class="w-16 md:w-20 mx-auto md:mx-0">
              <div class="text-white my-2 mx-4">
                <h2 class="text-lg font-semibold mb-2">Choose Your Input</h2>
                <p>Select between uploading a video or using your webcam for real-time interpretation</p>
              </div>
            </div>

            <div class="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-2 md:space-y-0 md:space-x-4 my-5">
              <img src="../img/number-2.png" class="w-16 md:w-20 mx-auto md:mx-0">
              <div class="text-white my-2 mx-4">
                <h2 class="text-lg font-semibold mb-2">Position Yourself</h2>
                <p>Ensure your signing is clearly visible within the frame for the best result</p>
              </div>
            </div>

            <div class="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-2 md:space-y-0 md:space-x-4">
              <img src="../img/number-3.png" class="w-16 md:w-20 mx-auto md:mx-0">
              <div class="text-white my-2 mx-4">
                <h2 class="text-lg font-semibold mb-2">Get interpretation</h2>
                <p>View the real-time test interpretation of your sign language gestures</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="who" class="bg-white py-12 overflow-hidden">
        <div class="container mx-auto text-center px-4">
          <h1 class="text-3xl md:text-5xl font-bold text-[#8B9368] mb-12">Meet Our Team</h1>

          <div class="overflow-hidden">
            <div class="flex w-[200%] animate-slide-group">
              <div class="flex w-1/2 justify-center gap-4 md:gap-10">
                <div class="bg-[#FAF5E5] rounded-xl px-4 md:px-6 shadow-md w-60 md:w-72">
                  <img src="../img/profile-berwyn.jpeg" alt="foto-profile" class="h-40 w-full object-cover md:h-52 mb-4">
                  <h3 class="text-[#4A708B] font-bold text-lg text-left">Berwyn Izzut Taghyir</h3>
                  <p class="text-[#8B9368] text-sm mb-4 text-left">Machine Learning</p>
                  <div class="flex space-x-4 mt-8 md:mt-12 mb-6">
                    <a href="https://www.linkedin.com/in/wynzit/" target="_blank">
                      <img src="../img/linkedin.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                    <a href="https://github.com/Wynnzzz" target="_blank">
                      <img src="../img/github.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                  </div>
                </div>
                <div class="bg-[#FAF5E5] rounded-xl px-4 md:px-6 shadow-md w-60 md:w-72">
                  <img src="../img/profile-fatwa.jpeg" alt="foto-profile" class="h-40 w-full object-cover md:h-52 mb-4">
                  <h3 class="text-[#4A708B] font-bold text-lg text-left">Fatwa Nurhidayat</h3>
                  <p class="text-[#8B9368] text-sm mb-4 text-left">Machine Learning</p>
                  <div class="flex space-x-4 mt-8 md:mt-12 mb-6">
                    <a href="https://www.linkedin.com/in/fatwanurhdyt/" target="_blank">
                      <img src="../img/linkedin.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                    <a href="https://github.com/wafflenuts444" target="_blank">
                      <img src="../img/github.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                  </div>
                </div>
                <div class="bg-[#FAF5E5] rounded-xl px-4 md:px-6 shadow-md w-60 md:w-72">
                  <img src="../img/profile-agil.jpg" alt="foto-profile" class="h-40 w-full object-cover md:h-52 mb-4">
                  <h3 class="text-[#4A708B] font-bold text-lg text-left">Agil Julian Nugroho</h3>
                  <p class="text-[#8B9368] text-sm mb-4 text-left">Machine Learning</p>
                  <div class="flex space-x-4 mt-8 md:mt-12 mb-6">
                    <a href="https://www.linkedin.com/in/agil-julian-nugroho-98497b24b/" target="_blank">
                      <img src="../img/linkedin.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                    <a href="https://github.com/AJN276" target="_blank">
                      <img src="../img/github.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                  </div>
                </div>
              </div>

              <div class="flex w-1/2 justify-center gap-4 md:gap-10">
                <div class="bg-[#FAF5E5] rounded-xl px-4 md:px-6 shadow-md w-60 md:w-72">
                  <img src="../img/profile-arya.jpeg" alt="foto-profile" class="h-40 w-full object-cover md:h-52 mb-4">
                  <h3 class="text-[#4A708B] font-bold text-lg text-left">Arya Rizki Andaru</h3>
                  <p class="text-[#8B9368] text-sm mb-4 text-left">Frontend & Backend</p>
                  <div class="flex space-x-4 mt-8 md:mt-12 mb-6">
                    <a href="https://www.linkedin.com/in/aryarizkiandaru/" target="_blank">
                      <img src="../img/linkedin.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                    <a href="https://github.com/xryar" target="_blank">
                      <img src="../img/github.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                  </div>
                </div>
                <div class="bg-[#FAF5E5] rounded-xl px-4 md:px-6 shadow-md w-60 md:w-72">
                  <img src="../img/profile-dea.jpeg" alt="foto-profile" class="h-40 w-full object-cover md:h-52 mb-4">
                  <h3 class="text-[#4A708B] font-bold text-lg text-left">Dea Ramanda</h3>
                  <p class="text-[#8B9368] text-sm mb-4 text-left">Frontend & Backend</p>
                  <div class="flex space-x-4 mt-8 md:mt-12 mb-6">
                    <a href="https://www.linkedin.com/in/adnamard/" target="_blank">
                      <img src="../img/linkedin.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                    <a href="https://github.com/adnamard" target="_blank">
                      <img src="../img/github.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                  </div>
                </div>
                <div class="bg-[#FAF5E5] rounded-xl px-4 md:px-6 shadow-md w-60 md:w-72">
                  <img src="../img/profile-reza.jpeg" alt="foto-profile" class="h-40 w-full object-cover md:h-52 mb-4">
                  <h3 class="text-[#4A708B] font-bold text-lg text-left">Reza Nugraha</h3>
                  <p class="text-[#8B9368] text-sm mb-4 text-left">Frontend & Backend</p>
                  <div class="flex space-x-4 mt-8 md:mt-12 mb-6">
                    <a href="https://www.linkedin.com/in/rezanugraha105/" target="_blank">
                      <img src="../img/linkedin.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                    <a href="https://github.com/rezanugraha105/" target="_blank">
                      <img src="../img/github.png" class="w-8 md:w-10 h-8 md:h-10">
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    // Only keep the menu toggle functionality
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('.peer-checked\\:flex');

    menuToggle?.addEventListener('change', () => {
      nav.classList.toggle('hidden');
      nav.classList.toggle('-translate-y-full');
      nav.classList.toggle('translate-y-0');
    });
  },
};

export default Home; 