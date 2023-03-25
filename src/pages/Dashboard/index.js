import {
  AlertOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Input,
  Layout,
  List,
  Space,
  TimePicker,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { getDashboard, getTimes } from "../../API";
import dayjs from "dayjs";

const Dashboard = () => {
  const [disabledName, setDisabledName] = useState(true);
  const [disabledTimes, setDisabledTimes] = useState(true);
  const [disabledAddress, setDisabledAddress] = useState(true);
  const [disabledDes, setDisabledDes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [times, setTimes] = useState([]);

  const handleEditName = () => {
    setDisabledName(!disabledName);
  };

  const handleEditTimes = () => {
    setDisabledTimes(!disabledTimes);
  };

  const handleEditAddress = () => {
    setDisabledAddress(!disabledAddress);
  };

  const handleEditDes = () => {
    setDisabledDes(!disabledDes);
  };

  useEffect(() => {
    setLoading(true);
    getDashboard().then((res) => {
      setDataSource(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getTimes().then((res) => {
      setTimes(res);
      setLoading(false);
    });
  }, []);

  return (
    <Space direction="vertical">
      <Layout style={{ marginBottom: 20 }}>
        <Typography.Title level={3}>Infomation</Typography.Title>
        <Card
          title={"Name"}
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Input
            style={{ width: "89%", marginRight: 10, height: "39px" }}
            value={dataSource.name}
            disabled={disabledName}
          />
          {disabledName === false ? (
            <Button
              style={{ height: "40px" }}
              type="primary"
              danger
              onClick={handleEditName}
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
          title="Opening Time"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            {times.open_time} - {times.close_time}
          </Typography.Title>
          <TimePicker.RangePicker
            format={"HH:mm"}
            disabled={disabledTimes}
            style={{ width: "50%", marginRight: 10, height: "39px" }}
            status="error"
          />
          {disabledTimes === false ? (
            <Button
              style={{ height: "40px" }}
              type="primary"
              danger
              onClick={handleEditTimes}
            >
              Save
            </Button>
          ) : (
            <Button
              style={{ height: "40px" }}
              type="primary"
              onClick={handleEditTimes}
            >
              Edit
            </Button>
          )}
        </Card>
        <Card
          title="Location"
          size="small"
          loading={loading}
          style={{ marginTop: 10 }}
        >
          <Input
            style={{ width: "89%", marginRight: 10, height: "39px" }}
            value={dataSource.location}
            disabled={disabledAddress}
          />
          {disabledAddress === false ? (
            <Button
              style={{ height: "40px" }}
              type="primary"
              danger
              onClick={handleEditAddress}
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
            style={{ width: "89%", marginRight: 10, height: "39px" }}
            value={dataSource.description}
            disabled={disabledDes}
          />
          {disabledDes === false ? (
            <Button
              style={{ height: "40px" }}
              type="primary"
              danger
              onClick={handleEditDes}
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
      <Layout>
        <Typography.Title level={3}>Images</Typography.Title>

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
              <Card key={e.id} style={{ margin: 10 }}>
                <Image src={e.src}></Image>
              </Card>
            );
          }}
        ></List>
        <Upload>
          <Button>Click to Upload</Button>
        </Upload>
      </Layout>
    </Space>
  );
};

export default Dashboard;
