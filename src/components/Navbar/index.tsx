import NavLinks from './NavLinks';
import SettingsDropdown from './Settings';

export default function Navbar() {
    return (
        <nav className="flex justify-between py-4">
            <NavLinks />
            <SettingsDropdown />
        </nav>
    );
}
