import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStarAddtNew, eventStartUpdate } from '../../actions/events';

import Modal from 'react-modal';
import moment from 'moment';
import DatePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Swal from 'sweetalert2';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
};

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate(),
}

export const CalendarModal = () => {
  
  const { modalOpen } = useSelector(state => state.ui);
  const { activeEvent } = useSelector(state => state.calendar);

  const dispatch = useDispatch();

  const [ dateStart, setDateStart ] = useState(now.toDate())
  const [ dateEnd, setDateEnd ] = useState(nowPlus1.toDate())
  const [titleValid, setTileValid] = useState(true)

  const [formValues, setformValues] = useState( initEvent );

  const { title, notes, start, end} = formValues;

  useEffect(() => {
    if(activeEvent){
        setformValues(activeEvent);
    } else {
        setformValues( initEvent );
    }
  }, [activeEvent, setformValues])
  

  const handleInputChange = ({target}) => {
    setformValues({
      ...formValues,
      [target.name]: target.value
    });
  }

  const closeModal = () => {
      dispatch(uiCloseModal());
      dispatch(eventClearActiveEvent());
      setformValues( initEvent );
  } 

  const handleStartDateChange = (e) => {
    setDateStart(e);
    setformValues({
        ...formValues,
        start: e
    });
  }

  const handleEndDateChange = (e) => {
    setDateEnd(e);
    setformValues({
        ...formValues,
        end: e
    });
  }
  const yesterday = moment(dateStart).subtract(1, 'day')
  const valid = ( current ) => {
    return current.isAfter( yesterday );
  };

  const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if(momentStart.isSameOrAfter (momentEnd )){
            Swal.fire({
                title: 'Error',
                text: 'La fecha de inicio debe ser menor a la fecha de fin',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        if(title.trim().length < 2){
            return setTileValid(false);
        }

        //TODO: Enviar el formulario a base de datos
        
        if(activeEvent){
            dispatch(eventStartUpdate(formValues));

        }else{
            
            dispatch( eventStarAddtNew( formValues ));
        }
        setTileValid(true);
        closeModal();
    }


  return (
    <Modal
        isOpen={ modalOpen }
        // onAfterClose={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        closeTimeoutMS={200}
        className="modal"
        overlayClassName="modal-fondo"
    >
        <h1> { (activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
        <hr />
        <form className="container" onSubmit={handleSubmitForm}>

            <div className="form-group">
                <label>Fecha y hora inicio</label>
                <DatePicker
                        inputProps={{
                            style: { width: 250, background: 'white', color: 'black' }
                        }}
                        value={ dateStart }
                        onChange={ handleStartDateChange }
                        dateFormat="DD-MM-YYYY"
                        timeFormat="hh:mm A"
                        closeOnSelect= { true }
                        closeOnClickOutside={ true }
                        
                    />
            </div>

            <div className="form-group">
                <label>Fecha y hora fin</label>
                <DatePicker
                        inputProps={{
                            style: { width: 250, background: 'white', color: 'black' }
                        }}
                        value={ dateEnd }
                        isValidDate={ valid }
                        onChange={ handleEndDateChange }
                        dateFormat="DD-MM-YYYY"
                        timeFormat="hh:mm A"
                        closeOnSelect= { true }
                        closeOnClickOutside={ true }
                        
                    />
            </div>

            <hr />
            <div className="form-group">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${!titleValid && 'is-invalid'}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={ title }
                    onChange={ handleInputChange }
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={ notes }
                    onChange={ handleInputChange }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>
    </Modal>
  )
}
