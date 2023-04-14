import { PoweroffOutlined } from "@ant-design/icons";
import { Button, Image, Modal, Space, Typography } from "antd";
import logo from "../../assets/logo.png";
import { ExclamationCircleFilled } from "@ant-design/icons/lib/icons";

function AppHeader() {
  const { confirm } = Modal;
  const handleSignOut = () => {
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleFilled />,
      content: "Unsaved changes cannot be undone!",
      onOk() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("_id");
        window.location.reload();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div className="AppHeader">
      <Image style={{ borderRadius: 10 }} width={90} src={logo}></Image>
      <Typography.Title style={{ marginTop: 10, fontWeight: "600" }}>
        Table Now
      </Typography.Title>
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
