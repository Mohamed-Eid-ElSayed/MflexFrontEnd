import { Link } from "react-router-dom";
import { SiThemoviedatabase } from "react-icons/si";
import { AiFillGithub } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { HiStar } from "react-icons/hi";
import { BiSolidCameraMovie, BiSolidHome } from "react-icons/bi";
import { TiGroup } from "react-icons/ti";
import { logo } from "../assets/index";

const Footer = () => {


  return (
    <footer className="w-full bg-secondaryGray border-t border-lightGray1 mt-10">
      {/* Top gradient line */}
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-mainorange to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Mo-Flex" className="h-7 w-7" />
              <span className="text-2xl font-black text-mainorange tracking-widest uppercase">
                Mo-Flex
              </span>
            </div>
            <p className="text-gray-500 text-xs max-w-[180px] text-center md:text-left leading-relaxed">
              Your ultimate destination for movies, trailers & more.
            </p>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>Powered by</span>
              <SiThemoviedatabase className="text-mainorange text-lg mx-1" />
              <span>TMDB</span>
            </div>
          </div>

          {/* Creator card */}
          <div className="flex flex-col items-center gap-4">
            <span className="text-mainorange text-xs font-bold uppercase tracking-widest">
              Developer
            </span>
            <div className="relative group cursor-default">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-mainorange/10 rounded-2xl blur-xl group-hover:bg-mainorange/20 transition-all duration-500" />
              <div className="relative border border-lightGray1 group-hover:border-mainorange/40 rounded-2xl px-8 py-5 flex flex-col items-center gap-3 transition-all duration-300 bg-black/20">
                {/* Avatar placeholder */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mainorange to-orange-700 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-mainorange/30">
                  M
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm tracking-wide">
                    Mohamed Eid
                  </p>
                  <p className="text-mainorange text-xs font-medium">
                    El.Sayed
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Full Stack Developer</p>
                </div>
                <a
                  href="https://github.com/MoHamed-Eid-bawloo/MO_FLEX"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mainorange/30 text-gray-300 hover:text-white text-xs px-4 py-2 rounded-full transition-all duration-200"
                >
                  <AiFillGithub className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-lightGray1/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Made with <FaHeart className="text-mainorange text-[10px] mx-1 animate-pulse" /> by
            <span className="text-mainorange font-semibold ml-1">Mohamed Eid El.Sayed</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
