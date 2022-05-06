import React from 'react'
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { eventStartDelete } from '../../actions/events';

export const DeleteEventFab = () => {

    const dispatch = useDispatch();

    const handleDelete = () => {
      
      Swal.fire({
        title: 'Estas seguro?',
        text: "No podras revertir esto!",
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Si, eliminar!',
        denyButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
         dispatch(eventStartDelete());
        } 
      });
    }

  return (
    <button className='btn btn-danger fab-danger' onClick={ handleDelete }>
        <i className="fas fa-trash"></i>
        <span> Borrar evento </span>
    </button>
  )
}
