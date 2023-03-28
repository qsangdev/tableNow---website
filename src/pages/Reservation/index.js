import { Layout, Space, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getReservation } from "../../API";

const Times = () => {
  const [loading, setLoading] = useState(false);
  const [times, setTimes] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      await getReservation().then((res) => {
        setTimes(res.data);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Space direction="vertical">
      <Typography.Title level={4}>Reservation</Typography.Title>
      <Layout>
        <Typography.Title level={5}>Today</Typography.Title>
        <Table
          loading={loading}
          dataSource={times}
          columns={[
            {
              title: "Shift",
              dataIndex: "id",
            },
            {
              title: "Time Start",
              dataIndex: "timeStart",
            },
            {
              title: "Time End",
              dataIndex: "timeEnd",
            },
            {
              title: "Availables Tables",
              dataIndex: "tables",
              render: (tables) => {
                return (
                  <span>
                    {tables.filter((e) => e.status === "available").length}/
                    {tables.length}
                  </span>
                );
              },
            },
          ]}
        ></Table>
      </Layout>
      <Layout>
        <Typography.Title level={5}>Tomorrow</Typography.Title>
        <Table
          loading={loading}
          dataSource={times}
          columns={[
            {
              title: "Shift",
              dataIndex: "id",
            },
            {
              title: "Time Start",
              dataIndex: "timeStart",
            },
            {
              title: "Time End",
              dataIndex: "timeEnd",
            },
            {
              title: "Availables Tables",
              dataIndex: "tables",
              render: (tables) => {
                return (
                  <span>
                    {tables.filter((e) => e.status === "available").length}/
                    {tables.length}
                  </span>
                );
              },
            },
          ]}
        ></Table>
      </Layout>
    </Space>
  );
};

export default Times;
