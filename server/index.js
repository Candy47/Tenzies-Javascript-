import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import React, { createElement } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com"
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Pacifico&display=swap"
  }
  // Add new font stylesheet
];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white"
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      className: "die-button",
      style: styles,
      onClick: () => props.hold(props.id),
      "aria-pressed": props.isHeld,
      "aria-label": `Die with value ${props.value},${props.isHeld} ? "held" : "not held"}`,
      children: props.value
    }
  );
}
const Game = withComponentProps(function Game2() {
  const [dice, setDice] = React.useState(() => generateAllNewDice());
  const gameWon = dice.every((die) => die.isHeld) && dice.every((die) => die.value === dice[0].value);
  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }));
  }
  const diceElements = dice.map((dieObj) => /* @__PURE__ */ jsx(Die, {
    value: dieObj.value,
    isHeld: dieObj.isHeld,
    hold: holdDice,
    id: dieObj.id
  }, dieObj.id));
  function rollDice() {
    if (!gameWon) {
      setDice((prevDice) => {
        return prevDice.map((die) => {
          return die.isHeld ? die : {
            ...die,
            value: Math.ceil(Math.random() * 6)
          };
        });
      });
    } else {
      setDice(generateAllNewDice());
    }
  }
  function holdDice(id) {
    setDice((prevDice) => {
      return prevDice.map((die) => {
        return die.id === id ? {
          ...die,
          isHeld: !die.isHeld
        } : die;
      });
    });
  }
  return /* @__PURE__ */ jsxs("main", {
    children: [gameWon && /* @__PURE__ */ jsx(Confetti, {}), /* @__PURE__ */ jsxs("div", {
      className: "game-box",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "title",
        children: "Tenzies"
      }), /* @__PURE__ */ jsx("p", {
        className: "instructions",
        children: "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."
      }), /* @__PURE__ */ jsx("div", {
        className: "dice-grid",
        children: diceElements
      }), /* @__PURE__ */ jsx("button", {
        className: "roll-button",
        onClick: rollDice,
        children: gameWon ? "New Game" : "Roll"
      })]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Game
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-F_MR5qf5.js", "imports": ["/assets/chunk-KNED5TY2-DDSDFUJj.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CGYwzZUN.js", "imports": ["/assets/chunk-KNED5TY2-DDSDFUJj.js", "/assets/with-props-Bi3CUFkV.js"], "css": ["/assets/root-DtELgxCr.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/Game": { "id": "routes/Game", "parentId": "root", "path": "/", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Game-CNh3jdSr.js", "imports": ["/assets/with-props-Bi3CUFkV.js", "/assets/chunk-KNED5TY2-DDSDFUJj.js"], "css": ["/assets/Game-CNkQpRK6.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-25d2738a.js", "version": "25d2738a", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/Game": {
    id: "routes/Game",
    parentId: "root",
    path: "/",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
