import {
  CalendarOutlined,
  HomeOutlined,
  MenuOutlined,
  DollarCircleOutlined,
  StarOutlined,
  UsergroupAddOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, Typography, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  const [id, setId] = useState("");
  const [resID, setResID] = useState("");

  useEffect(() => {
    setResID(localStorage.getItem("resID"));
  }, []);

  const [dataProfile, setDataProfile] = useState("");
  const [dataTables, setDataTables] = useState("");
  const [dataMenu, setDataMenu] = useState("");
  const [dataStaffs, setDataStaffs] = useState("");

  const getDataProfile = async () => {
    resID &&
      (await axios
        .get(`https://tablenow.onrender.com/api/profile/get-details/${resID}`)
        .then((res) => {
          setId(res.data.data._id);
          if (res.data.status === "ERR") {
            return message.error(res.data.message, 2.5);
          } else if (
            res.data.data.restaurantName === "empty" ||
            res.data.data.restaurantAddress === "empty" ||
            res.data.data.restaurantDescribe === "empty" ||
            res.data.data.images.length < 4 ||
            res.data.data.shiftTime[0].timeStart === "empty" ||
            res.data.data.shiftTime[1].timeStart === "empty" ||
            res.data.data.shiftTime[2].timeStart === "empty"
          ) {
            return setDataProfile(false);
          } else {
            setDataProfile(true);
          }
        })
        .catch((err) => console.log(err)));
  };

  const getDataTables = async () => {
    resID &&
      (await axios
        .get(`https://tablenow.onrender.com/api/table/get-details/${resID}`)
        .then((res) => {
          if (res.data.status === "ERR") {
            return message.error(res.data.message, 2.5);
          } else if (res.data.data.tables.length < 4) {
            return setDataTables(false);
          } else {
            setDataTables(true);
          }
        }));
  };

  const getDataMenu = async () => {
    resID &&
      (await axios
        .get(`https://tablenow.onrender.com/api/dish/get/${resID}`)
        .then((res) => {
          if (
            res.data.data.filter((e) => e.dishType === "Dish").length < 1 ||
            res.data.data.filter((e) => e.dishType === "Drink").length < 1
          ) {
            return setDataMenu(false);
          } else {
            setDataMenu(true);
          }
        })
        .catch((err) => {
          if (err.code === "ERR_BAD_REQUEST") {
            return console.log("error");
          } else console.log(err);
        }));
  };

  const getDataStaffs = async () => {
    resID &&
      (await axios
        .get(`https://tablenow.onrender.com/api/staffs/get-staff/${resID}`)
        .then((res) => {
          if (res.data.data.length < 3) {
            return setDataStaffs(false);
          } else setDataStaffs(true);
        })
        .catch((err) => {
          if (err.code === "ERR_BAD_REQUEST") {
            return console.log("error");
          } else console.log(err);
        }));
  };

  const update = async () => {
    if (
      dataMenu === true &&
      dataProfile === true &&
      dataStaffs === true &&
      dataTables === true
    ) {
      return await axios
        .put(`https://tablenow.onrender.com/api/profile/update/${id}`, {
          active: true,
        })
        .catch((err) => console.log(err));
    } else {
      await axios
        .put(`https://tablenow.onrender.com/api/profile/update/${id}`, {
          active: false,
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    update();
  }, [dataMenu, dataProfile, dataStaffs, dataTables]);

  useEffect(() => {
    getDataMenu();
  }, [resID, dataMenu]);

  useEffect(() => {
    getDataProfile();
  }, [resID, dataProfile]);

  useEffect(() => {
    getDataStaffs();
  }, [resID, dataStaffs]);

  useEffect(() => {
    getDataTables();
  }, [resID, dataTables]);

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Profile",
            icon: <HomeOutlined />,
            key: "/",
          },
          {
            label: "Menu",
            key: "/menu",
            icon: <MenuOutlined />,
          },
          {
            label: "Staffs",
            key: "/staffs",
            icon: <UsergroupAddOutlined />,
          },
          {
            label: "Reservation",
            key: "/reservation",
            icon: <CalendarOutlined />,
          },
          {
            label: "Revenue",
            key: "/revenue",
            icon: <DollarCircleOutlined />,
          },
          {
            label: "Ratings",
            key: "/ratings",
            icon: <StarOutlined />,
          },
          {
            label: "Kitchen",
            key: "/kitchen",
            icon: <FireOutlined />,
          },
        ]}
      ></Menu>
      <Layout
        style={{
          backgroundColor: "white",
          marginRight: 1,
          padding: 20,
          height: "100vh",
          width: "199px",
        }}
      >
        {dataProfile === false ||
        dataMenu === false ||
        dataStaffs === false ||
        dataTables === false ? (
          <Space direction="vertical">
            <WarningOutlined style={{ fontSize: 30, color: "red" }} />
            {dataProfile === false && (
              <Typography.Text style={{ color: "red" }}>
                ● Missing Restaurant information!
              </Typography.Text>
            )}
            {dataMenu === false && (
              <Typography.Text style={{ color: "red" }}>
                ● Missing Menu information!
              </Typography.Text>
            )}
            {dataStaffs === false && (
              <Typography.Text style={{ color: "red" }}>
                ● Missing Staffs information!
              </Typography.Text>
            )}
            {dataTables === false && (
              <Typography.Text style={{ color: "red" }}>
                ● Missing Tables information!
              </Typography.Text>
            )}
          </Space>
        ) : (
          <Space direction="vertical">
            <CheckCircleOutlined style={{ fontSize: 30, color: "#1777FF" }} />
            <Typography.Text style={{ color: "#1777FF" }}>
              Congratulation! Your restaurant is public now on Table Now app!
            </Typography.Text>
          </Space>
        )}
        <Button
          style={{ marginTop: 10 }}
          type="primary"
          onClick={() => {
            getDataMenu();
            getDataProfile();
            getDataStaffs();
            getDataTables();
          }}
          icon={<ReloadOutlined />}
        >
          Test
        </Button>
      </Layout>
    </div>
  );
}
export default SideMenu;
