/* Components */
import { HeaderBtn } from "./HeaderBtn";

/**
 * Header Component
 * @returns {JSX.Element} Le composant barre de navigation.
 */
export const Header = () => {
  return (
    <header className="flex justify-between items-center p-3  lg:px-10 fixed top-0 w-full z-40 bg-slate-900 dark:bg-sky-950 text-white bg-opacity-60 backdrop-blur-md">
      <h1 className="text-2xl font-bold">
        Occitanie<span className="text-sky-500 text-4xl">.</span>Evasion
      </h1>
      <div className="flex items-center gap-2">
        <HeaderBtn />
      </div>
    </header>
  );
};
