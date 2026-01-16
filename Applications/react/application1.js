import eact from "react";

function Etudiant1(props){
    const moyenne = (parseFloat(props.noteEC) + (parseFloat(props.notePR)*2)) / 3;
    let dateSession = new Date();
    dateSession.setMonth(dateSession.getMonth() + 1);
    return(
        <div>
            <h1>Etudiant</h1>
            <p>Nom: {props.nom}</p>
            <p>Prénom: {props.prenom}</p>
            <p>Moyenne: {moyenne}</p>
            <p>Âge: {props.age}</p>
            <p>NoteEC: {props.noteEC}</p>
            <p>NotePR: {props.notePR}</p>
            {moyenne <= 10 && <p>Date de session: {dateSession.toLocaleDateString()}</p>}
        </div>
    )

}
export default Etudiant1;