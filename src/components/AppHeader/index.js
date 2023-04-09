import { PoweroffOutlined } from "@ant-design/icons";
import { Button, Image, Space, Typography } from "antd";
import logo from "../../assets/logo.png";

function AppHeader() {
  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("_id");
    window.location.reload();
  };

  return (
    <div className="AppHeader">
      <Image width={100} src={logo}></Image>
      <Typography.Title>Table Now</Typography.Title>
      <Space>
        <Button danger onClick={handleSignOut}>
          <PoweroffOutlined />
          Sign Out
        </Button>
      </Space>
    </div>
  );
}
export default AppHeader;
