import React from 'react';

import { Route } from 'react-router';

import { IonRouterOutlet } from '@ionic/react';

import List from './FavorsListPage';
import Detail from './FavorDetailPage';

const SearchPage = ({ match }) => {
  return (
    <IonRouterOutlet>
      <Route exact path={`${match.url}`} component={List} />
      <Route path={`${match.url}/favor/:id`} component={Detail} />
    </IonRouterOutlet>
  );
};

export default SearchPage;
