import {
  CloseOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons/lib/icons";
import {
  Button,
  Card,
  Image,
  Input,
  Layout,
  List,
  Modal,
  Space,
  Spin,
  TimePicker,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getDashboard, getImages, getReservation } from "../../API";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [disabledName, setDisabledName] = useState(true);
  const [time, setTime] = useState("");
  const [disabledTimesId, setDisabledTimesId] = useState("");
  const [address, setAddress] = useState("");
  const [disabledAddress, setDisabledAddress] = useState(true);
  const [description, setDescription] = useState("");
  const [disabledDes, setDisabledDes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [times, setTimes] = useState([]);
  const [images, setImages] = useState([]);

  const [editImage, setEditImage] = useState(false);
  const handleEditImage = () => {
    setEditImage(!editImage);
  };
  const { confirm } = Modal;

  const handleEditName = () => {
    setDisabledName(false);
  };

  const handleEditAddress = () => {
    setDisabledAddress(false);
  };

  const handleEditTimes = (id) => {
    setDisabledTimesId(id);
  };

  const handleEditDes = () => {
    setDisabledDes(false);
  };

  const showConfirm = async (id) => {
    confirm({
      title: "Do you want to delete this image?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        axios
          .delete(`http://localhost:3000/images/${id}`)
          .then(getDataImages());
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleSaveName = async () => {
    name
      ? await axios
          .patch("http://localhost:3000/profile", { name: name })
          .then(() => {
            getDataDashboard();
            setDisabledName(true);
          })
      : setDisabledName(true);
  };

  const handleSaveTimes = async (id) => {
    if (!time) {
      return alert("Please do not leave it blank!");
    } else if (
      moment(time.openTime).format("HH:mm") < times[id - 1].timeStart &&
      id !== 1
    ) {
      return alert("Start time could not before the end of the shift before!");
    } else if (
      moment(time.closeTime).format("HH:mm") > times[id].timeStart &&
      id !== 3
    ) {
      return alert(
        "The end time of this shift must not be after the start of the next shift!"
      );
    } else {
      time
        ? await axios
            .patch(`http://localhost:3000/shift/${id}`, {
              timeStart: moment(time.openTime).format("HH:mm"),
              timeEnd: moment(time.closeTime).format("HH:mm"),
            })
            .then(() => {
              getDataTimes();
              setDisabledTimesId(disabledTimesId === id);
            })
        : alert("The new time has not been changed !");
    }
  };

  const handleSaveAddress = async () => {
    address
      ? await axios
          .patch("http://localhost:3000/profile", { location: address })
          .then(setDisabledAddress(true))
      : setDisabledAddress(true);
  };

  const handleSaveDes = async () => {
    description
      ? await axios
          .patch("http://localhost:3000/profile", { description: description })
          .then(setDisabledDes(true))
      : setDisabledDes(true);
  };

  const getDataDashboard = () => {
    setLoading(true);
    getDashboard().then((res) => {
      setDataSource(res.data);
      setLoading(false);
    });
  };

  const getDataImages = () => {
    setLoading(true);
    getImages().then((res) => {
      setImages(res.data);
      setLoading(false);
    });
  };

  const getDataTimes = () => {
    setLoading(true);
    getReservation().then((res) => {
      setTimes(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getDataDashboard();
  }, []);

  useEffect(() => {
    getDataImages();
  }, []);

  useEffect(() => {
    getDataTimes();
  }, []);

  return (
    <Space direction="vertical" style={{ alignItems: "center" }}>
      <Layout style={{ marginBottom: 20 }}>
        <Typography.Title level={3}>Infomation</Typography.Title>
        <Card
          title={"Name"}
          size="small"
          loading={loading}
          style={{ marginTop: 10, width: "700px" }}
        >
          <Input
            style={{ width: "600px", marginRight: 10, height: "39px" }}
            placeholder={dataSource.name}
            disabled={disabledName}
            onChange={(e) => setName(e.target.value)}
          />
          {disabledName === false ? (
            <Button
              style={{ height: "40px" }}
              type="primary"
              danger
              onClick={handleSaveName}
            >
              Save
            </Button>
          ) : (
            <Button
              style={{ height: "40px" }}
              type="primary"
              onClick={handleEditName}
            >
              Edit
            </Button>
          )}
        </Card>
        <Card
          title="Time Shifts"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          {times.length > 0 ? (
            times.map((e) => {
              return (
                <Layout
                  key={e.id}
                  style={{
                    flexDirection: "row",
                    padding: 5,
                  }}
                >
                  <Typography.Title
                    level={5}
                    style={{ marginTop: 9, marginLeft: 30, marginRight: 30 }}
                  >
                    Shift {e.id}: {times[e.id - 1].timeStart} -{" "}
                    {times[e.id - 1].timeEnd}
                  </Typography.Title>
                  <TimePicker.RangePicker
                    format={"HH:mm"}
                    disabled={disabledTimesId !== e.id}
                    style={{ width: "390px", marginRight: 10, height: "39px" }}
                    status="error"
                    onChange={(e) =>
                      setTime({
                        openTime: e[0].$d,
                        closeTime: e[1].$d,
                      })
                    }
                  />
                  {disabledTimesId === e.id ? (
                    <Button
                      style={{ height: "40px" }}
                      type="primary"
                      danger
                      onClick={() => handleSaveTimes(e.id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      style={{ height: "40px" }}
                      type="primary"
                      onClick={() => handleEditTimes(e.id)}
                    >
                      Edit
                    </Button>
                  )}
                </Layout>
              );
            })
          ) : (
            <Spin></Spin>
          )}
        </Card>
        <Card
          title="Address"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Input
            style={{ width: "600px", marginRight: 10, height: "39px" }}
            placeholder={dataSource.location}
            disabled={disabledAddress}
            onChange={(e) => setAddress(e.target.value)}
          />
          {disabledAddress === false ? (
            <Button
              style={{ height: "40px" }}
              type="primary"
              danger
              onClick={handleSaveAddress}
            >
              Save
            </Button>
          ) : (
            <Button
              style={{ height: "40px" }}
              type="primary"
              onClick={handleEditAddress}
            >
              Edit
            </Button>
          )}
        </Card>
        <Card
          title="Description"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Input
            style={{ width: "600px", marginRight: 10, height: "39px" }}
            placeholder={dataSource.description}
            disabled={disabledDes}
            onChange={(e) => setDescription(e.target.value)}
          />
          {disabledDes === false ? (
            <Button
              style={{ height: "40px" }}
              type="primary"
              danger
              onClick={handleSaveDes}
            >
              Save
            </Button>
          ) : (
            <Button
              style={{ height: "40px" }}
              type="primary"
              onClick={handleEditDes}
            >
              Edit
            </Button>
          )}
        </Card>
      </Layout>

      <Typography.Title level={3}>Images</Typography.Title>
      <Layout style={{ flexDirection: "row" }}>
        {editImage ? (
          <Button onClick={handleEditImage} style={{ margin: 10 }} danger>
            Done
          </Button>
        ) : (
          <Button onClick={handleEditImage} style={{ margin: 10 }}>
            Edit
          </Button>
        )}
        <Upload>
          <Button style={{ margin: 10 }}>Upload</Button>
        </Upload>
      </Layout>
      {editImage ? (
        <List
          style={{}}
          loading={loading}
          dataSource={images}
          grid={{
            xs: 1,
            sm: 1.5,
            md: 2,
            lg: 3,
            xl: 3.5,
            xxl: 4,
          }}
          renderItem={(e) => {
            return (
              <Card
                key={e.id}
                style={{
                  margin: 10,
                }}
              >
                <Tooltip title="delete">
                  <Button
                    onClick={() => showConfirm(e.id)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                    type="primary"
                    shape="circle"
                    danger
                    icon={<CloseOutlined />}
                  />
                </Tooltip>
                <Image src={e.src}></Image>
              </Card>
            );
          }}
        ></List>
      ) : (
        <List
          style={{}}
          loading={loading}
          dataSource={images}
          grid={{
            xs: 1,
            sm: 1.5,
            md: 2,
            lg: 3,
            xl: 3.5,
            xxl: 4,
          }}
          renderItem={(e) => {
            return (
              <Card
                key={e.id}
                style={{
                  margin: 10,
                }}
              >
                <Image src={e.src}></Image>
              </Card>
            );
          }}
        ></List>
      )}
    </Space>
  );
};

export default Dashboard;
