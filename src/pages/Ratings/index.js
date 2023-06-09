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
        .get(`https://tablenow.onrender.com/api/rating/get-details/${resID}`)
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
    <Space direction="vertical" style={{ maxWidth: "1500px" }}>
      <Typography.Title level={3}>Rating</Typography.Title>
      <List
        grid
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
              style={{ margin: 50, width: "200px", maxHeight: "250px" }}
            >
              <div>
                <p>{moment(e.createdAt).format("HH:mm DD/MM/YYYY")}</p>

                {[...Array(e.ratingStar)].map((e, i) => {
                  return (
                    <StarFilled
                      key={i}
                      style={{ color: "gold", marginTop: 10, marginBottom: 10 }}
                    />
                  );
                })}
                <p>
                  {e.ratingComment.length > 27
                    ? `${e.ratingComment.slice(0, 27)}..`
                    : e.ratingComment}
                  </p>
              </div>
            </Card>
          );
        }}
      ></List>
    </Space>
  );
};

export default Ratings;
