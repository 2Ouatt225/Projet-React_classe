import React from "react";
import Etudiant1 from "./application1";

function ApplicationsReact(){
    return(
        <Etudiant1
            nom="Doe"
            prenom="John"
            age={20}
            noteEC={9}
            notePR={10}
        />
    )
}

export default ApplicationsReact;