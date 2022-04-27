import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { messages } from '../../helpers/calendar-messages-es';
import { Navbar } from '../ui/Navbar'
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');



const localizer = momentLocalizer(moment)

// const events = [{
//   title: 'Cumpleaños del jefe',
//   start: moment().toDate(),
//   end: moment().add(2, 'hours').toDate(),
//   bgColor: '#fafafa',
//   notes: 'Comprar pastel',
//   user: {
//     _id: '123',
//     name: 'Juan Perez',
//   }
// }]

export const CalendarScreen = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(state => state.calendar);

  const [lastView, setLastView] = useState( localStorage.getItem('lastView') || 'month');

  const onDoubleClick = (e) => {
    dispatch(uiOpenModal());
  }

  const onSelectEvent = (e) => {
    dispatch(eventSetActive(e));
  }

  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem('lastView', e);
  }

  const onSelectSlot = (e) => {
    dispatch( eventClearActiveEvent());
  }

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    const style = {
      backgroundColor: '#367CF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      display: 'block'
    }

    return {
      style
    }
  }

  return (
    <div className='calendar-screen'>
      <Navbar />


      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelectEvent}
        onView={onViewChange}
        onSelectSlot = { onSelectSlot }
        selectable = { true }
        view={lastView}
        components={{
          event: CalendarEvent
        }}
      />

      <AddNewFab />
      {
        activeEvent &&
        <DeleteEventFab />
      }
      <CalendarModal />

    </div>
  )
}
