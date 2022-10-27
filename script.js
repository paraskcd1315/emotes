const head = document.getElementsByTagName("head")[0];
const body = document.getElementsByTagName("body")[0];
const fullURL = document.location.href;

fetch("./index.json")
.then(response => response.json())
.then(json => {
    const data = json;
    const { name, icon, path, emotes } = data;

    //Set title for the Website dynamically
    document.title = name;

    //Check if optionals are available and add to Data
    if(data["author"] !== undefined && 'author' in data && data['author'] !== null) {
        const authorTag = document.createElement("meta");

        authorTag.setAttribute("name", "author");
        authorTag.setAttribute("content", data["author"]);

        head.appendChild(authorTag)
    }

    if(data["description"] !== undefined && 'description' in data && data['description'] !== null) {
        const descriptionTag = document.createElement("meta");

        descriptionTag.setAttribute("name", "description");
        descriptionTag.setAttribute("content", data["description"]);

        head.appendChild(descriptionTag);
    }

    if(data["keywords"] !== undefined && "keywords" in data && data["keywords"] !== null) {
        const keywordTag = document.createElement("meta");

        keywordTag.setAttribute("name", "keywords");
        keywordTag.setAttribute("content", data["keywords"]);

        head.appendChild(keywordTag);
    }

    body.innerHTML = 
    `
    <div class='mainContainer'>
        <div class='repoTitle'>
            <img src='./${icon}' alt='${name}' />
            <h1>${name}</h1>
        </div>
        <div class='contentContainer'>
            <div class='content'>
                <span>URL - <strong>${fullURL}</strong></span>
                <span>Number of Emotes - <strong>${emotes.length}</strong></span>
                <button id="addRepo" class='btn'>Add to <span>Nitroless</span></button>
            </div>
            <div class='content emotes'>
                ${emotes.map((emote) => {
                    return `
                    <div id='${fullURL}/${path}/${emote.name}.${emote.type}' class='emote'>
                        <img src='./${path}/${emote.name}.${emote.type}' alt='${emote.name}' />
                    </div>
                    `
                }).join("")}
            </div>
        </div>
    </div>
    `

    if(document.getElementById("addRepo")) {
        document.getElementById("addRepo").addEventListener("click", (e) => {
            e.preventDefault();
            window.open(`nitroless://add-repository?url=${window.location.protocol}//${window.location.hostname}`, "_blank").focus();
        })
    }

    if(document.getElementsByClassName("emote").length > 0) {
        for(let i = 0; i < document.getElementsByClassName("emote").length; i++) {
            document.getElementsByClassName("emote")[i].addEventListener("click", async () => {
                await window.navigator.clipboard.writeText(document.getElementsByClassName("emote")[i].id);
            })
        }
    }
});
