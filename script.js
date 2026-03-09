// Data for Endangered Animals
const animals = [
    {
        name: "Eurasian Beaver",
        status: "Vulnerable",
        statusClass: "vulnerable",
        image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/379f4335-4f44-4229-81ea-89d9f53383a0/Eurasian%20Beaver%20close%20up%20(male)%20dreamstime_xxl_36802617.webp",
        description: "Known as nature's architects, beavers create wetlands that support diverse ecosystems.",
        cause: "Historically hunted to near extinction for their fur and meat; habitat loss."
    },
    {
        name: "Bornean Orangutan",
        status: "Critically Endangered",
        statusClass: "critically-endangered",
        image: "https://images.unsplash.com/photo-1541003713837-29d3807204eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Highly intelligent great apes known for their distinct red fur. They spend most of their time in trees.",
        cause: "Severe deforestation for palm oil plantations and illegal pet trade."
    },
    {
        name: "Hawksbill Sea Turtle",
        status: "Critically Endangered",
        statusClass: "critically-endangered",
        image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Crucial for maintaining the health of coral reefs by removing prey such as sponges.",
        cause: "Poaching for their beautiful shells, entanglement in fishing nets, and plastic pollution."
    },
    {
        name: "Sumatran Tiger",
        status: "Critically Endangered",
        statusClass: "critically-endangered",
        image: "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "The smallest surviving tiger subspecies, distinguished by heavy black stripes on their orange coats.",
        cause: "Relentless poaching for illegal wildlife trade and rampant deforestation."
    },
    {
        name: "Asian Elephant",
        status: "Endangered",
        statusClass: "endangered",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Highly social and intelligent mammals essential for maintaining forest and savanna ecosystems.",
        cause: "Habitat fragmentation, human-wildlife conflict, and poaching for ivory."
    },
    {
        name: "Polar Bear",
        status: "Vulnerable",
        statusClass: "vulnerable",
        image: "https://images.unsplash.com/photo-1544834789-9d7a28ff796c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "The apex predator of the Arctic, heavily dependent on sea ice for hunting seals.",
        cause: "Climate change causing rapid loss of sea ice habitat."
    }
];

// Load Animal Cards into the DOM
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("animal-grid");
    
    animals.forEach(animal => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${animal.image}" alt="${animal.name}">
            <div class="card-content">
                <h3 class="card-title">${animal.name}</h3>
                <span class="status ${animal.statusClass}">${animal.status}</span>
                <p>${animal.description}</p>
                <p class="cause"><strong>Threat:</strong> ${animal.cause}</p>
            </div>
        `;
        grid.appendChild(card);
    });
});

// Mini Games Tab Switching Logic
function switchGame(gameName) {
    // Hide all wrappers
    document.querySelectorAll('.game-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
    });
    // Un-highlight all buttons
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected game
    document.getElementById(`${gameName}-game-wrapper`).classList.add('active');
    
    // Highlight clicked button
    event.target.classList.add('active');

    // Cancel any running games to save resources (Global functions defined in game scripts)
    if(typeof stopBeaverGame === 'function') stopBeaverGame();
    if(typeof stopTurtleGame === 'function') stopTurtleGame();
    if(typeof stopOrangutanGame === 'function') stopOrangutanGame();

}
