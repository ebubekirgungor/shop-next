import Icon from "../Icon";

const LogoutButton = () => {
  return (
    <form action="/api/auth/logout">
      <button type="submit">
        <Icon name="logout" />
        <span>Logout</span>
      </button>
    </form>
  );
};

export default LogoutButton;
