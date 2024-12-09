const COHORT = "2409-GHP-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// === State ===

const state = {
  events: [],
};
//GET method
/** Updates state with event from API */
async function getEvents() {
  try {
    const promise = await fetch(API_URL);
    const response = await promise.json();
    if (!response.success) {
      throw response.error;
    }
    state.events = response.data;
  } catch (error) {
    alert("Unable to load Events");
  }
}
//POST Method
/** Asks the API to create a new event based on the given `event` */
async function addEvents(newEvents) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvents),
    });
    if (!response.ok) {
      throw new Error(
        "Unable to add events due to Http error: " + response.status
      );
    }
  } catch (error) {
    alert(error.message);
  }
}
//DELETE method
/** Asks the API to delete the given event */
async function deleteEvents(events) {
  try {
    const response = await fetch(API_URL + "/" + events.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        "Unable to delete event due to Http error: " + response.status
      );
    }
    render();
  } catch (error) {
    alert(error.message);
  }
}

// === Render ===

/** Renders events from state */
function renderEvents() {
  const eventList = document.querySelector("#events");

  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventsCards = state.events.map((event) => {
    const card = document.createElement("li");
    //H1 for Event Name
    const h1 = document.createElement("h1");
    h1.textContent = event.name;

    //H2 for Event Description
    const h2 = document.createElement("h2");
    h2.textContent = event.description;

    //H4 for the date
    const h4 = document.createElement("h4");
    h4.textContent = event.date;

    //H3 for the location
    const h3 = document.createElement("h3");
    h3.textContent = event.location;

    //Button to Delete the Event
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", async () => {
      await deleteEvents(event);
    });

    card.append(h1, h2, h4, h3, deleteButton);
    return card;
  });

  eventList.replaceChildren(...eventsCards);
}
/** Syncs state with the API and rerender */
async function render() {
  await getEvents();
  renderEvents();
}

// === Script ===

render();

// Add listener to form
const form = document.getElementById("addEvent");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const eventDate = new Date(form.date.value).toISOString();

  const events = {
    name: form.name.value,
    description: form.description.value,
    date: eventDate,
    location: form.location.value,
  };

  await addEvents(events);
  render();
});
