import { cookies } from "next/headers";
import styles from "./MobileNavButtons.module.css";

import { Icon } from "@/components/ui";
import { LogoutButton, NavButton } from "@/components/navbar";

const MobileNavButtons = () => {
  const role = cookies().get("role")?.value;
  return (
    <div className={styles.mobileNavButtons}>
      <label className={styles.menuButton} htmlFor="nav">
        <Icon name="menu" />
      </label>
      <div className={styles.row}>
        {role && <NavButton icon="admin" href={"/admin/categories"} />}
        <LogoutButton />
      </div>
    </div>
  );
};

export default MobileNavButtons;
