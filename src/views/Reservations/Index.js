import React, { Fragment, useContext } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import AddToCalendar from "react-add-to-calendar";
import "./Index.css";
import { cache, useApi } from "../../hooks/useApi";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import Emoji from "../../components/Emoji/Emoji";
import { LoadedContent } from "../../components/Loader/Loader";
import { Button } from "../../components/Button/Button";

const Index = () => {
  const {
    currentLocation: { id: locationId },
  } = useContext(BoulderDBUIContext);

  const { status: reservationStatus, data: reservations } = useQuery(
    "reservations",
    useApi("reservations")
  );
  const { status: locationStatus, data: location } = useQuery(
    [cache.location, { locationId }],
    useApi("location", { id: locationId })
  );

  const [mutateDeletion] = useMutation(useApi("deleteReservation"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries("schedule");
      queryCache.invalidateQueries("reservations");
      queryCache.invalidateQueries("reservations-count");
    },
  });

  return (
    <Fragment>
      <h1 className="t--alpha page-title">Reservations</h1>

      <LoadedContent
        loading={[locationStatus, reservationStatus].includes("loading")}
      >
        <ul className="blocked-time-slots">
          {reservations && location ? (
            reservations.map((pending) => {
              const event = {
                title: `Bouldern (+ ${pending.quantity - 1})`,
                description: "",
                location: `${location.address_line_one} ${location.zip}, ${location.city}`,
                startTime: `${pending.date} ${pending.start_time}`,
                endTime: `${pending.date} ${pending.end_time}`,
              };

              return (
                <li
                  className="blocked-time-slots__item blocked-time-slots-item"
                  key={pending.id}
                >
                  <span>
                    On {pending.date} • From {pending.start_time} to{" "}
                    {pending.end_time}
                  </span>

                  <span>
                    {pending.quantity > 1 && (
                      <Fragment>+{pending.quantity - 1}</Fragment>
                    )}
                  </span>

                  <div className="blocked-time-slots-item__calendar">
                    <AddToCalendar
                      event={event}
                      buttonLabel="Copy to Calendar"
                    />
                  </div>

                  <Button
                    variant="danger"
                    size="small"
                    onClick={async () => {
                      await mutateDeletion({ id: pending.id });
                    }}
                  >
                    Cancel
                  </Button>
                </li>
              );
            })
          ) : (
            <h2 className="t--gamma">
              <Emoji>🤷</Emoji>
            </h2>
          )}
        </ul>
      </LoadedContent>
    </Fragment>
  );
};

export { Index };
