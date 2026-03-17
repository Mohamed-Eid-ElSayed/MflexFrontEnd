import { AiFillGithub } from "react-icons/ai";
import { SiThemoviedatabase } from "react-icons/si";

// النسخة الكاملة - للـ Sidebar على الكمبيوتر
export const DeveloperCardFull = () => (
  <div className="w-full flex flex-col items-center gap-3 pb-2">
    {/* Powered by */}
    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
      <span>Powered by</span>
      <SiThemoviedatabase className="text-mainorange text-xl mx-1" />
    </div>

    {/* Divider */}
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-mainorange/40 to-transparent" />

    {/* Card */}
    <div className="relative group cursor-default w-full">
      <div className="absolute inset-0 bg-mainorange/10 rounded-2xl blur-lg group-hover:bg-mainorange/20 transition-all duration-500" />
      <div className="relative border border-lightGray1 group-hover:border-mainorange/40 rounded-2xl px-4 py-4 flex flex-col items-center gap-2 transition-all duration-300 bg-black/20">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mainorange to-orange-700 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-mainorange/30">
          M
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-xs tracking-wide">Mohamed Eid</p>
          <p className="text-mainorange text-xs font-medium">El.Sayed</p>
          <p className="text-gray-500 text-[10px] mt-0.5">Full Stack Developer</p>
        </div>
        <a
          href="https://github.com/MoHamed-Eid-bawloo/MO_FLEX"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mainorange/30 text-gray-300 hover:text-white text-[10px] px-3 py-1.5 rounded-full transition-all duration-200"
        >
          <AiFillGithub className="h-3 w-3" />
          GitHub
        </a>
      </div>
    </div>
  </div>
);

// النسخة المبسطة - للـ Footer على الموبايل
export const DeveloperCardMini = () => (
  <div className="flex flex-col items-center gap-3 w-full">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-mainorange/40 to-transparent" />

    <div className="relative group cursor-default">
      <div className="absolute inset-0 bg-mainorange/10 rounded-2xl blur-lg group-hover:bg-mainorange/20 transition-all duration-500" />
      <div className="relative border border-lightGray1 group-hover:border-mainorange/40 rounded-2xl px-6 py-4 flex flex-row items-center gap-4 transition-all duration-300 bg-black/20">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mainorange to-orange-700 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-mainorange/30 shrink-0">
          M
        </div>
        <div>
          <p className="text-white font-bold text-sm tracking-wide">Mohamed Eid</p>
          <p className="text-mainorange text-xs font-medium">El.Sayed</p>
          <p className="text-gray-500 text-[11px] mt-0.5">Full Stack Developer</p>
        </div>
        <a
          href="https://github.com/MoHamed-Eid-bawloo/MO_FLEX"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mainorange/30 text-gray-300 hover:text-white text-xs px-3 py-2 rounded-full transition-all duration-200 shrink-0"
        >
          <AiFillGithub className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </div>

    <p className="text-gray-600 text-xs">
      © {new Date().getFullYear()} Mo-Flex · All rights reserved.
    </p>
  </div>
);
