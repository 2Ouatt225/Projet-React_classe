import React from "react";

class Etudiant2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: "Dupont Jean",
            moyenne: Math.round(Math.random() * 20)
        };
    }
    regenererMoyenne = () => {
        this.setState({
            moyenne: Math.round(Math.random() * 20)
        });
    }

    render() {
        const { nom, moyenne } = this.state;
        
        let dateSession2 = new Date();
        dateSession2.setMonth(dateSession2.getMonth() + 1);

        return (
            <div>
                <h2>Etudiant2 </h2>
                <p><strong>Nom:</strong> {nom}</p>
                <p><strong>Moyenne:</strong> {moyenne}/20</p>
                
                {moyenne <= 10 && (
                    <p style={{ color: 'red' }}>
                        <strong>Date de la session 2:</strong> {dateSession2.toLocaleDateString('fr-FR')}
                    </p>
                )}
                
                <button 
                    onClick={this.regenererMoyenne}
                    
                >
                    Régénérer la moyenne
                </button>
            </div>
        );
    }
}

export default Etudiant2;