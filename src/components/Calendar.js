import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import API from '../API';

const Calendar = () => {
  const [availabilities, setAvailabilities] = useState();

  useEffect(() => {
    API.get(`/apartments/availabilities/all`)
      .then(res => res.data)
      .then(data => {
        setAvailabilities(data.map(d => {
          let color = '';
          switch (d.id_apartment) {
            case 1:
              color = '';
              break;
            case 2:
              color = '#B19C09';
              break;
            case 3:
              color = 'purple';
              break;
            case 4:
              color = 'green';
              break;
            case 5:
              color = 'red';
              break;
            case 6:
              color = '#504F46';
              break;
            default:
              color = '';
          }
          return {
            id: d.id,
            title: `${d.name} -  ${d.firstname} ${d.lastname}`,
            start: d.starting_date,
            end: d.ending_date,
            color: color
          };
        }));
      });
  }, [])

  return (
    <div style={{ margin : '50px'}}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        events={availabilities}
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'prev,next'
        }}
        height='800px'
        locale='fr'
      />
    </div>
  )
}

export default Calendar;
