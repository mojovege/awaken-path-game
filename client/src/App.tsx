import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/home";
import GamePage from "./pages/simple-game";
import UserSetup from "./pages/user-setup";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/user-setup" component={UserSetup} />
      <Route path="/setup" component={UserSetup} />
      <Route path="/" component={Home} />
      <Route path="/game/:gameType" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-warm-gray-50">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
