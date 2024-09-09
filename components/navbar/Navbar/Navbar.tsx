import { cookies } from "next/headers";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import NavSearch from "../NavSearch";
import Icon from "@/components/ui/Icon";
import NavButton from "../NavButton";
import Box from "@/components/ui/Box";
import { Role } from "@/lib/types";
import LogoutButton from "../LogoutButton";

const Navbar = () => {
  const role = cookies().get("role")?.value;
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={200} height={100} priority />
        </Link>
      </div>
      <input id="search" type="checkbox" style={{ display: "none" }} />
      <NavSearch />
      <div className={styles.navButtons}>
        <button type="button">
          <label className={styles.searchButton} htmlFor="search">
            <Icon name="search_mobile" />
          </label>
        </button>
        {role ? (
          <div className={styles.accountBoxContainer}>
            <NavButton icon="account" href={"/account/personal-details"}>
              Account
              <Icon name="expand_more" />
            </NavButton>
            <Box className={styles.accountBox} width="9rem" height="auto">
              <div className={styles.spacing} />
              {role && role === Role.ADMIN && (
                <NavButton icon="admin" href={"/admin/categories"}>
                  Admin
                </NavButton>
              )}
              <LogoutButton />
            </Box>
          </div>
        ) : (
          <NavButton icon="account" href={"/login"}>
            Login
          </NavButton>
        )}
        <NavButton icon="favorite" href="/account/favorites">
          Favorites
        </NavButton>
        <NavButton icon="cart" href="/cart">
          Cart
        </NavButton>
      </div>
    </nav>
  );
};

export default Navbar;
