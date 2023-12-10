import { Route, Switch, Redirect } from 'react-router-dom';

import AllRuns from './pages/AllRuns';
import RunDetail from './pages/RunDetail';
import NewRun from './pages/NewRun';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <Redirect to='/runs' />
        </Route>
        <Route path='/runs' exact>
          <AllRuns />
        </Route>
        <Route path='/runs/:runId'>
          <RunDetail />
        </Route>
        <Route path='/new-run'>
          <NewRun />
        </Route>
        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
