import { DeveloperCardMini } from "./DeveloperCard";

const Footer = () => {
  return (
    <footer className="sm:hidden w-full bg-secondaryGray border-t border-lightGray1 px-6 py-6">
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-mainorange to-transparent mb-6" />
      <DeveloperCardMini />
    </footer>
  );
};

export default Footer;
