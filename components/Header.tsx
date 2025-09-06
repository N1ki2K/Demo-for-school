import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NavItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useNavigationContext } from '../context/NavigationContext';
import LanguageSwitcher from './LanguageSwitcher';
import Search from './Search';
import { LoginButton } from './cms/LoginButton';

const Dropdown: React.FC<{ items: NavItem[]; parentPath: string; closeMenu: () => void }> = ({ items, parentPath, closeMenu }) => {
  return (
    <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 w-60 z-50 animate-fade-in-down">
      <div className="py-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-4 py-2 text-sm text-gray-700 hover:bg-brand-gold-light hover:text-brand-blue-dark transition-colors duration-200 ${isActive ? 'bg-brand-gold-light font-semibold' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};


const MoreDropdownItem: React.FC<{ item: NavItem; closeMenu: () => void }> = ({ item, closeMenu }) => {
    const [isSubmenuOpen, setSubmenuOpen] = useState(false);

    if (!item.children || item.children.length === 0) {
        return (
            <NavLink
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                    `block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-brand-gold-light hover:text-brand-blue-dark transition-colors duration-200 ${isActive ? 'bg-brand-gold-light font-semibold' : ''}`
                }
            >
                {item.label}
            </NavLink>
        );
    }

    return (
        <div>
            <button
                onClick={() => setSubmenuOpen(!isSubmenuOpen)}
                className="w-full flex justify-between items-center px-4 py-2 text-sm text-left font-semibold text-gray-800 hover:bg-brand-gold-light hover:text-brand-blue-dark transition-colors duration-200"
            >
                <span>{item.label}</span>
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isSubmenuOpen && (
                <div className="pl-4 border-l-2 border-brand-gold-light ml-2">
                    {item.children.map(child => (
                        <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `block px-4 py-2 text-sm text-gray-700 hover:bg-brand-gold-light hover:text-brand-blue-dark transition-colors duration-200 ${isActive ? 'bg-brand-gold-light font-semibold' : ''}`
                            }
                        >
                            {child.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

const MoreDropdown: React.FC<{ items: NavItem[]; closeMenu: () => void }> = ({ items, closeMenu }) => {
  return (
    <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 w-60 z-50 animate-fade-in-down">
      <div className="py-1">
        {items.map((item) => (
           <div key={item.label} className="border-b last:border-b-0 border-gray-100">
             <MoreDropdownItem item={item} closeMenu={closeMenu} />
           </div>
        ))}
      </div>
    </div>
  );
};


function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}


const Header: React.FC = () => {
  const { t, getTranslation } = useLanguage();
  const { navItems: navLinks } = useNavigationContext();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [visibleLinks, setVisibleLinks] = useState<NavItem[]>(navLinks);
  const [hiddenLinks, setHiddenLinks] = useState<NavItem[]>([]);
  const [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs for measurement
  const headerRef = useRef<HTMLElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLUListElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const otherControlsRef = useRef<HTMLDivElement>(null);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setMoreMenuOpen(false);
  }

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  
  useLayoutEffect(() => {
    const calculateNavLinks = () => {
      if (!headerContainerRef.current || !logoRef.current || !otherControlsRef.current || !measurementRef.current) {
        return;
      }
      
      const headerContainer = headerContainerRef.current;
      const logo = logoRef.current;
      const otherControls = otherControlsRef.current;
      const measurementItems = Array.from(measurementRef.current.children) as HTMLLIElement[];
      
      const GAP = 24; // Tailwind's `space-x-6` (1.5rem = 24px)
      const NAV_MARGIN_LEFT = 24; // `ml-6` on the nav element
      const MORE_BUTTON_WIDTH = 90; // Estimated width for the "More" button + its margin

      const otherControlsWidth = otherControls.offsetWidth;
      const SAFETY_MARGIN = 48; // This is your "red line" buffer.
          
      const totalAvailableSpaceForNav = headerContainer.offsetWidth - logo.offsetWidth - NAV_MARGIN_LEFT;
      const availableSpace = totalAvailableSpaceForNav - otherControlsWidth - SAFETY_MARGIN;

      const cumulativeWidths: number[] = [];
      let totalWidth = 0;
      measurementItems.forEach((item, i) => {
        totalWidth += item.offsetWidth + (i > 0 ? GAP : 0);
        cumulativeWidths.push(totalWidth);
      });
      
      if (totalWidth <= availableSpace) {
        setVisibleLinks(navLinks);
        setHiddenLinks([]);
        return;
      }
      
      const spaceForLinks = availableSpace - MORE_BUTTON_WIDTH;
      
      let splitPoint = cumulativeWidths.findIndex(width => width > spaceForLinks);
      
      if (splitPoint === -1) {
          splitPoint = navLinks.length;
      }

      if (splitPoint === 0 && measurementItems.length > 0 && measurementItems[0].offsetWidth > spaceForLinks) {
          setVisibleLinks([]);
          setHiddenLinks(navLinks);
          return;
      }

      setVisibleLinks(navLinks.slice(0, splitPoint));
      setHiddenLinks(navLinks.slice(splitPoint));
    };
    
    // Defer calculation to ensure layout and fonts are ready.
    const timerId = setTimeout(calculateNavLinks, 50);
    
    const debouncedCalculate = debounce(calculateNavLinks, 100);
    window.addEventListener('resize', debouncedCalculate);

    return () => {
        clearTimeout(timerId);
        window.removeEventListener('resize', debouncedCalculate);
    }
  }, [navLinks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setMoreMenuOpen(false);
      }
      if(moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderDesktopNavItem = (link: NavItem) => (
    <li key={link.label} className="relative group flex-shrink-0">
      {link.children ? (
        <>
           <button
            onClick={() => handleDropdownToggle(link.label)}
            className="flex items-center text-white p-0 bg-transparent hover:text-brand-gold-light transition-colors duration-300"
          >
            {link.label}
            <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${openDropdown === link.label ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          {openDropdown === link.label && (
            <Dropdown items={link.children} parentPath={link.path} closeMenu={closeAllMenus} />
          )}
        </>
      ) : (
        <NavLink
          to={link.path}
          onClick={closeAllMenus}
          className={({ isActive }) =>
            `block p-0 text-white bg-transparent hover:text-brand-gold-light transition-colors duration-300 ${isActive ? 'text-brand-gold-light font-bold' : ''}`
          }
        >
          {link.label}
        </NavLink>
      )}
    </li>
  );

  const renderMobileNavLink = (link: NavItem) => (
      <li key={link.label} className="relative group">
        {link.children ? (
          <>
             <button
              onClick={() => handleDropdownToggle(link.label)}
              className="flex items-center justify-between w-full px-4 py-2 text-left text-white hover:bg-brand-blue-light rounded-md"
            >
              {link.label}
              <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${openDropdown === link.label ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {openDropdown === link.label && (
                <div className="pl-4 mt-2 space-y-2">
                  {link.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={closeAllMenus}
                      className={({ isActive }) => `block py-2 text-white hover:text-brand-gold-light transition-colors duration-200 ${isActive ? 'text-brand-gold-light font-semibold' : ''}`}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )
            }
          </>
        ) : (
          <NavLink
            to={link.path}
            onClick={closeAllMenus}
            className={({ isActive }) =>
              `block px-4 py-2 text-white hover:bg-brand-blue-light rounded-md ${isActive ? 'text-brand-gold-light font-bold' : ''}`
            }
          >
            {link.label}
          </NavLink>
        )}
      </li>
  );

  return (
    <header ref={headerRef} className={`bg-brand-blue text-white fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-sm ${
      isScrolled ? 'shadow-lg bg-opacity-95' : 'shadow-md'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerContainerRef} className="flex items-center justify-between h-20">
          <Link ref={logoRef} to="/" onClick={closeAllMenus} className="flex items-center space-x-3 rtl:space-x-reverse flex-shrink-0">
              <svg className="w-12 h-12 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v-5"></path></svg>
              <span className="self-center text-xl font-semibold whitespace-nowrap hidden sm:block">{getTranslation('header.title', 'ОУ "Кольо Ганчев"')}</span>
          </Link>
          
          <div className="flex items-center lg:hidden">
            <Search />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label={getTranslation('header.toggleMenu', 'Отвори меню')}
            >
              <span className="sr-only">{getTranslation('header.toggleMenu', 'Отвори меню')}</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>

          <nav ref={navContainerRef} className="hidden lg:flex items-center flex-grow justify-end ml-6">
            <ul className="flex items-center space-x-6 text-md font-medium flex-shrink-0">
              {visibleLinks.map(renderDesktopNavItem)}
            </ul>
             {hiddenLinks.length > 0 && (
                <div ref={moreMenuRef} className="relative ml-6">
                  <button
                    onClick={() => setMoreMenuOpen(prev => !prev)}
                    className="flex items-center text-white p-0 bg-transparent hover:text-brand-gold-light transition-colors duration-300"
                  >
                    {getTranslation('nav.more', 'Още')}
                    <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isMoreMenuOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {isMoreMenuOpen && <MoreDropdown items={hiddenLinks} closeMenu={closeAllMenus} />}
                </div>
              )}

            <div ref={otherControlsRef} className="flex items-center space-x-4 ml-6 flex-shrink-0">
               <Search />
               <LanguageSwitcher />
               <LoginButton />
            </div>
          </nav>
        </div>
      </div>
      
      {/* Off-screen measurement list - uses simple spans for reliable width calculation */}
      <ul ref={measurementRef} className="absolute top-0 left-0 invisible -z-10 flex space-x-6 text-md font-medium overflow-hidden">
          {navLinks.map(link => (
            <li key={link.label} className="flex-shrink-0">
                {link.children ? (
                    <span className="flex items-center p-0 bg-transparent">
                        {link.label}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                ) : (
                    <span className="block p-0 bg-transparent">
                        {link.label}
                    </span>
                )}
            </li>
          ))}
      </ul>


      {isMobileMenuOpen && (
        <div className="lg:hidden animate-fade-in-down">
          <ul className="px-4 pt-2 pb-4 space-y-2 sm:px-6">
            {navLinks.map(renderMobileNavLink)}
            <li className="pt-4 mt-4 border-t border-brand-blue-light flex flex-col space-y-3">
              <LanguageSwitcher isMobile={true} />
              <div className="flex justify-center">
                <LoginButton />
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;