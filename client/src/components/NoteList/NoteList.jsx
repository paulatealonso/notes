import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoteList = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get('/notes');
                setNotes(response.data.notes);
            } catch (error) {
                console.error('Error al obtener las notas:', error);
            }
        };

        fetchNotes();
    }, []);


    return (
        <div>
            <h1>Lista de Notas</h1>

            {/* Barra de búsqueda */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar notas..."
            />

            {/* Filtros de búsqueda */}
            {/* Botón para crear nuevas notas */}

            {/* Renderizar la lista de notas */}
            {notes.map((note) => (
                <div key={note.id}>
                    <h3>{note.title}</h3>
                    {/* Resto de la información de la nota */}
                </div>
            ))}

        </div>
    )
}

export default NoteList