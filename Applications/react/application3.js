import React, { useState } from "react";

function Etudiant3() {
    const [nom] = useState("Dupont Jean");
    const [moyenne, setMoyenne] = useState(Math.round(Math.random() * 20));

    const regenererMoyenne = () => {
        setMoyenne(Math.round(Math.random() * 20));
    };

    const dateSession2 = new Date();
    dateSession2.setMonth(dateSession2.getMonth() + 1);

    return (
        <div>
            <h2>Etudiant3</h2>
            <p><strong>Nom:</strong> {nom}</p>
            <p><strong>Moyenne:</strong> {moyenne}/20</p>
            
            {moyenne <= 10 && (
                <p style={{ color: 'red' }}>
                    <strong>Date de la session 2:</strong> {dateSession2.toLocaleDateString('fr-FR')}
                </p>
            )}
            
            <button onClick={regenererMoyenne}>
                Régénérer la moyenne
            </button>
        </div>
    );
}

export default Etudiant3;
