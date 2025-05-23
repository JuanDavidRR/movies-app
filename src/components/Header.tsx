// components/Header.tsx
import Search from "./Search";
import { useHeaderAnimation } from "../hooks/useHeaderAnimation";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header = ({ searchTerm, setSearchTerm }: HeaderProps) => {
  const { textRef } = useHeaderAnimation();

  return (
    <header role="banner">
      <img
        src="./hero.png"
        alt="Movie collage hero banner"
        loading="lazy"
        width="1200"
        height="600"
      />
      <h1 className="text" ref={textRef as React.RefObject<HTMLHeadingElement>}>
        Find Movies You'll Enjoy Without the Hassle
      </h1>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </header>
  );
};

export default Header;
