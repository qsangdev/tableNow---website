import { StarFilled } from "@ant-design/icons";
import { Card, Divider, List, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment/moment";

const Ratings = () => {
  const [loading, setLoading] = useState(false);
  const [dataRating, setDataRating] = useState([]);

  const [resID, setResID] = useState("");

  useEffect(() => {
    setResID(localStorage.getItem("resID"));
  }, []);

  const getDataRating = async () => {
    try {
      setLoading(true);
      await axios
        .get(`http://localhost:3001/api/rating/get-details/${resID}`)
        .then((res) => {
          setDataRating(res.data.data);
          setLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDataRating();
  }, [resID]);

  return (
    <Space direction="vertical">
      <Typography.Title level={3}>Rating</Typography.Title>
      <List
        grid={{
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3.5,
          xxl: 4,
        }}
        loading={loading}
        dataSource={dataRating.sort(
          (a, b) => moment(b.createdAt) - moment(a.createdAt)
        )}
        renderItem={(e) => {
          return (
            <Card
              size="small"
              title={e.ratingName}
              key={e._id}
              style={{ margin: 50, width: "200px", height: "180px" }}
            >
              <div>
                <p>"{e.ratingComment}"</p>

                {[...Array(e.ratingStar)].map((e, i) => {
                  return (
                    <StarFilled
                      key={i}
                      style={{ color: "gold", marginTop: 10, marginBottom: 10 }}
                    />
                  );
                })}

                <p>{moment(e.createdAt).format("HH:mm DD/MM/YYYY")}</p>
              </div>
            </Card>
          );
        }}
      ></List>
    </Space>
  );
};

export default Ratings;
