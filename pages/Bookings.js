import Layout from "../components/Layout";
import axios from "axios";
import Head from "next/head";
import { useStoreActions, useStoreState, useStore, action } from "easy-peasy";
import { actions, useEffect, useState } from "react";

const Bookings = props => {
  const user = useStoreState(state => state.user.user);
  const setHouseBooked = useStoreActions(
    actions => actions.user.setHouseBooked
  );
  const setUser = useStoreActions(actions => actions.user.setUser);
  const [name, setName] = useState("");
  const data = useStoreState(state => state.user.houseBooked);

  // console.log("setHouseBooked", setHouseBooked);
  const fetchingDataOnMount = () => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:4000/api/login", {
        method: "post",
        headers: {
          "content-type": "application/json",
          authorization: token
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:4000/api/house/bookings/list/${data.id}`)
              .then(response => response.json())
              .then(res => {
                setHouseBooked(res);
                setUser();
              });
          }
        });
    }
  };
  useEffect(() => {
    fetchingDataOnMount();
  }, []);

  return (
    <Layout
      content={
        <div>
          <Head>
            <title>Your bookings</title>
          </Head>
          <h2>Your bookings</h2>

          <div className="bookings">
            {data && data.length > 0 ? (
              data.map((booking, index) => {
                return (
                  <div className="booking" key={index}>
                    <img src={booking.house.picture} alt="House picture" />
                    <div>
                      <h2>
                        {booking.house.title} in {booking.house.town}
                      </h2>
                      <p>
                        Booked from{" "}
                        {new Date(booking.booking.startDate).toDateString()} to{" "}
                        {new Date(booking.booking.endDate).toDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>no House booked</div>
            )}
          </div>

          <style jsx>{`
            .bookings {
              display: grid;
              grid-template-columns: 100%;
              grid-gap: 40px;
            }

            .booking {
              display: grid;
              grid-template-columns: 30% 70%;
              grid-gap: 40px;
            }

            .booking img {
              width: 180px;
            }
          `}</style>
        </div>
      }
    />
  );
};

// Bookings.getInitialProps = async ctx => {
// const response = await axios({
//   method: "get",
//   url: "http://localhost:4000/api/house/bookings/list/",
//   headers: ctx.req
//     ? {
//         cookie: ctx.req.headers.cookie
//       }
//     : undefined
// });
// // console.log("ctx.req", response);
// return {
//   bookings: response.data
// };

// };

export default Bookings;
