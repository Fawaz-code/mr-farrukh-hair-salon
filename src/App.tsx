import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Pricing from '@/pages/Pricing';
import Gallery from '@/pages/Gallery';
import Book from '@/pages/Book';
import Team from '@/pages/Team';
import Contact from '@/pages/Contact';
import Admin from '@/pages/Admin';
import { PageLayout } from '@/components/layout/PageLayout';

const queryClient = new QueryClient();

function Router() {
  return (
    <PageLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/book" component={Book} />
        <Route path="/team" component={Team} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </PageLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
