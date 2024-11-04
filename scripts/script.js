let characters = [];

const characterFiles = ["kafka.json", "boothill.json", "fuxuan.json", "robin.json", "danheng.json", "jingyuan.json", "luocha.json", "argenti.json", "vaga-lume.json", "gepard.json", "cisnenegro.json", "topaz.json"];

// Função para carregar os personagens de arquivos JSON individuais
function loadCharacters() {
    const promises = characterFiles.map(file => fetch(`data/characters/${file}`).then(response => response.json()));

    Promise.all(promises)
        .then(dataArray => {
            characters = dataArray.flat();
            loadCharacterList(characters); // Carrega a lista completa inicialmente
        })
        .catch(error => console.error('Erro ao carregar personagens:', error));
}

// Função para carregar a lista de personagens
function loadCharacterList(characterArray) {
    const characterList = document.getElementById("character-list");
    characterList.innerHTML = ""; // Limpa a lista

    if (characterArray.length === 0) {
        characterList.innerHTML = "<p>Nenhum personagem encontrado para os filtros selecionados.</p>";
        return;
    }

    characterArray.forEach(char => {
        const charCard = document.createElement("div");
        charCard.className = "character";
        charCard.innerHTML = `
            <img src="${char.icon}" alt="${char.name} Icon" class="character-icon">
            <h3>${char.name}</h3>
        `;
        charCard.onclick = () => showCharacterDetails(char);
        characterList.appendChild(charCard);
    });
}

// Função para aplicar filtros e atualizar a lista de personagens
function applyFilters() {
    const elementFilter = document.getElementById("element-filter").value;
    const pathFilter = document.getElementById("path-filter").value;

    const filteredCharacters = characters.filter(char => {
        const matchesElement = elementFilter === "" || char.element === elementFilter;
        const matchesPath = pathFilter === "" || char.path === pathFilter;
        return matchesElement && matchesPath;
    });

    loadCharacterList(filteredCharacters);
}

// Função de busca para pesquisar por nome do personagem
function searchCharacter() {
    const searchQuery = document.getElementById("search-box").value.toLowerCase().trim();
    const searchResults = characters.filter(char => char.name.toLowerCase().includes(searchQuery));
    loadCharacterList(searchResults);
}

// Função para exibir os detalhes do personagem selecionado
function showCharacterDetails(character) {
    document.getElementById("character-list").style.display = "none";
    document.getElementById("search-container").style.display = "none";
    document.getElementById("filters").style.display = "none"; // Esconde filtros e pesquisa

    const details = document.getElementById("character-details");
    details.style.display = "block";

    document.getElementById("char-name").innerText = character.name;
    document.getElementById("char-role").innerText = `Função: ${character.role}`;

    const charImage = document.getElementById("char-image");
    charImage.src = character.image;
    charImage.classList.remove("visible");
    requestAnimationFrame(() => { 
        charImage.classList.add("visible");
    });

    const attacksDiv = document.getElementById("char-attacks");
    attacksDiv.innerHTML = "<h3>Ataques:</h3>";
    character.attacks.forEach(attack => {
        const attackElement = document.createElement("div");
        attackElement.innerHTML = `
            <p><strong>${attack.name}:</strong> ${attack.description}</p>
            <img src="${attack.gif}" alt="${attack.name} GIF" class="attack-gif">
        `;
        attacksDiv.appendChild(attackElement);
    });

    const eidolonsDiv = document.getElementById("char-eidolons");
    eidolonsDiv.innerHTML = "<h3>Eidolons:</h3>";
    character.eidolons.forEach(eidolon => {
        const eidolonElement = document.createElement("div");
        eidolonElement.innerHTML = `
            <p><strong>${eidolon.name}:</strong> ${eidolon.description}</p>
            <img src="${eidolon.image}" alt="${eidolon.name}" class="eidolon-image">
        `;
        eidolonsDiv.appendChild(eidolonElement);
    });

    const tracesDiv = document.getElementById("char-traces");
    tracesDiv.innerHTML = "<h3>Traços:</h3>";
    character.traces.forEach(trace => {
        const traceElement = document.createElement("p");
        traceElement.innerHTML = `<strong>${trace.name}:</strong> ${trace.description}`;
        tracesDiv.appendChild(traceElement);
    });

    const lightConeDiv = document.getElementById("char-light-cone");
    lightConeDiv.innerHTML = "<strong>Light Cone:</strong><br>";
    character.lightCone.forEach(lc => {
        lightConeDiv.innerHTML += `
            ${lc.name}: ${lc.description} <br>
            <img src="${lc.image}" alt="${lc.name}" class="lightcone-image"> <br>
        `;
    });

    const relicsDiv = document.getElementById("char-relics");
    relicsDiv.innerHTML = `
        <strong>Relíquias:</strong> ${character.relics.name} <br>
        <img src="${character.relics.image}" alt="${character.relics.name}" class="relic-image">
    `;

    const ornamentsDiv = document.getElementById("char-ornaments");
    ornamentsDiv.innerHTML = `
        <strong>Ornamentos:</strong> ${character.ornaments.name} <br>
        <img src="${character.ornaments.image}" alt="${character.ornaments.name}" class="ornament-image">
    `;
}

// Botão de voltar
document.getElementById("back-button").onclick = () => {
    document.getElementById("character-details").style.display = "none";
    const characterList = document.getElementById("character-list");
    characterList.style.display = "grid";

    // Mostra a pesquisa e os filtros novamente
    document.getElementById("search-container").style.display = "flex";
    document.getElementById("filters").style.display = "block";
};

// Eventos para aplicar filtros e buscar
document.getElementById("apply-filters").onclick = applyFilters;
document.getElementById("search-button").addEventListener('click', searchCharacter);

// Carregar personagens ao iniciar
document.addEventListener("DOMContentLoaded", loadCharacters);
