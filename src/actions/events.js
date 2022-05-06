import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStarAddtNew = (event) => {
    return async(dispatch, getState) => {

        try {
            const resp = await fetchConToken('events', event, 'POST');
            const body = await resp.json();

            
            const { uid, name } = getState().auth;

            if(body.ok){
                event.id = body.eventoGuardado.id;

                event.user = {
                    _id: uid,
                    name
                }

                dispatch(eventAddNew(event));
                Swal.fire('Evento creado', body.msg, 'success');
            } else {
                Swal.fire('Error', body.msg, 'error');
            }
            
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }
}

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event
});

export const eventClearActiveEvent = () => ({
    type: types.eventClearActiveEvent
});

export const eventStartUpdate = (event) => {
    return async(dispatch) => {
        try {

            const resp = await fetchConToken(`events/${event.id}`, event, 'PUT');
            const body = await resp.json();

            if(body.ok){
                dispatch(eventUpdated(event));
                Swal.fire('Evento actualizado', body.msg, 'success');
            } else {
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }
}

const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event
});

export const eventStartDelete = () => {
    return async(dispatch, getState) => {
        try {
            const { id } = getState().calendar.activeEvent;
            const resp = await fetchConToken(`events/${id}`, {}, 'DELETE');
            const body = await resp.json();

            if(body.ok){
                dispatch(eventDeleted());
                Swal.fire('Evento eliminado', body.msg, 'success');
            } else {
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }
}

const eventDeleted = () => ({
    type: types.eventDeleted
});

export const eventStartLoading = () => {
    return async(dispatch) => {
        try {
            const resp = await fetchConToken('events');
            const body = await resp.json();

            const events = prepareEvents( body.eventos );
            if(body.ok){
                dispatch(eventLoaded(events));
            } else{
                Swal.fire('Error', body.msg, 'error');
            } 
        }catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }
}

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
});

export const eventLogout = () => ({
    type: types.eventLogout
});