import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const getProfileUrl = () => {
    if (!currentUser?.displayName) return null;
    const username = currentUser.displayName.startsWith("@")
      ? currentUser.displayName.substring(1)
      : currentUser.displayName;
    return `${window.location.origin}/@${username}`;
  };

  const profileUrl = getProfileUrl();

  const copyProfileLink = () => {
    if (profileUrl) {
      navigator.clipboard
        .writeText(profileUrl)
        .then(() => {
          setCopied(true);
          toast.success("Profile link copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  };

  return (
    <nav className="w-full py-4 px-6 md:px-16 flex items-center justify-between glass fixed top-0 z-50">
      <Link to="/" className="flex items-center">
        <h1 className="font-bold text-xl text-foreground">
          <span className="text-primary">Eclipz</span>
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/"
          className="text-foreground hover:text-primary transition-colors"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-foreground hover:text-primary transition-colors"
        >
          About
        </Link>

        {currentUser ? (
          <>
            <Link
              to="/inbox"
              className="text-foreground hover:text-primary transition-colors"
            >
              Inbox
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-primary"
                >
                  <User size={18} className="text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser.displayName && (
                  <DropdownMenuItem className="flex flex-col items-start">
                    <span className="font-medium">Username</span>
                    <span className="text-xs text-muted-foreground">
                      {currentUser.displayName}
                    </span>
                  </DropdownMenuItem>
                )}
                {profileUrl && (
                  <DropdownMenuItem
                    onClick={copyProfileLink}
                    className="flex flex-col items-start cursor-pointer"
                  >
                    <span className="font-medium">
                      Your Link (click to copy)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {profileUrl}
                      </span>
                      {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/80 transition-colors"
              >
                Sign In
              </Button>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="absolute top-full left-0 w-full p-5 
  bg-white/90 dark:bg-black/80 
  backdrop-blur-md shadow-xl md:hidden flex flex-col space-y-4 
  mt-2 rounded-b-2xl animate-fade-in border border-border"
        >
          <Link
            to="/"
            className="text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          {currentUser ? (
            <>
              <Link
                to="/inbox"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inbox
              </Link>

              <Link
                to="/profile"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>

              <div className="py-2 px-3 bg-background/50 rounded-lg">
                <h3 className="font-medium mb-1">Quick Info</h3>
                {currentUser.displayName && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground">Username:</p>
                    <p className="text-sm">{currentUser.displayName}</p>
                  </div>
                )}
                {profileUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground">Your link:</p>
                    <p className="text-sm break-all">{profileUrl}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-primary text-xs p-0 h-auto"
                      onClick={copyProfileLink}
                    >
                      {copied ? "Copied!" : "Copy to clipboard"}
                    </Button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-left text-destructive hover:text-destructive/80 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/80 w-full transition-colors"
              >
                Sign In
              </Button>
            </Link>
          )}

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={18} />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
