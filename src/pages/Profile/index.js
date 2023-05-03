import {
  CloseOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
  EnvironmentFilled,
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
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { getLatLng, geocodeByAddress } from "react-google-places-autocomplete";
import Meta from "antd/es/card/Meta";

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

  const [dataTables, setDataTables] = useState([]);
  const [editTable, setEditTable] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [disabledTables, setDisabledTables] = useState(true);
  const [tables, setTables] = useState("");
  const [allTables, setAllTables] = useState([]);

  const [coords, setCoords] = useState(null);

  const { confirm } = Modal;

  const handleEditName = () => {
    setDisabledName(false);
    setName(dataSource.restaurantName);
  };

  const handleEditAddress = () => {
    setDisabledAddress(false);
    setAddress(dataSource.restaurantAddress);
  };

  const handleEditTimes = (id) => {
    setDisabledTimesId(id);
  };

  const handleEditDes = () => {
    setDisabledDes(false);
    setDescription(dataSource.restaurantDescribe);
  };

  const handleEditTables = () => {
    setDisabledTables(false);
  };

  const handleEditTable = (id, max, min) => {
    setEditTable(id);
    setMax(max);
    setMin(min);
  };

  useEffect(() => {
    setResID(localStorage.getItem("resID"));
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
          .put(`http://localhost:3001/api/profile/update/${dataSource._id}`, {
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
            .post(
              `http://localhost:3001/api/profile/update-time/${dataSource._id}`,
              {
                shiftTime: [
                  {
                    shift: id + 1,
                    timeStart: moment(time.openTime).format("HH:mm"),
                    timeEnd: moment(time.closeTime).format("HH:mm"),
                  },
                ],
              }
            )
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
          .put(`http://localhost:3001/api/profile/update/${dataSource._id}`, {
            restaurantAddress: address,
          })
          .then(() => {
            getDataDashboard();
            setDisabledAddress(true);
          })
      : setDisabledAddress(true);
  };

  const handleSaveDes = async () => {
    description
      ? await axios
          .put(`http://localhost:3001/api/profile/update/${dataSource._id}`, {
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
          minPeople: 1,
          maxPeople: 4,
        },
        {
          shift: 2,
          name: "Table " + (i + 1),
          minPeople: 1,
          maxPeople: 4,
        },
        {
          shift: 3,
          name: "Table " + (i + 1),
          minPeople: 1,
          maxPeople: 4,
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
          .put(`http://localhost:3001/api/table/update/${resID}`, {
            tables: allTables,
          })
          .then(async (res) => {
            getDataTables();
            if (res.data.status === "ERR") {
              return message.error(res.data.message, 2.5);
            } else {
              await axios.put(
                `http://localhost:3001/api/profile/update/${dataSource._id}`,
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
      : setLoading(true);
  };

  const getDataTables = async () => {
    setLoading(true);
    resID
      ? await axios
          .get(`http://localhost:3001/api/table/get-details/${resID}`)
          .then((res) => {
            if (res.data.status === "ERR") {
              return message.error(res.data.message, 2.5);
            } else {
              setLoading(false);
              setDataTables(
                res.data.data.tables.filter((e) => e.shift % 2 === 0)
              );
            }
          })
      : setLoading(true);
  };

  useEffect(() => {
    getDataDashboard();
  }, [resID]);

  useEffect(() => {
    getDataTables();
  }, [resID]);

  const Position = ({ text }) => <div>{text}</div>;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );

    const getCoords = async () => {
      const results = await geocodeByAddress(dataSource?.restaurantAddress);
      const latlong = await getLatLng(results[0]);
      setCoords(latlong);
      await axios
        .put(`http://localhost:3001/api/profile/update/${dataSource._id}`, {
          latitude: latlong.lat,
          longitude: latlong.lng,
        })
        .then((res) => console.log(res));
    };

    dataSource && getCoords();
  }, [dataSource]);

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

  const handleDeleteTable = (name) => {
    confirm({
      title: "Do you want to delete this table?",
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        await axios
          .post(`http://localhost:3001/api/table/delete/${resID}`, {
            tables: [
              {
                name: name,
              },
            ],
          })
          .then(async (res) => {
            await axios
              .put(
                `http://localhost:3001/api/profile/update/${dataSource._id}`,
                {
                  restaurantTable: dataSource.restaurantTable - 1,
                }
              )
              .then(() => getDataDashboard());
            if (res.data.status === "OK") {
              message.success(res.data.message, 2.5);
              getDataTables();
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

  const handleSaveTable = async (name) => {
    if (!min || !max) {
      return message.warning("Cannot be left blank", 2.5);
    } else if (min >= max) {
      return message.warning("Min can't be bigger than Max, you know?", 2.5);
    } else {
      await axios
        .post(`http://localhost:3001/api/table/update-minmax/${resID}`, {
          tables: [
            {
              name: name,
              minPeople: min,
              maxPeople: max,
            },
          ],
        })
        .then((res) => {
          if (res.data.status === "OK") {
            message.success(res.data.message, 2.5);
            getDataTables();
            setEditTable(false);
            setMax("");
            setMin("");
          } else {
            message.error(res.data.message, 2.5);
          }
        });
    }
  };

  return (
    <>
      {contextHolder}
      <Space
        direction="vertical"
        style={{ alignItems: "center", maxWidth: "1000px" }}
      >
        <Layout style={{ marginBottom: 20 }}>
          <Typography.Title level={3}>Infomation</Typography.Title>
          <Card
            title={"Name"}
            size="small"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            <Input
              style={{ width: "660px", marginRight: 10, height: "39px" }}
              placeholder={dataSource.restaurantName}
              disabled={disabledName}
              value={name}
              maxLength={30}
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
              style={{ width: "660px", marginRight: 10, height: "39px" }}
              placeholder={dataSource.restaurantAddress}
              disabled={disabledAddress}
              value={address}
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
            <div style={{ height: "300px", width: "100%", marginTop: 10 }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_API_MAP }}
                defaultCenter={coords}
                defaultZoom={11}
                center={coords}
              >
                <Position
                  lat={coords?.lat}
                  lng={coords?.lng}
                  text={
                    <EnvironmentFilled style={{ color: "red", fontSize: 20 }} />
                  }
                />
              </GoogleMapReact>
            </div>
          </Card>
          <Card
            title="Description"
            size="small"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            <TextArea
              rows={4}
              style={{ width: "660px", marginRight: 10 }}
              placeholder={dataSource.restaurantDescribe}
              disabled={disabledDes}
              value={description}
              maxLength={150}
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
            title="Number of Tables (Minimum 4 tables)"
            size="small"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            <Space>
              <Typography.Title level={5} style={{ marginRight: "430px" }}>
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
                  Reset
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
            title="Tables"
            size="small"
            loading={loading}
            style={{ marginTop: 10, maxWidth: "750px" }}
          >
            <List
              grid={{
                gutter: 10,
                xs: 0,
                sm: 3,
                md: 4,
                lg: 4,
                xl: 5,
                xxl: 5,
              }}
              dataSource={dataTables}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.name} style={{ textAlign: "center" }}>
                    <Tooltip title="delete">
                      <Button
                        onClick={() => handleDeleteTable(item.name)}
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
                    {editTable === item._id ? (
                      <>
                        <p>
                          Min Seats:{" "}
                          <InputNumber
                            min={1}
                            max={15}
                            size="small"
                            defaultValue={item.minPeople}
                            disabled={editTable !== item._id}
                            onChange={(e) => setMin(e)}
                          />
                        </p>
                        <p>
                          Max Seats:{" "}
                          <InputNumber
                            min={1}
                            max={15}
                            size="small"
                            defaultValue={item.maxPeople}
                            disabled={editTable !== item._id}
                            onChange={(e) => setMax(e)}
                          />
                        </p>
                      </>
                    ) : (
                      <>
                        <p>Min Seats: {item.minPeople}</p>
                        <p>Max Seats: {item.maxPeople}</p>
                      </>
                    )}
                    {editTable === item._id ? (
                      <Button
                        type="primary"
                        danger
                        style={{ marginTop: 15 }}
                        onClick={() => handleSaveTable(item.name)}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        style={{ marginTop: 15 }}
                        onClick={() =>
                          handleEditTable(
                            item._id,
                            item.maxPeople,
                            item.minPeople
                          )
                        }
                      >
                        Edit
                      </Button>
                    )}
                  </Card>
                </List.Item>
              )}
            />
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
        <Typography.Text level={3}>(Minimum 4 images)</Typography.Text>
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
                loading={loading}
                cover={<Image src={e}></Image>}
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
                <Meta title={dataSource.restaurantName}></Meta>
              </Card>
            );
          }}
        ></List>
      </Space>
    </>
  );
};

export default Profile;
