import {
  CloseOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons/lib/icons";
import {
  Button,
  Card,
  Divider,
  Image,
  Input,
  InputNumber,
  Layout,
  List,
  Modal,
  Space,
  Spin,
  TimePicker,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [resID, setResID] = useState("");

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
  const [dataTimes, setDataTimes] = useState([]);

  const [disabledTables, setDisabledTables] = useState(true);
  const [tables, setTables] = useState("");
  const [allTables, setAllTables] = useState([]);

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

  const handleEditTables = () => {
    setDisabledTables(false);
  };

  useEffect(() => {
    setResID(localStorage.getItem("_id"));
  }, []);

  const showConfirm = (e) => {
    confirm({
      title: "Do you want to delete this image?",
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        await axios
          .post(`http://localhost:3001/api/profile/delete-image/${resID}`, {
            images: e,
          })
          .then((res) => {
            if (res.data.status === "OK") {
              message.success(res.data.message, 2.5);
              getDataDashboard();
            } else {
              message.error(res.data.message, 2.5);
            }
          })
          .catch((res) => {
            message.error(res.data.message, 2.5);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleSaveName = async () => {
    name
      ? await axios
          .put(`http://localhost:3001/api/profile/update/${resID}`, {
            restaurantName: name,
          })
          .then((res) => {
            if (res.data.status === "ERR") {
              return message.error(res.data.message, 2.5);
            }
            getDataDashboard();
            setDisabledName(true);
          })
      : setDisabledName(true);
  };

  const handleSaveTimes = async (id) => {
    if (time === "") {
      return message.warning("Please do not leave it empty!", 2.5);
    } else if (
      id === 0 &&
      moment(time.closeTime).format("HH:mm") > dataTimes[id + 1].timeEnd
    ) {
      return message.warning(
        "The end time of this shift must not be after the start of the next shift!",
        2.5
      );
    } else if (
      id !== 0 &&
      moment(time.openTime).format("HH:mm") < dataTimes[id - 1].timeEnd
    ) {
      return message.warning(
        "Start time could not before the end of the shift before!",
        2.5
      );
    } else if (
      id !== 2 &&
      moment(time.closeTime).format("HH:mm") > dataTimes[id + 1].timeStart
    ) {
      return message.warning(
        "The end time of this shift must not be after the start of the next shift!",
        2.5
      );
    } else if (
      id === 2 &&
      moment(time.openTime).format("HH:mm") < dataTimes[id - 1].timeEnd
    ) {
      return message.warning(
        "Start time could not before the end of the shift before!",
        2.5
      );
    } else {
      return time
        ? await axios
            .post(`http://localhost:3001/api/profile/update-time/${resID}`, {
              shiftTime: [
                {
                  shift: id + 1,
                  timeStart: moment(time.openTime).format("HH:mm"),
                  timeEnd: moment(time.closeTime).format("HH:mm"),
                },
              ],
            })
            .then(() => {
              getDataDashboard();
              setDisabledTimesId(disabledTimesId === id);
            })
        : message.error("The new time has not been changed !", 2.5);
    }
  };

  const handleSaveAddress = async () => {
    address
      ? await axios
          .put(`http://localhost:3001/api/profile/update/${resID}`, {
            restaurantAddress: address,
          })
          .then(setDisabledAddress(true))
      : setDisabledAddress(true);
  };

  const handleSaveDes = async () => {
    description
      ? await axios
          .put(`http://localhost:3001/api/profile/update/${resID}`, {
            restaurantDescribe: description,
          })
          .then(setDisabledDes(true))
      : setDisabledDes(true);
  };

  useEffect(() => {
    let exportTables = [];
    for (let i = 0; i < tables; i++) {
      exportTables[i] = [
        {
          shift: 1,
          name: "Table " + (i + 1),
          status: "available",
        },
        {
          shift: 2,
          name: "Table " + (i + 1),
          status: "available",
        },
        {
          shift: 3,
          name: "Table " + (i + 1),
          status: "available",
        },
      ];
    }
    if (exportTables !== []) {
      setAllTables(exportTables.flat());
    }
  }, [tables]);

  const handleSaveTables = async () => {
    messageApi.open({
      type: "loading",
      content: "Updating..",
    });
    tables && allTables !== []
      ? await axios
          .put(`http://localhost:3001/api/table/update/${dataSource._id}`, {
            tables: allTables,
          })
          .then(async (res) => {
            if (res.data.status === "ERR") {
              return message.error(res.data.message, 2.5);
            } else {
              await axios.put(
                `http://localhost:3001/api/profile/update/${resID}`,
                {
                  restaurantTable: tables,
                }
              );
              message.success("Updating finished", 2.5);
              getDataDashboard();
              setDisabledTables(true);
            }
          })
      : message.error("Missing number of tables", 2.5);
  };

  const getDataDashboard = async () => {
    setLoading(true);
    resID
      ? await axios
          .get(`http://localhost:3001/api/profile/get-details/${resID}`)
          .then((res) => {
            if (res.data.status === "ERR") {
              return message.error(res.data.message, 2.5);
            } else {
              setLoading(false);
              setDataSource(res.data.data);
              setDataTimes(res.data.data.shiftTime);
            }
          })
          .catch((err) => console.log(err))
      : messageApi.open({
          type: "loading",
          content: "Loading..",
        });
  };

  useEffect(() => {
    getDataDashboard();
  }, [resID]);

  const handleUpload = (e) => {
    if (!(e.event instanceof ProgressEvent)) return;

    let bodyFormData = new FormData();
    bodyFormData.append("images", e.file.originFileObj);
    messageApi.open({
      type: "loading",
      content: "Uploading image..",
      duration: 2.5,
    });
    axios
      .post(`http://localhost:3001/api/profile/upload/${resID}`, bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        message.success("Uploading finished", 2.5);
        getDataDashboard();
      });
  };

  return (
    <>
      {contextHolder}
      <Space direction="vertical" style={{ alignItems: "center" }}>
        <Layout style={{ marginBottom: 20 }}>
          <Typography.Title level={3}>Infomation</Typography.Title>
          <Card
            title={"Name"}
            size="small"
            loading={loading}
            style={{ marginTop: 10, width: "750px" }}
          >
            <Input
              style={{ width: "600px", marginRight: 10, height: "39px" }}
              placeholder={dataSource.restaurantName}
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
            title="Address"
            size="small"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            <Input
              style={{ width: "600px", marginRight: 10, height: "39px" }}
              placeholder={dataSource.restaurantAddress}
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
              placeholder={dataSource.restaurantDescribe}
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
          <Card
            title="Number of Tables"
            size="small"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            <Space>
              <Typography.Title level={5} style={{ marginRight: "378px" }}>
                Current : {dataSource.restaurantTable} Tables
              </Typography.Title>
              <InputNumber
                min={1}
                max={30}
                size="large"
                defaultValue={dataSource.restaurantTable}
                disabled={disabledTables}
                onChange={(e) => setTables(e)}
                style={{
                  fontSize: 25,
                  marginRight: 2,
                }}
              />

              {disabledTables === false ? (
                <Button
                  style={{ height: "40px" }}
                  type="primary"
                  danger
                  onClick={handleSaveTables}
                >
                  Save
                </Button>
              ) : (
                <Button
                  style={{ height: "40px" }}
                  type="primary"
                  onClick={handleEditTables}
                >
                  Edit
                </Button>
              )}
            </Space>
          </Card>
          <Card
            title="Shift Time"
            size="small"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            {dataTimes ? (
              dataTimes.map((e) => {
                return (
                  <Divider
                    key={e.shift}
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Typography.Title
                      level={5}
                      style={{ marginTop: 9, marginLeft: 30, marginRight: 30 }}
                    >
                      Shift {e.shift} : {dataTimes[e.shift - 1].timeStart} -{" "}
                      {dataTimes[e.shift - 1].timeEnd}
                    </Typography.Title>
                    <TimePicker.RangePicker
                      allowClear={false}
                      format={"HH:mm"}
                      disabled={disabledTimesId !== e.shift}
                      style={{
                        width: "390px",
                        marginRight: 10,
                        height: "39px",
                      }}
                      status="error"
                      onChange={(e) =>
                        setTime({
                          openTime: e[0].$d,
                          closeTime: e[1].$d,
                        })
                      }
                    />
                    {disabledTimesId === e.shift ? (
                      <Button
                        style={{ height: "40px" }}
                        type="primary"
                        danger
                        onClick={() => handleSaveTimes(dataTimes.indexOf(e))}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        style={{ height: "40px" }}
                        type="primary"
                        onClick={() => handleEditTimes(e.shift)}
                      >
                        Edit
                      </Button>
                    )}
                  </Divider>
                );
              })
            ) : (
              <Spin></Spin>
            )}
          </Card>
        </Layout>

        <Typography.Title level={3}>Images</Typography.Title>
        <Layout style={{ flexDirection: "row" }}>
          <Upload
            key="upload-image"
            showUploadList={false}
            multiple={true}
            onChange={handleUpload}
          >
            <Button
              icon={<UploadOutlined />}
              style={{ margin: 10, width: 100 }}
            >
              Upload
            </Button>
          </Upload>
        </Layout>

        <List
          loading={loading}
          dataSource={dataSource.images}
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
                    onClick={() => showConfirm(e)}
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
                <Image src={e}></Image>
              </Card>
            );
          }}
        ></List>
      </Space>
    </>
  );
};

export default Profile;