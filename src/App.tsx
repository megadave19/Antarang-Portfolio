import { lazy, Suspense } from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { useVisitorTracking } from "./hooks/useVisitorTracking";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  // Logs a `visitor` custom event when the URL carries ?u=<id> or UTM params.
  useVisitorTracking();

  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
      <Analytics />
    </>
  );
};

export default App;
