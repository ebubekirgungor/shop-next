import { cookies } from "next/headers";
import Icon from "../../ui/Icon";
import LogoutButton from "../LogoutButton";
import NavButton from "../NavButton";
import styles from "./MobileNavButtons.module.css";

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
