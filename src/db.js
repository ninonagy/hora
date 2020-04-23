// Temporary database structure

var db = {
  // Used for showing profile page
  users: {
    u1: {
      name: 'Stacey Scott',
      email: 'stacey.scott@example.com',
      birthDate: '1996-02-03',
      address: '3307 Westheimer Rd',
      password: 'coyote',
      rating: 3.9,
      pictureLink:
        'https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340',
      favorsCreated: {
        f1: true,
        f2: true
      }
    },
    u2: {
      name: 'Ron Lawrence',
      email: 'ron.lawrence@example.com',
      birthDate: '2000-01-20',
      address: '9407 Ash Dr',
      password: 'luv2epus',
      rating: 4.6,
      pictureLink:
        'https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340',
      favorsCreated: {}
    },
    u3: {
      name: 'Alexis Chavez',
      email: 'alexis.chavez@example.com',
      birthDate: '1963-08-07',
      address: '257 Edwards Rd',
      password: 'butkus',
      rating: 4.5,
      pictureLink:
        'https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg?q=85&w=1340',
      favorsCreated: {
        f3: true
      }
    }
  },

  // Favors is a list for showing in search result
  // In future, seperate favors list on activeFavors and consumedFavors
  favors: {
    f1: {
      ownerId: 'u1',
      title: 'Zamjeniti žarulju u kući',
      description: 'Trebam pomoć da se mi zamijeni žarulja u mojem stanu.',
      location: 'Zagreb',
      dateCreated: '2020-04-22 21:58:30'
    },
    f2: {
      ownerId: 'u1',
      title: 'Iznošenje starog namještaja',
      description: 'Iznosit ćemo stari namještaj van iz kuće.',
      location: 'Krk',
      dateCreated: '2020-04-20 08:20:58'
    },
    f3: {
      ownerId: 'u3',
      title: 'Izrada Web stranice',
      description: 'Treba mi pomoć oko dovršavanja dijela osobne web stranice.',
      location: 'Sesvete',
      dateCreated: '2020-04-23 16:56:42'
    }
  },

  // Active favor deals made by owner and some user
  // userId -> favorId
  // Used for showing active deals that each user has.
  // This data should be visible only to selected user and owner?
  // More fields needed for each connection (dealDate, timeLimit...)
  activeConnections: {
    u1: 'f3',
    u2: 'f1'
  },

  images: {
    f1: 'data',
    f2: 'data',
    f3: 'data'
  },

  ratings: {}

  // ...
};

const paths = {
  user: '/users/{userId}',
  favor: '/favors/{favorId}',
  activeConnection: '/activeConnection/{userId}'
  // ...
};

function buildPath(path = '', ids = {}) {
  // ids = { userId: "u1" };
  for (let label in ids) {
    let idValue = ids[label];
    path = path.replace('{' + label + '}', idValue);
  }
  return path.split('/').filter(i => i !== '/' && i !== '');
}

function returnValue(path = '', ids = {}) {
  if (path === '') return;
  let paths = buildPath(path, ids);
  // loop through keys to get value
  let value = db;
  paths.forEach(p => {
    value = value[p];
  });
  return value;
}

function storeValue(path = '', ids = {}, value = {}) {
  if (path === '') return;
  let paths = buildPath(path, ids);

  // https://medium.com/data-scraper-tips-tricks/safely-read-write-in-deeply-nested-objects-js-a1d9ddd168c6
  const store = (paths, value, obj) => {
    if (paths.length > 1) {
      if (!obj.hasOwnProperty(paths[0]) || typeof obj[paths[0]] !== 'object')
        obj[paths[0]] = {};
      return store(paths.slice(1), value, obj[paths[0]]);
    } else {
      obj[paths[0]] = value;
      return true;
    }
  };

  store(paths, value, db);
}

// Return object as array with id in each entry
function arrayWithId(obj) {
  return Object.keys(obj).map(key => {
    obj[key]['id'] = key;
    return obj[key];
  });
}

// Database functions

function getUser(id) {
  return returnValue(paths.user, { userId: id });
}

function getFavor(id) {
  return returnValue(paths.favor, { favorId: id });
}

function getFavorsList() {
  return arrayWithId(getFavor(''));
}

function storeFavor(id, data = {}) {
  storeValue(paths.favor, { favorId: id }, data);
}

// ...

// export db functions
export { getUser, getFavor, storeFavor, getFavorsList };
