import React from 'react'
import { useSelector } from 'react-redux';
import styles from '../../styles/styles'
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const events = Array.isArray(allEvents) ? allEvents : [];

  return (
    <div>
      {
        !isLoading && (
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1>Popular Events</h1>
            </div>

            <div className="w-full grid">
              {
                events.length > 0 ? (
                  <EventCard data={events[0]} />
                ) : null
              }
            </div>

          </div>
        )
      }
    </div>
  )
}

export default Events