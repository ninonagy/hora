// Temporary database structure

// https://capacitor.ionicframework.com/docs/apis/storage/
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

var db = {
  // Used for showing profile page
  users: {
    u1: {
      name: "Stacey Scott",
      email: "stacey.scott@example.com",
      birthDate: "1996-02-03",
      location: "Zagreb",
      password: "coyote",
      rating: 3.9,
      timeSpent: 0,
      timeEarned: 3,
      skills: ["Matematika", "Umjetnik", "Plesanje"],
      pictureLink:
        "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340",
      favorsCreated: {
        f1: true,
        f2: true,
      },
    },
    u2: {
      name: "Ron Lawrence",
      email: "ron.lawrence@example.com",
      birthDate: "2000-01-20",
      location: "Rijeka",
      password: "luv2epus",
      rating: 4.6,
      timeSpent: 0,
      timeEarned: 3,
      skills: ["Jezici", "Slikanje", "Sviranje"],
      pictureLink:
        "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340",
      favorsCreated: {},
    },
    u3: {
      name: "Alexis Chavez",
      email: "alexis.chavez@example.com",
      birthDate: "1963-08-07",
      location: "Sesvete",
      password: "butkus",
      rating: 4.5,
      timeSpent: 0,
      timeEarned: 3,
      skills: ["Čitanje", "Čuvanje djece", "Trčanje"],
      pictureLink:
        "https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340",
      favorsCreated: {
        f3: true,
      },
    },
  },

  // Favors is a list for showing in search result
  // In future, seperate favors list on activeFavors and consumedFavors
  favors: {
    f1: {
      ownerId: "u1",
      title: "Zamjeniti žarulju u kući",
      description: "Trebam pomoć da se mi zamijeni žarulja u mojem stanu.",
      location: "Zagreb",
      dateCreated: "2020-04-22 21:58:30",
      dateDue: "2020-04-28 20:00:00",
    },
    f2: {
      ownerId: "u1",
      title: "Goodbye... Fancypants! Be a pal and tell me, Am I a good man? ",
      description:
        "Nosey parker. What? What?! WHAT?! People who talk about infallibility are usually on very shaky ground. No… No-no-no-no-wait-wait-wait-wait… I remember I'm-I-I… I'm with my father, we're lying back in the grass, it's a warm Gallifreyan night— Let's go in!",
      location: "Krk",
      dateCreated: "2020-04-20 08:20:58",
      dateDue: "2020-04-30 18:00:00",
    },
    f3: {
      ownerId: "u3",
      title: "Izrada Web stranice",
      description: "Treba mi pomoć oko dovršavanja dijela osobne web stranice.",
      location: "Sesvete",
      dateCreated: "2020-04-23 16:56:42",
      dateDue: "2020-05-01 16:00:00",
    },
  },

  // Active favor deals made by owner and some user
  // userId -> favorId
  // Used for showing active deals that each user has.
  // This data should be visible only to selected user and owner?
  // More fields needed for each connection (dealDate, timeLimit...)
  activeConnections: {
    u1: "f3",
    u2: "f1",
  },

  images: {
    f1: "data",
    f2: "data",
    f3: "data",
  },

  ratings: {},

  // ...
};

const db_key = "db";

async function setDB() {
  await Storage.set({
    key: db_key,
    value: JSON.stringify(db),
  });
}

async function getDB() {
  const ret = await Storage.get({ key: db_key });
  let value = null;
  if (ret.value) {
    value = JSON.parse(ret.value);
    db = value;
  }
  return value;
}

const paths = {
  user: "/users/{userId}",
  favor: "/favors/{favorId}",
  activeConnection: "/activeConnection/{userId}",
  // ...
};

function buildPath(path = "", ids = {}) {
  // ids = { userId: "u1" };
  for (let label in ids) {
    let idValue = ids[label];
    path = path.replace("{" + label + "}", idValue);
  }
  return path.split("/").filter((i) => i !== "/" && i !== "");
}

function returnValue(path = "", ids = {}) {
  if (path === "") return;
  let paths = buildPath(path, ids);
  let connection = getDB();
  return connection.then((db) => {
    let value = db;
    // loop through keys to get value
    paths.forEach((p) => {
      value = value[p];
    });
    return value;
  });
}

function storeValue(path = "", ids = {}, value = {}) {
  if (path === "") return;
  let paths = buildPath(path, ids);

  // https://medium.com/data-scraper-tips-tricks/safely-read-write-in-deeply-nested-objects-js-a1d9ddd168c6
  const store = (paths, value, obj) => {
    if (paths.length > 1) {
      if (!obj.hasOwnProperty(paths[0]) || typeof obj[paths[0]] !== "object")
        obj[paths[0]] = {};
      return store(paths.slice(1), value, obj[paths[0]]);
    } else {
      obj[paths[0]] = value;
      return true;
    }
  };

  store(paths, value, db);
  // update local database
  setDB();
}

// Return object as array with id in each entry
function arrayWithId(obj) {
  return Object.keys(obj).map((key) => {
    obj[key]["id"] = key;
    return obj[key];
  });
}

// https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
function uid() {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

// Database functions

async function getUser(id) {
  return returnValue(paths.user, { userId: id });
}

async function getFavor(id) {
  return returnValue(paths.favor, { favorId: id });
}

async function getFavorsList() {
  return getFavor("").then((data) => arrayWithId(data));
}

async function storeFavor(data = {}) {
  let id = uid();
  storeValue(paths.favor, { favorId: id }, data);
}

// ...

// Try to connect to localStorage
let connection = getDB();
connection.then((stored) => {
  if (stored == null) setDB();
});

// export db functions
export { getUser, getFavor, storeFavor, getFavorsList };
