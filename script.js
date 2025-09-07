document.addEventListener("DOMContentLoaded", () => {
    const tituloPagina = document.querySelectorAll('.tituloPagina')
    const body = document.querySelectorAll('.body')
    const button = document.querySelectorAll('.botao');
    const botaoSecundario = document.querySelectorAll('.botaoSecundario');
    const modulosCabecalho = document.querySelectorAll('.moduloCabecalho'); // Seleciona todos os elementos com a classe
    // Enventos para o Body
    body.forEach(moduloBody => {
        moduloBody.style.backgroundColor = "#F2E9DC"
    });
    // Eventos para o Botão Principal
    const mediaQuery = window.matchMedia("(max-width: 768px");
    function aplicarMudanca(e) {
        if (e.matches) {
            document.tituloPagina.margin = "0px 2rem";
        }
        else {
            tituloPagina.forEach(moduloButton => {
                Object.assign(moduloButton.style, {
                    display: "flex",
                    padding: "0.6rem 1.3rem",
                    margin: "0px 13em",
                    color: "Black",
                    borderRadius: "0.7rem",
                    alignItems: "center",
                    fontWeight: "bold",
                    color: "#302218",
                });
            });               
        }
    }
    aplicarMudanca(tituloPagina);
    mediaQuery.addEventListener("change", aplicarMudanca);
    // Eventos para o Botão Principal
    button.forEach(moduloButton => {
        moduloButton.addEventListener("mouseover", () => {
            moduloButton.style.backgroundColor = "#E19C82";
        });
        moduloButton.addEventListener("mouseout", () => {
            moduloButton.style.backgroundColor = "#8B594A";
        });
        Object.assign(moduloButton.style, {
            display: "flex",
            padding: "0.6rem 1.3rem",
            backgroundColor: "#8B594A",
            borderRadius: "0.7rem",
            alignItems: "center",
            color: "black",
            fontWeight: "bold",
            textecoratDion: "none"
        });
    });
    botaoSecundario.forEach(moduloButton => {
        moduloButton.addEventListener("mouseover", () => {
            moduloButton.style.backgroundColor = "#754624";
        });
        moduloButton.addEventListener("mouseout", () => {
            moduloButton.style.backgroundColor = "#AA663E";
        });
        Object.assign(moduloButton.style, {
            display: "flex",
            padding: "0.6rem 3.7rem",
            margin: "1px",
            backgroundColor: "#AA663E",
            alignItems: "center",
            color: "black",
            textecoratDion: "none",
            fontWeight: "bold"
        });
    });
    
    // Eventos para cada elemento com a classe moduloCabecalho
    modulosCabecalho.forEach(modulo => {
        modulo.addEventListener("mouseover", () => {
            modulo.style.backgroundColor = "#D8C9B2";
        });
        
        modulo.addEventListener("mouseout", () => {
            modulo.style.backgroundColor = "#F2E8DB";
        });

        modulo.addEventListener("click", () => {
            modulo.style.backgroundColor = "#F2E8DB";
            setTimeout(() => {
                modulo.style.backgroundColor = "#D8C9B2";
            }, 130);
        });
    });
});